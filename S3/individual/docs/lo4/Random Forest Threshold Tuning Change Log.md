# Random Forest Threshold Tuning Change Log

## Goal
Improve no-show detection quality for the minority class (`No-Show`) instead of optimizing only overall accuracy.

## Baseline Class-Weight Comparison

### Experiment A: `class_weight="balanced_subsample"`
- Accuracy: `0.7133`
- ROC-AUC: `0.5481`
- F1 (No-Show): `0.2321`
- Confusion matrix: `TN=201`, `FP=36`, `FN=50`, `TP=13`

### Experiment B: `class_weight="balanced"`
- Accuracy: `0.7233`
- ROC-AUC: `0.5397`
- F1 (No-Show): `0.2095`
- Confusion matrix: `TN=206`, `FP=31`, `FN=52`, `TP=11`

### Decision
Use `class_weight="balanced_subsample"` because it improves minority-class behavior:
- Higher `F1 (No-Show)` (`0.2321` vs `0.2095`)
- Higher recall for no-shows (`0.21` vs `0.17`)
- More true no-shows found (`TP=13` vs `TP=11`)


## Change 1: Move Tuning Logic to Reusable Library

### What changed
- Added reusable tuning utilities in `src/lib/tuning.py`:
  - `find_best_threshold(...)`
  - `tune_random_forest_with_threshold(...)`

### Why
- Keep model script clean and maintainable
- Reuse threshold tuning for other models
- Make all selection rules explicit and testable


## Change 2: Validation Split for Threshold Selection

### What changed
- `src/models/random_forest.py` now uses:
  - train split
  - validation split (for model + threshold selection)
  - test split (final evaluation only)

### Why
- Prevent overfitting threshold to test set
- Keep final evaluation unbiased


## Change 3: Tune RF Hyperparameters + Threshold

### What changed
- Hyperparameter grid search for:
  - `n_estimators`
  - `max_depth`
  - `min_samples_leaf`
- For each candidate model:
  - compute validation probabilities
  - sweep thresholds
  - select by best no-show F1 (with constraints)

### Why
- Default threshold `0.50` is usually suboptimal for imbalanced classification
- Best-performing model/threshold pair should be selected together


## Observed Issue After Initial Threshold Tuning

Initial unconstrained tuning selected threshold around `0.21`:
- Accuracy: `0.3533`
- ROC-AUC: `0.5683`
- PR-AUC: `0.3147`
- Recall (No-Show): `0.8730`
- F1 (No-Show): `0.3618`
- Confusion matrix: `TN=51`, `FP=186`, `FN=8`, `TP=55`

### Interpretation
- This threshold is too aggressive.
- It catches almost all no-shows (`FN` very low), but flags too many shows as no-show (`FP=186`), which is operationally costly.


## Change 4: Add Guardrails for Threshold Selection

### What changed in `src/lib/tuning.py`
- Added optional threshold constraints:
  - `min_precision`
  - `min_recall`
  - `min_threshold`
  - `max_threshold`
  - `threshold_step`
- Added precision to tuning result metadata.

### What changed in `src/models/random_forest.py`
- Applied stricter threshold policy:
  - `min_recall=0.35`
  - `min_precision=0.30`
  - `min_threshold=0.30`
  - `max_threshold=0.80`

### Why
- Keep recall-focused optimization
- Avoid operationally unacceptable false positive explosion
- Force tuning to pick a more realistic operating point


## Final Notes
- Accuracy alone is not the primary KPI for this problem.
- Main KPIs: `PR-AUC`, `Recall(No-Show)`, `F1(No-Show)`, and confusion matrix trade-off.
- Threshold should be selected based on business tolerance for false positives vs missed no-shows.

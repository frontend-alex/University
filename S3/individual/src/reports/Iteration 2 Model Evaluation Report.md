# Iteration 2 Model Evaluation Report (Random Forest + SMOTE)

## Document Info

| Field | Detail |
| --- | --- |
| LO | LO3 - Preparing, LO4 - Modelling |
| Project | Barbershop No-Show Predictor |
| Method | DOT Framework - Lab research (experiment) |
| Status | Sprint 1 - Algorithm changed and SMOTE added |

---

## 1. Introduction

This document reports the refreshed **Iteration 2 model evaluation** after changing the algorithm from Logistic Regression to Random Forest and adding **SMOTE** to handle class imbalance. The goal is to improve detection of the minority class (`No-Show`) while keeping evaluation focused on recall, F1, and confusion matrix behavior.

---

## 2. Changes Applied in This Iteration

| Change | What Changed | Why |
| --- | --- | --- |
| Algorithm change | Replaced Logistic Regression with `RandomForestClassifier` | Capture nonlinear patterns and feature interactions |
| Imbalance handling | Applied `SMOTE` on the training split only | Increase minority-class representation without leakage |
| Class weighting | Kept `class_weight='balanced'` | Further reduce majority-class bias during fitting |
| Evaluation focus | Kept ROC-AUC, F1 (No-Show), and confusion matrix | Accuracy alone is misleading for imbalanced data |

---

## 3. Experiment Setup

| Parameter | Value |
| --- | --- |
| Dataset size | 1500 rows |
| Train/test split | 80/20 (stratified on `no_show`) |
| Random seed | 42 |
| Resampling | `SMOTE(random_state=42)` on training set only |
| Model | `RandomForestClassifier(n_estimators=300, class_weight='balanced', n_jobs=-1)` |
| Prediction threshold | Default 0.5 (`model.predict`) |
| Features | 10 (same preprocessing pipeline as previous iteration) |

---

## 4. Results

### 4.1 Classification Report

| Class | Precision | Recall | F1-Score | Support |
| --- | --- | --- | --- | --- |
| Show (0) | 0.80 | 0.87 | 0.83 | 237 |
| No-Show (1) | 0.26 | 0.17 | 0.21 | 63 |
| **Accuracy** | | | **0.7233** | **300** |
| Macro avg | 0.53 | 0.52 | 0.52 | 300 |
| Weighted avg | 0.69 | 0.72 | 0.70 | 300 |

### 4.2 Confusion Matrix

| | Predicted: Show | Predicted: No-Show |
| --- | --- | --- |
| **Actual: Show** | 206 (TN) | 31 (FP) |
| **Actual: No-Show** | 52 (FN) | 11 (TP) |

### 4.3 Key Metrics

| Metric | Value |
| --- | --- |
| Accuracy | 0.7233 |
| ROC-AUC | 0.5397 |
| F1 (No-Show) | 0.2095 |
| No-Show Recall | 0.1746 |
| No-Show Precision | 0.2619 |

---

## 5. Comparison Snapshot

### 5.1 vs Baseline (Iteration 1 Logistic Regression)

| Metric | Iteration 1 Baseline | Iteration 2 (RF + SMOTE) | Change |
| --- | --- | --- | --- |
| Accuracy | 0.78 | 0.7233 | -0.0567 |
| No-Show Recall | 0.00 | **0.17** | **+0.17** |
| No-Show Precision | 0.00 | 0.26 | +0.26 |
| No-Show F1 | 0.00 | **0.21** | **+0.21** |
| True Positives | 0 | **11** | +11 |
| False Negatives | 63 | 52 | -11 |

### 5.2 vs Random Forest without SMOTE

| Metric | RF without SMOTE | RF + SMOTE | Change |
| --- | --- | --- | --- |
| Accuracy | 0.7867 | 0.7233 | -0.0634 |
| ROC-AUC | 0.5609 | 0.5397 | -0.0212 |
| No-Show F1 | 0.0588 | **0.2095** | **+0.1507** |
| No-Show Recall | 0.03 | **0.17** | **+0.14** |
| True Positives | 2 | **11** | +9 |
| False Positives | 3 | 31 | +28 |

---

## 6. Analysis

### 6.1 What Improved

- The model now catches more no-shows than before (`TP: 2 -> 11` compared with RF without SMOTE).
- Minority-class F1 improved strongly (`0.0588 -> 0.2095`), showing better balance between precision and recall for `No-Show`.
- The result confirms SMOTE reduces majority-class bias in predictions.

### 6.2 Remaining Issues

- `No-Show` recall is still low (0.17), so many missed no-shows remain (`FN=52`).
- ROC-AUC is weak (0.54), indicating limited class-separation quality.
- False positives increased (`FP=31`), which may reduce user trust if reminder actions are triggered too often.

### 6.3 Practical Interpretation

For business use, this model is better than majority-class behavior, but not yet reliable for operational decisions alone. It can be used as an early warning signal, but should be improved further before full automation.

---

## 7. Next Steps

1. Add threshold tuning on `predict_proba` to optimize `No-Show` F1 or recall target.
2. Tune Random Forest hyperparameters (`max_depth`, `min_samples_leaf`, `max_features`, `n_estimators`) with stratified CV and recall/F1-based scoring.
3. Compare SMOTE variants (`SMOTEENN`, `BorderlineSMOTE`) and/or `BalancedRandomForestClassifier`.
4. Improve features (e.g., no-show ratio, recent attendance behavior, time-slot risk buckets).

---

## 8. Summary

| Aspect | Result |
| --- | --- |
| Overall | Random Forest + SMOTE improves minority-class detection but remains moderate |
| Key win | `No-Show` F1 improved from 0.0588 to 0.2095 vs RF without SMOTE |
| Main trade-off | More false positives and lower overall accuracy |
| Current limitation | ROC-AUC 0.5397 indicates weak discriminative power |
| Top priority next | Threshold tuning + hyperparameter tuning with recall-focused cross-validation |

# Baseline Model Evaluation Report

## Document Info

| Field | Detail |
| --- | --- |
| LO | LO3 - Preparing, LO4 - Modelling |
| Project | Barbershop No-Show Predictor |
| Method | DOT Framework — Lab research (experiment) |
| Status | Sprint 1 — First Logistic Regression run |

---

## 1. Introduction

This document reports the results of the **first untweaked Logistic Regression run** on the synthetic barbershop dataset. No hyperparameter tuning, threshold adjustment, or feature engineering was applied. The purpose is to establish a baseline, identify weaknesses, and define concrete next steps for iteration.

---

## 2. Experiment Setup

| Parameter | Value |
| --- | --- |
| Dataset size | 1500 rows |
| Train/test split | 80/20 (stratified on `no_show`) |
| Random seed | 42 |
| Model | `LogisticRegression(max_iter=1000)` | 
| Regularisation | Default L2 (`C=1.0`) |
| Threshold | Default 0.5 |
| Features | 10 (all encoded/scaled during preprocessing) |

### Preprocessing Applied

| Feature | Transformation |
| --- | --- |
| `day_of_week` | Ordinal encoded (Mon=0 … Sat=5) |
| `hour_of_day` | MinMax scaled to [0, 1] |
| `lead_time_days` | MinMax scaled to [0, 1] |
| `is_returning_customer` | Binary int (0/1) |
| `booking_channel` | Ordinal encoded (app=0, phone=1, walk-in=2) |
| `service_type` | Ordinal encoded (beard_trim=0, haircut=1, combo=2) |
| `reminder_sent` | Binary int (0/1) |
| `barber_id` | Label encoded (B01→0, B02→1, B03→2, B04→3) |
| `previous_no_shows` | MinMax scaled to [0, 1] |
| `total_previous_visits` | MinMax scaled to [0, 1] |

---

## 3. Results

### 3.1 Classification Report

| Class | Precision | Recall | F1-Score | Support |
| --- | --- | --- | --- | --- |
| Show (0) | 0.79 | 0.98 | 0.87 | 237 |
| No-Show (1) | 0.00 | 0.00 | 0.00 | 63 |
| **Accuracy** | | | **0.78** | **300** |
| Macro avg | 0.39 | 0.49 | 0.44 | 300 |
| Weighted avg | 0.62 | 0.78 | 0.69 | 300 |

### 3.2 Confusion Matrix

| | Predicted: Show | Predicted: No-Show |
| --- | --- | --- |
| **Actual: Show** | 233 (TN) | 4 (FP) |
| **Actual: No-Show** | 63 (FN) | 0 (TP) |

### 3.3 Model Coefficients (Feature Importance)

| Feature | Coefficient | Direction |
| --- | --- | --- |
| `previous_no_shows` | +1.243 | Strong positive — strongest no-show predictor |
| `booking_channel` | +0.357 | Positive — walk-in increases risk |
| `hour_of_day` | +0.215 | Positive — extreme hours increase risk |
| `service_type` | +0.153 | Weak positive |
| `lead_time_days` | +0.123 | Weak positive |
| `barber_id` | +0.069 | Negligible |
| `day_of_week` | −0.036 | Negligible |
| `is_returning_customer` | −0.491 | Negative — returning customers are more reliable |
| `reminder_sent` | −0.577 | Negative — reminders reduce no-show risk |
| `total_previous_visits` | −0.602 | Negative — more visits means more reliable |

---

## 4. Analysis of Baseline Performance

### 4.1 The Core Problem: The Model Predicts Almost Everything as "Show"

The model achieves 78% accuracy, but this is **misleading**. The dataset has approximately 21% no-shows, so a naive classifier that always predicts "Show" would also score ~79%. The baseline model has essentially learned to do exactly this:

- **No-Show recall = 0.00** — the model fails to catch a single no-show
- All 63 actual no-shows in the test set are classified as "Show" (63 false negatives)
- Only 4 predictions of "No-Show" were made, and all were wrong

### 4.2 Why This Happens

1. **Class imbalance:** With ~79% "Show" vs ~21% "No-Show", the default 0.5 decision threshold makes it almost always more "profitable" (in terms of log-loss) to predict the majority class
2. **Default threshold:** Logistic Regression outputs probabilities. At a 0.5 threshold, the model needs to be more than 50% confident of a no-show to flag it, but most no-show probabilities likely fall in the 0.20–0.45 range
3. **L2 regularisation:** The default `C=1.0` may be shrinking the coefficients too aggressively, pushing predictions toward the majority class

### 4.3 What the Coefficients Tell Us

Despite the poor classification, the model has learned **correct directional signals** from the domain:

- `previous_no_shows` (+1.24) is the strongest predictor — aligns with domain research
- `reminder_sent` (−0.58) and `is_returning_customer` (−0.49) are protective — matches expectations
- `booking_channel` (+0.36) shows walk-in/phone are riskier than app — correct
- `total_previous_visits` (−0.60) indicates loyal customers are reliable — correct

The model **understands the patterns** but cannot express them at the default threshold.

---

## 5. Next Steps to Achieve Higher Accuracy

### 5.1 Threshold Tuning (Priority: High)

The most impactful immediate change. Instead of the default 0.5 threshold:

- Lower the decision threshold (e.g. 0.25 or 0.30) to flag more appointments as no-show
- Use the **Precision-Recall curve** to find the optimal threshold that maximises F1 or recall at acceptable precision
- Domain justification: a false alarm (unnecessary reminder) costs almost nothing; a missed no-show costs a full slot (~20 EUR)

### 5.2 Class Imbalance Handling (Priority: High)

- Use `class_weight='balanced'` in `LogisticRegression` to automatically upweight the minority class
- Alternatively, apply **SMOTE** (Synthetic Minority Oversampling Technique) to generate synthetic no-show samples in the training set
- Consider **stratified cross-validation** to ensure each fold sees representative no-show rates

### 5.3 Hyperparameter Tuning (Priority: Medium)

- Tune the regularisation strength `C` using `GridSearchCV` or `RandomizedSearchCV`
- Test values like `C = [0.01, 0.1, 1, 10, 100]` to find the best bias-variance trade-off
- Use `scoring='f1'` or `scoring='recall'` in the grid search since accuracy is misleading for imbalanced classes

### 5.4 Feature Engineering (Priority: Medium)

- Create a **no-show ratio** feature: `previous_no_shows / total_previous_visits` (captures unreliability rate better than raw counts)
- Add **interaction terms** (e.g. `lead_time_days × is_returning_customer`) to capture combined effects
- Bin `hour_of_day` into morning/midday/evening categories instead of scaling linearly
- Consider dropping `barber_id` and `day_of_week` which have near-zero coefficients

### 5.5 Cross-Validation (Priority: Medium)

- Replace the single train/test split with **5-fold or 10-fold stratified cross-validation** to get more robust performance estimates
- Report mean ± std for all metrics across folds

### 5.6 Evaluation Metrics (Priority: High)

- Stop relying on accuracy as the primary metric
- Switch to **Recall**, **F1-Score**, and **ROC-AUC** as primary metrics
- Plot the **ROC curve** and **Precision-Recall curve** to understand the full trade-off space
- As stated in the Project Plan: "Recall — a missed no-show (false negative) costs the barbershop a wasted slot; a false alarm is just an unnecessary reminder"

---

## 6. Summary

| Aspect | Baseline Result |
| --- | --- |
| Accuracy | 0.78 (misleading — matches naive majority-class predictor) |
| No-Show Recall | 0.00 (critical failure — no no-shows detected) |
| No-Show Precision | 0.00 (no true positive predictions made) |
| F1 (macro) | 0.44 |
| Key insight | Model learns correct feature directions but fails at default threshold |
| Top priority | Threshold tuning + class weight balancing |
| Expected improvement | Recall > 0.50 with threshold + class_weight='balanced' |

The baseline establishes that the raw Logistic Regression with default settings is **not usable for no-show prediction**. However, the learned coefficients confirm the model captures domain-relevant patterns. The next iteration should focus on **threshold tuning** and **class imbalance handling**, which are expected to dramatically improve recall without changing the underlying model architecture.

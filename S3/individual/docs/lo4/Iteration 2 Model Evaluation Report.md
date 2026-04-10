# Iteration 2 Model Evaluation Report

## Document Info

| Field | Detail |
| --- | --- |
| LO | LO3 - Preparing, LO4 - Modelling |
| Project | Barbershop No-Show Predictor |
| Method | DOT Framework - Lab research (experiment) |
| Status | Sprint 1 - High-priority fixes applied |

---

## 1. Introduction

This document reports the results of the **second Logistic Regression iteration**, where all three high-priority fixes identified in the Baseline Model Evaluation Report were applied. No feature engineering or hyperparameter grid search was performed - only the three targeted fixes.

---

## 2. Changes Applied

| Fix | What Changed | Why |
| --- | --- | --- |
| Class weight balancing | Added `class_weight='balanced'` | Upweights minority no-show class so the model does not ignore it |
| Threshold tuning | Replaced default 0.5 with optimal threshold from precision-recall curve | Allows the model to flag no-shows at lower confidence levels |
| Recall-focused evaluation | Added ROC-AUC, F1 (No-Show), confusion matrix to output | Accuracy alone is misleading for imbalanced datasets |

---

## 3. Experiment Setup

| Parameter | Value |
| --- | --- |
| Dataset size | 1500 rows |
| Train/test split | 80/20 (stratified on `no_show`) |
| Random seed | 42 |
| Model | `LogisticRegression(max_iter=1000, class_weight='balanced')` |
| Regularisation | Default L2 (`C=1.0`) |
| Threshold | 0.5073 (optimised for F1 via precision-recall curve) |
| Features | 10 (same preprocessing as baseline) |

---

## 4. Results

### 4.1 Classification Report

| Class | Precision | Recall | F1-Score | Support |
| --- | --- | --- | --- | --- |
| Show (0) | 0.85 | 0.57 | 0.69 | 237 |
| No-Show (1) | 0.28 | 0.62 | 0.38 | 63 |
| **Accuracy** | | | **0.58** | **300** |
| Macro avg | 0.56 | 0.60 | 0.53 | 300 |
| Weighted avg | 0.73 | 0.58 | 0.62 | 300 |

### 4.2 Confusion Matrix

| | Predicted: Show | Predicted: No-Show |
| --- | --- | --- |
| **Actual: Show** | 136 (TN) | 101 (FP) |
| **Actual: No-Show** | 24 (FN) | 39 (TP) |

### 4.3 Key Metrics

| Metric | Value |
| --- | --- |
| ROC-AUC | 0.5588 |
| F1 (No-Show) | 0.3842 |
| Optimal threshold | 0.5073 |

### 4.4 Model Coefficients

| Feature | Coefficient | Direction |
| --- | --- | --- |
| `previous_no_shows` | +1.295 | Strong positive - strongest no-show predictor |
| `booking_channel` | +0.382 | Positive - walk-in increases risk |
| `hour_of_day` | +0.236 | Positive - extreme hours increase risk |
| `lead_time_days` | +0.185 | Weak positive |
| `service_type` | +0.149 | Weak positive |
| `barber_id` | +0.070 | Negligible |
| `day_of_week` | -0.031 | Negligible |
| `is_returning_customer` | -0.472 | Negative - returning customers are more reliable |
| `reminder_sent` | -0.593 | Negative - reminders reduce no-show risk |
| `total_previous_visits` | -0.643 | Negative - more visits means more reliable |

---

## 5. Comparison with Baseline

| Metric | Baseline | Iteration 2 | Change |
| --- | --- | --- | --- |
| Accuracy | 0.78 | 0.58 | -0.20 (expected trade-off) |
| No-Show Recall | 0.00 | **0.62** | **+0.62** |
| No-Show Precision | 0.00 | 0.28 | +0.28 |
| No-Show F1 | 0.00 | **0.38** | **+0.38** |
| ROC-AUC | N/A | 0.56 | New metric |
| True Positives | 0 | **39** | +39 no-shows caught |
| False Negatives | 63 | 24 | -39 fewer missed no-shows |
| False Positives | 4 | 101 | +97 more false alarms |

---

## 6. Analysis

### 6.1 What Improved

The model now **actually detects no-shows**. With 62% recall the model catches 39 out of 63 no-shows in the test set. This is the critical fix - the baseline caught zero.

The accuracy dropped from 78% to 58%, but this is an **expected and acceptable trade-off**. As stated in the Project Plan, the priority metric is Recall because "a missed no-show costs the barbershop a wasted slot; a false alarm is just an unnecessary reminder."

### 6.2 What Still Needs Improvement

1. **Precision is low (0.28)** - for every real no-show the model catches, it also flags about 2.6 shows as no-shows. This means many unnecessary reminders, which is low-cost but not ideal
2. **ROC-AUC of 0.56 is weak** - only slightly better than random (0.50), indicating the model's overall discriminative ability is limited
3. **101 false positives** - the model over-predicts no-shows. While false alarms are cheap (just an unnecessary reminder), a high false alarm rate could lead the owner to distrust the model
4. **Coefficients barely changed** - the `class_weight='balanced'` mainly affects the decision boundary, not the learned feature relationships

### 6.3 Domain Interpretation

In practical terms for the barbershop owner:

- **39 out of 63 would-be no-shows** get flagged and could receive reminder calls or be overbooked - saving approximately 39 x 20 EUR = 780 EUR in recovered revenue per test period
- **101 reliable customers** would receive unnecessary reminders - low cost but slightly annoying
- **24 no-shows still slip through** - room for improvement

---

## 7. Next Steps (Medium Priority)

### 7.1 Hyperparameter Tuning

- Grid search over `C = [0.01, 0.1, 1, 10, 100]` using `scoring='f1'`
- This may improve the precision/recall balance

### 7.2 Feature Engineering

- Create `no_show_ratio = previous_no_shows / max(total_previous_visits, 1)` to capture unreliability rate
- Add interaction terms (e.g. `lead_time_days x is_returning_customer`)
- Bin `hour_of_day` into morning/midday/evening
- Consider dropping `barber_id` and `day_of_week` (coefficients near zero)

### 7.3 Cross-Validation

- Replace single train/test split with 5-fold stratified cross-validation
- Report mean +- std for all metrics to assess stability

### 7.4 Alternative Resampling

- Try SMOTE instead of class weight balancing
- Compare performance with undersampling the majority class

---

## 8. Summary

| Aspect | Result |
| --- | --- |
| Overall | High-priority fixes transformed the model from useless to functional |
| Key win | No-Show Recall went from 0.00 to 0.62 - the model now catches no-shows |
| Key trade-off | Accuracy dropped from 0.78 to 0.58, but accuracy was misleading to begin with |
| ROC-AUC | 0.56 - model has weak but real discriminative ability |
| Business value | ~39 no-shows caught per test period, enabling proactive reminders |
| Top priority next | Hyperparameter tuning and feature engineering to improve precision without losing recall |

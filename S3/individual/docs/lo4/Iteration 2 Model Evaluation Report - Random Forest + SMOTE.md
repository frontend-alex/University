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

This report documents Iteration 2 after changing the algorithm from Logistic Regression to Random Forest and adding SMOTE for class imbalance. The objective is to improve minority-class (`No-Show`) detection while keeping the test set untouched.

---

## 2. Changes Applied

| Change | What Changed | Why |
| --- | --- | --- |
| Algorithm | Replaced Logistic Regression with `RandomForestClassifier` | Capture nonlinear patterns and interactions |
| Resampling | Added `SMOTE` on training data only | Reduce majority-class bias without leakage |
| Class imbalance | Kept `class_weight='balanced'` | Strengthen minority learning during fit |
| Metrics | Kept ROC-AUC, F1 (No-Show), confusion matrix | Accuracy alone is misleading for imbalance |

---

## 3. Experiment Setup

| Parameter | Value |
| --- | --- |
| Dataset size | 1500 rows |
| Train/test split | 80/20 stratified on `no_show` |
| Random seed | 42 |
| SMOTE | `SMOTE(random_state=42)` on `X_train, y_train` only |
| Model | `RandomForestClassifier(n_estimators=300, class_weight='balanced', n_jobs=-1)` |
| Threshold | Default 0.5 (`model.predict`) |
| Features | 10 (same preprocessing as baseline) |

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

## 5. Comparison

### 5.1 vs Baseline Logistic Regression

| Metric | Baseline | Iteration 2 (RF + SMOTE) | Change |
| --- | --- | --- | --- |
| Accuracy | 0.78 | 0.7233 | -0.0567 |
| No-Show Recall | 0.00 | **0.17** | **+0.17** |
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

- Minority detection improved compared with RF without SMOTE (`TP: 2 -> 11`).
- The model still misses many no-shows (`FN=52`), so recall remains low.
- ROC-AUC is still weak (`0.54`), indicating limited discrimination.
- Trade-off is clear: higher no-show capture, but more false positives.

---

## 7. Next Steps

1. Add threshold tuning on `predict_proba` to optimize no-show recall/F1.
2. Tune RF hyperparameters (`max_depth`, `min_samples_leaf`, `max_features`) using stratified CV.
3. Compare SMOTE variants (`BorderlineSMOTE`, `SMOTEENN`) and `BalancedRandomForestClassifier`.
4. Add stronger behavior features (e.g., no-show ratio, recent attendance patterns).

---

## 8. Summary

| Aspect | Result |
| --- | --- |
| Overall | Better minority detection than baseline and RF without SMOTE |
| Key improvement | `No-Show` F1 improved to 0.2095 |
| Main limitation | Recall remains low and ROC-AUC is weak |
| Priority | Threshold tuning and model tuning in cross-validation |

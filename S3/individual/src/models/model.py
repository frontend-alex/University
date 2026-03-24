"""Train and evaluate a Logistic Regression model for no-show prediction."""

from __future__ import annotations

import joblib
import numpy as np
import pandas as pd

from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    classification_report,
    accuracy_score,
    confusion_matrix,
    f1_score,
    precision_recall_curve,
    roc_auc_score,
)

from src.utils.config import FEATURES, TARGET, MODEL_FILE, PROCESSED_DATA_DIR


def _find_best_threshold(y_true, y_proba) -> float:
    """Find the decision threshold that maximises the F1-score for the
    positive (no-show) class using the precision-recall curve."""
    precisions, recalls, thresholds = precision_recall_curve(y_true, y_proba)

    f1_scores = np.where(
        (precisions[:-1] + recalls[:-1]) > 0,
        2 * precisions[:-1] * recalls[:-1] / (precisions[:-1] + recalls[:-1]),
        0,
    )
    best_idx = np.argmax(f1_scores)
    return float(thresholds[best_idx])


def train_logistic_regression(
    df: pd.DataFrame,
    *,
    test_size: float = 0.2,
    random_state: int = 42,
    save: bool = True,
) -> tuple[LogisticRegression, float, str]:
    """Train a Logistic Regression classifier on preprocessed barbershop data.

    High-priority fixes applied (iteration 2):
      - class_weight='balanced' to handle class imbalance
      - Optimal threshold via precision-recall curve (instead of default 0.5)
      - Recall / F1 / ROC-AUC reported alongside accuracy

    Args:
        df: Preprocessed DataFrame (all features already encoded / scaled).
        test_size: Fraction of data reserved for testing.
        random_state: Seed for reproducible train/test split.
        save: If True, persist the trained model as a .pkl file.

    Returns:
        Tuple of (trained model, accuracy, classification report string).
    """
    # ------------------------------------------------------------------ #
    # 1. Split features / target                                          #
    # ------------------------------------------------------------------ #
    X = df[FEATURES]
    y = df[TARGET]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=test_size,
        random_state=random_state,
        stratify=y,
    )

    # ------------------------------------------------------------------ #
    # 2. Train Logistic Regression (balanced class weights)               #
    # ------------------------------------------------------------------ #
    model = LogisticRegression(
        max_iter=1000,
        random_state=random_state,
        class_weight="balanced",
    )
    model.fit(X_train, y_train)

    # ------------------------------------------------------------------ #
    # 3. Find optimal threshold via precision-recall curve                #
    # ------------------------------------------------------------------ #
    y_proba = model.predict_proba(X_test)[:, 1]
    best_threshold = _find_best_threshold(y_test, y_proba)
    y_pred = (y_proba >= best_threshold).astype(int)

    # ------------------------------------------------------------------ #
    # 4. Evaluate with recall-focused metrics                             #
    # ------------------------------------------------------------------ #
    accuracy = accuracy_score(y_test, y_pred)
    report = classification_report(y_test, y_pred, target_names=["Show", "No-Show"])
    roc_auc = roc_auc_score(y_test, y_proba)
    f1_noshow = f1_score(y_test, y_pred)
    cm = confusion_matrix(y_test, y_pred)

    print(f"\n{'='*60}")
    print(f" Logistic Regression - No-Show Prediction (Iteration 2)")
    print(f"{'='*60}")
    print(f" Threshold:       {best_threshold:.4f}  (optimised for F1)")
    print(f" Accuracy:        {accuracy:.4f}")
    print(f" ROC-AUC:         {roc_auc:.4f}")
    print(f" F1 (No-Show):    {f1_noshow:.4f}")
    print(f"\n{report}")
    print(f" Confusion Matrix:")
    print(f"   TN={cm[0][0]}  FP={cm[0][1]}")
    print(f"   FN={cm[1][0]}  TP={cm[1][1]}")

    # ------------------------------------------------------------------ #
    # 5. Persist model                                                    #
    # ------------------------------------------------------------------ #
    if save:
        PROCESSED_DATA_DIR.mkdir(parents=True, exist_ok=True)
        joblib.dump(model, MODEL_FILE)
        print(f"\n Model saved -> {MODEL_FILE}")

    return model, accuracy, report

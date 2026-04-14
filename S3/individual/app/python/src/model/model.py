import pickle
from typing import Any

import pandas as pd
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, f1_score, roc_auc_score
from sklearn.model_selection import train_test_split
from xgboost import XGBClassifier

from src.config.config import (
    FEATURES,
    MODEL_ARTIFACTS_DIR,
    MODEL_BEST_XGB_PARAMS,
    MODEL_FILENAME,
    MODEL_THRESHOLD,
    TARGET,
    MODEL_FILENAME_RANDOMFOREST,
)


def train_xgboost_randomized_early_stopping(
    df: pd.DataFrame,
    test_size: float = 0.2,
    random_state: int = 42,
    save: bool = True,
    model_filename: str = MODEL_FILENAME,
) -> tuple[XGBClassifier, float, str]:

    # Kept function name for compatibility, but trains the fixed best XGBoost model.
    X = df[FEATURES]
    y = df[TARGET]

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=test_size,
        random_state=random_state,
        stratify=y,
    )

    model = XGBClassifier(**MODEL_BEST_XGB_PARAMS, random_state=random_state, n_jobs=-1)
    model.fit(X_train, y_train)

    y_proba = model.predict_proba(X_test)[:, 1]
    y_pred = (y_proba >= MODEL_THRESHOLD).astype(int)

    accuracy = accuracy_score(y_test, y_pred)
    roc_auc = roc_auc_score(y_test, y_proba)
    f1_noshow = f1_score(y_test, y_pred)
    report = classification_report(y_test, y_pred, target_names=["Show", "No-Show"])
    cm = confusion_matrix(y_test, y_pred)

    print(f"\n{'='*60}")
    print("  XGBoost (fixed best params) — No-Show Prediction")
    print(f"{'='*60}")
    print(f"  Threshold:     {MODEL_THRESHOLD:.4f}")
    print(f"  Accuracy:      {accuracy:.4f}")
    print(f"  ROC-AUC:       {roc_auc:.4f}")
    print(f"  F1 (No-Show):  {f1_noshow:.4f}")
    print(f"\n{report}")
    print("  Confusion Matrix:")
    print(f"    TN={cm[0][0]}  FP={cm[0][1]}")
    print(f"    FN={cm[1][0]}  TP={cm[1][1]}")

    if save:
        MODEL_ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)
        model_path = MODEL_ARTIFACTS_DIR / model_filename
        bundle: dict[str, Any] = {
            "model": model,
            "threshold": MODEL_THRESHOLD,
            "features": FEATURES,
            "best_params": MODEL_BEST_XGB_PARAMS,
            "metrics": {
                "test_accuracy": float(accuracy),
                "test_f1": float(f1_noshow),
                "test_roc_auc": float(roc_auc),
            },
        }
        with model_path.open("wb") as file:
            pickle.dump(bundle, file)
        print(f"\nSaved model bundle to: {model_path.resolve()}")

    return model, float(accuracy), report

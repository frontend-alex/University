import pandas as pd

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, f1_score, roc_auc_score

from src.config.config import (
    FEATURES,
    MODEL_FILENAME_RANDOM_FOREST,
    TARGET
)
from src.utils import save_model

def random_forest_model(
    df: pd.DataFrame,
    test_size: float = 0.2,
    random_state: int = 42,
    save: bool = True,
    model_filename: str = MODEL_FILENAME_RANDOM_FOREST,
) -> tuple[RandomForestClassifier, float, str]:
    X = df[FEATURES]
    y = df[TARGET]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=test_size,
        random_state=random_state,
        stratify=y 
    )

    model = RandomForestClassifier(
        class_weight="balanced", 
        random_state=random_state,
        n_estimators=200,
    )

    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)[:, 1]

    accuracy = accuracy_score(y_test, y_pred)
    roc_auc = roc_auc_score(y_test, y_proba)
    f1_noshow = f1_score(y_test, y_pred)
    report = classification_report(y_test, y_pred, target_names=["Show", "No-Show"])
    cm = confusion_matrix(y_test, y_pred)

    print(f"\n{'='*60}")
    print(f"  Random Forest — No-Show Prediction")
    print(f"{'='*60}")
    print(f"  Accuracy:      {accuracy:.4f}")
    print(f"  ROC-AUC:       {roc_auc:.4f}")
    print(f"  F1 (No-Show):  {f1_noshow:.4f}")
    print(f"\n{report}")
    print(f"  Confusion Matrix:")
    print(f"    TN={cm[0][0]}  FP={cm[0][1]}")
    print(f"    FN={cm[1][0]}  TP={cm[1][1]}")

    if save:
        save_model(model, model_filename=model_filename)

    return model, accuracy, report

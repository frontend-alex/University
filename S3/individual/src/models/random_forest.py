"""Train and evaluate a Random Forest model for no-show prediction."""

from __future__ import annotations

import joblib
import pandas as pd

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    classification_report,
    accuracy_score,
    confusion_matrix,
    f1_score,
    roc_auc_score,
)

from src.utils.config import FEATURES, TARGET, PROCESSED_DATA_DIR

from imblearn.over_sampling import SMOTE

MODEL_FILE = PROCESSED_DATA_DIR / "random_forest_model.pkl"


def train_random_forest(
    df: pd.DataFrame,
    *,
    test_size: float = 0.2,
    random_state: int = 42,
    save: bool = True,
) -> tuple[RandomForestClassifier, float, str]:
    """Train a Random Forest classifier on preprocessed barbershop data."""
    # ------------------------------------------------------------------ #
    # 1. Split features / target                                          
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
    # 2. Apply smoote to the training set    
    # ! SMOTE before train/test split == data leakage.                         
    # ------------------------------------------------------------------ #
    smote = SMOTE(random_state=random_state)
    X_train_smote, y_train_smote = smote.fit_resample(X_train, y_train)


    # ------------------------------------------------------------------ #
    # 3. Train Random Forest (balanced class weights)                     
    # ------------------------------------------------------------------ #
    model = RandomForestClassifier(
        n_estimators=300,
        random_state=random_state,
        class_weight="balanced",
        n_jobs=-1,
    )
    model.fit(X_train_smote, y_train_smote)

    # ------------------------------------------------------------------ #
    # 4. Predict                                                          
    # ------------------------------------------------------------------ #
    y_proba = model.predict_proba(X_test)[:, 1]
    y_pred = model.predict(X_test)

    # ------------------------------------------------------------------ #
    # 5. Evaluate with recall-focused metrics                             
    # ------------------------------------------------------------------ #
    accuracy = accuracy_score(y_test, y_pred)
    report = classification_report(y_test, y_pred, target_names=["Show", "No-Show"])
    roc_auc = roc_auc_score(y_test, y_proba)
    f1_noshow = f1_score(y_test, y_pred)
    cm = confusion_matrix(y_test, y_pred)

    print(f"\n{'='*60}")
    print(f" Random Forest - No-Show Prediction")
    print(f"{'='*60}")
    print(f" Accuracy:        {accuracy:.4f}")
    print(f" ROC-AUC:         {roc_auc:.4f}")
    print(f" F1 (No-Show):    {f1_noshow:.4f}")
    print(f"\n{report}")
    print(f" Confusion Matrix:")
    print(f"   TN={cm[0][0]}  FP={cm[0][1]}")
    print(f"   FN={cm[1][0]}  TP={cm[1][1]}")

    # ------------------------------------------------------------------ #
    # 6. Persist model                                                    
    # ------------------------------------------------------------------ #
    if save:
        PROCESSED_DATA_DIR.mkdir(parents=True, exist_ok=True)
        joblib.dump(model, MODEL_FILE)
        print(f"\n Model saved -> {MODEL_FILE}")

    return model, accuracy, report

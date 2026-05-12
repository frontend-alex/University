import pandas as pd

from src.config.config import (SAVED_MODEL_LR, FEATURES, TARGET)
from src.utils.file import save_model

from sklearn.ensemble import LogisticRegression

from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split


def train_lr(
    df: pd.DataFrame,
    test_size: float = 0.2,
    random_state: int = 42,
    save: bool = True,
) -> tuple[LogisticRegression, float]:

    X = df[FEATURES]
    y = df[TARGET]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size, random_state=random_state)

    model = LogisticRegression(random_state=random_state)

    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)

    accuracy = accuracy_score(y_test, y_pred)

    print(f"Accuracy: {accuracy}")

    if save:
        save_model(model, SAVED_MODEL_LR)

    return model, accuracy
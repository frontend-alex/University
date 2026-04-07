"""Train the Titanic survival model."""

import pickle

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier

from src.data import load_raw, preprocess
from src.utils.config import (
    FEATURES,
    TARGET,
    TEST_SIZE,
    RANDOM_STATE,
    PROCESSED_DATA_DIR,
    MODEL_FILE,
)


def train_model_decision_tree(
    df: pd.DataFrame | None = None,
    test_size: float = TEST_SIZE,
    random_state: int = RANDOM_STATE,
    save: bool = True,
):
    """
    Train a DecisionTreeClassifier on Titanic data.
    Returns (model, X_train, X_test, y_train, y_test).
    """
    if df is None:
        df = load_raw()
        df = preprocess(df)

    X = df[FEATURES]
    y = df[TARGET]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state
    )

    model = DecisionTreeClassifier(random_state=random_state, max_depth=5)
    model.fit(X_train, y_train)

    if save:
        PROCESSED_DATA_DIR.mkdir(parents=True, exist_ok=True)
        model_path = PROCESSED_DATA_DIR / MODEL_FILE
        with open(model_path, "wb") as f:
            pickle.dump(model, f)

    return model, X_train, X_test, y_train, y_test


def train_model_random_forest(
    df: pd.DataFrame | None = None,
    test_size: float = TEST_SIZE,
    random_state: int = RANDOM_STATE,
    save: bool = True,
):
    """
    Train a DecisionTreeClassifier on Titanic data.
    Returns (model, X_train, X_test, y_train, y_test).
    """
    if df is None:
        df = load_raw()
        df = preprocess(df)

    X = df[FEATURES]
    y = df[TARGET]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state
    )

    model = RandomForestClassifier(random_state=random_state, n_estimators=100)
    model.fit(X_train, y_train)

    if save:
        PROCESSED_DATA_DIR.mkdir(parents=True, exist_ok=True)
        model_path = PROCESSED_DATA_DIR / MODEL_FILE
        with open(model_path, "wb") as f:
            pickle.dump(model, f)

    return model, X_train, X_test, y_train, y_test

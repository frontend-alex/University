"""Predict survival using the trained model."""

import pickle

import pandas as pd

from src.utils.config import FEATURES, PROCESSED_DATA_DIR, MODEL_FILE


def load_model(path: str | None = None):
    """Load the trained model from disk."""
    filepath = path or (PROCESSED_DATA_DIR / MODEL_FILE)
    with open(filepath, "rb") as f:
        return pickle.load(f)


def predict_survival(
    pclass: int,
    sex: int,
    cherbourg: int,
    model=None,
) -> int:
    """
    Predict survival for a single passenger.
    pclass: 1, 2, or 3
    sex: 0=male, 1=female
    cherbourg: 0 or 1 (1 if embarked at Cherbourg)
    """
    if model is None:
        model = load_model()

    data = pd.DataFrame([[pclass, sex, cherbourg]], columns=FEATURES)
    return int(model.predict(data)[0])

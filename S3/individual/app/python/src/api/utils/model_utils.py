import pickle
from pathlib import Path
from typing import Any

import pandas as pd

from src.config.config import (
    FEATURES,
    MODEL_ARTIFACTS_DIR,
    MODEL_FILENAME_XGBOOST,
    MODEL_THRESHOLD,
    PROJECT_ROOT,
)


def get_model_artifact_path(model_filename: str = MODEL_FILENAME_XGBOOST) -> Path:
    primary = PROJECT_ROOT / "data" / "models" / model_filename
    if primary.exists():
        return primary
    legacy_fallback = MODEL_ARTIFACTS_DIR / model_filename
    if legacy_fallback.exists():
        return legacy_fallback
    return primary


def load_model_bundle(model_path: Path | None = None) -> dict[str, Any]:
    artifact_path = model_path or get_model_artifact_path()
    with artifact_path.open("rb") as file:
        loaded = pickle.load(file)

    # Backward compatible: support both serialized bundle dicts and raw model objects.
    if isinstance(loaded, dict) and {"model", "features", "threshold"}.issubset(loaded.keys()):
        return loaded

    return {
        "model": loaded,
        "features": FEATURES,
        "threshold": MODEL_THRESHOLD,
    }


def score_people(bundle: dict[str, Any], rows: pd.DataFrame) -> pd.DataFrame:
    features = bundle["features"]
    threshold = float(bundle["threshold"])
    model = bundle["model"]

    X = rows[features].copy()
    probabilities = model.predict_proba(X)[:, 1]
    predictions = (probabilities >= threshold).astype(int)

    scored = rows.copy()
    scored["no_show_probability"] = probabilities
    scored["no_show_prediction"] = predictions
    return scored

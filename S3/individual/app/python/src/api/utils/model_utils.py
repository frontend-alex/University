import pickle
from pathlib import Path
from typing import Any

import pandas as pd

from src.config.config import MODEL_ARTIFACTS_DIR, MODEL_FILENAME


def get_model_artifact_path(model_filename: str = MODEL_FILENAME) -> Path:
    primary = MODEL_ARTIFACTS_DIR / model_filename
    notebook_fallback = Path("notebook") / "artifacts" / "models" / model_filename
    if primary.exists():
        return primary
    if notebook_fallback.exists():
        return notebook_fallback
    return primary


def load_model_bundle(model_path: Path | None = None) -> dict[str, Any]:
    artifact_path = model_path or get_model_artifact_path()
    with artifact_path.open("rb") as file:
        return pickle.load(file)


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

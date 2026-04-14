import pickle
from pathlib import Path
from typing import Any

from src.config.config import PROJECT_ROOT


MODEL_DATA_DIR = PROJECT_ROOT / "data" / "models"


def save_model(model: Any, model_filename: str) -> Path:
    """Persist a model artifact under app/python/data/models."""
    MODEL_DATA_DIR.mkdir(parents=True, exist_ok=True)
    model_path = MODEL_DATA_DIR / model_filename

    with model_path.open("wb") as file:
        pickle.dump(model, file)

    return model_path

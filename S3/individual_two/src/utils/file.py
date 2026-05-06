import pickle
import pandas as pd

from pathlib import Path
from src.config.config import PROCESSED_DIR, SAVED_MODELS_DIR

def resolve_path(override: str | Path | None, default: Path) -> Path:
    return Path(override) if override is not None else default


def validate_csv(path: Path) -> None:
    if not path.exists():
        raise FileNotFoundError(f"CSV file not found at {path}")

def save_model(model: object, name: str | Path) -> None:
    SAVED_MODELS_DIR.mkdir(parents=True, exist_ok=True)
    path = SAVED_MODELS_DIR / resolve_path(name)
    with open(path, "wb") as f:
        pickle.dump(model, f)

def save_csv(df: pd.DataFrame, path: Path) -> None:
    target = Path(path)
    if not target.is_absolute():
        target = PROCESSED_DIR / target
    target.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(target, index=False)
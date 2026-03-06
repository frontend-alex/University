"""Load Titanic dataset from CSV."""

import pandas as pd

from src.utils.config import RAW_DATA_DIR, RAW_CSV, PROCESSED_DATA_DIR, PROCESSED_CSV


def load_raw(path: str | None = None) -> pd.DataFrame:
    """Load raw Titanic CSV from data/raw/."""
    filepath = path or (RAW_DATA_DIR / RAW_CSV)
    return pd.read_csv(filepath)


def load_processed(path: str | None = None) -> pd.DataFrame:
    """Load preprocessed Titanic CSV from data/processed/."""
    filepath = path or (PROCESSED_DATA_DIR / PROCESSED_CSV)
    return pd.read_csv(filepath)

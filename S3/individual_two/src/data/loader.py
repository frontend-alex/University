from pathlib import Path
import pandas as pd

from config.config import RAW_CSV
from utils import resolve_path, validate_csv


def load(path: str | Path | None = None) -> pd.DataFrame:

    filepath = resolve_path(path, RAW_CSV)
    validate_csv(filepath)

    df = pd.read_csv(filepath)

    return df
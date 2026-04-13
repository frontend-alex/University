"""Load Titanic dataset from CSV — scalable and reusable."""

from __future__ import annotations

from pathlib import Path

import pandas as pd

from src.config.config import (
    PROCESSED_CSV,
    RAW_CSV,
    REAL_CSV,
)


def _resolve_path(override: str | Path | None, default: Path) -> Path:
    return Path(override) if override is not None else default


def _validate_csv(path: Path) -> None:
    if not path.exists():
        raise FileNotFoundError(
            f"CSV not found at '{path}'.\n"
            f"Make sure the file exists before calling load functions."
        )
    if path.suffix.lower() != ".csv":
        raise ValueError(f"Expected a .csv file, got: '{path.suffix}'")



# Load raw synthetic data
def load_raw(
    path: str | Path | None = None,
    *,
    required_columns: list[str] | None = None,
) -> pd.DataFrame:
    filepath = _resolve_path(path, RAW_CSV)
    _validate_csv(filepath)

    df = pd.read_csv(filepath)

    if required_columns:
        missing = set(required_columns) - set(df.columns)
        if missing:
            raise ValueError(
                f"Raw CSV is missing expected columns: {sorted(missing)}"
            )

    return df


def load_processed(
    path: str | Path | None = None,
    *,
    required_columns: list[str] | None = None,
) -> pd.DataFrame:
    filepath = _resolve_path(path, PROCESSED_CSV)

    if not filepath.exists():
        raise FileNotFoundError(
            f"Processed CSV not found at '{filepath}'.\n"
            f"Run preprocessing first: python main.py --train"
        )

    _validate_csv(filepath)
    df = pd.read_csv(filepath)

    if required_columns:
        missing = set(required_columns) - set(df.columns)
        if missing:
            raise ValueError(
                f"Processed CSV is missing expected columns: {sorted(missing)}"
            )

    return df



# Load real no-show data
def load_real(
    path: str | Path | None = None,
    *,
    required_columns: list[str] | None = None,
) -> pd.DataFrame:
    filepath = _resolve_path(path, REAL_CSV)
    _validate_csv(filepath)

    df = pd.read_csv(filepath)

    if required_columns:
        missing = set(required_columns) - set(df.columns)
        if missing:
            raise ValueError(
                f"Raw CSV is missing expected columns: {sorted(missing)}"
            )

    return df

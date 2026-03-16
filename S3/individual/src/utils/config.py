"""Central configuration for paths and constants."""

from pathlib import Path

# Project root (parent of src/)
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent

# Data paths
DATA_DIR = PROJECT_ROOT / "data"
RAW_DATA_DIR = DATA_DIR / "raw"
PROCESSED_DATA_DIR = DATA_DIR / "processed"

# Default filenames
RAW_CSV = "barbershop_synthetic_data.csv"
PROCESSED_DATA_DIR = RAW_DATA_DIR / "processed"

PROCESSED_CSV = PROCESSED_DATA_DIR / "barbershop_synthetic_data_processed.csv"
MODEL_FILE = PROCESSED_DATA_DIR / "decision_tree_model.pkl"
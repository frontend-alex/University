"""Central configuration for paths and constants."""

from pathlib import Path

# Project root (parent of src/)
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent

# Data paths
DATA_DIR = PROJECT_ROOT / "data"
RAW_DATA_DIR = DATA_DIR / "raw"
PROCESSED_DATA_DIR = DATA_DIR / "processed"

# Default filenames
RAW_CSV = "titanic.csv"
PROCESSED_CSV = "titanic_processed.csv"
MODEL_FILE = "decision_tree_model.pkl"

# Feature configuration (matches notebook)
FEATURES = ["pclass", "sex", "title", "Cherbourg"]
TARGET = "survived"

# Model defaults
TEST_SIZE = 0.2
RANDOM_STATE = 42

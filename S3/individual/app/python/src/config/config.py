"""Central configuration for paths and constants."""

from pathlib import Path
from datetime import date
from scipy.stats import randint, uniform


# Project root (parent of src/)
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent

# Data paths
DATA_DIR = PROJECT_ROOT / "data"
RAW_DATA_DIR = DATA_DIR / "raw"
REAL_DATA_DIR = DATA_DIR / "real"
PROCESSED_DATA_DIR = DATA_DIR / "processed"
MODEL_ARTIFACTS_DIR = PROJECT_ROOT / "artifacts" / "models"

RAW_CSV = RAW_DATA_DIR / "barbershop_synthetic_data.csv"
PROCESSED_CSV = PROCESSED_DATA_DIR / "barbershop_synthetic_data_processed.csv"
REAL_CSV = REAL_DATA_DIR / "no_show_real.csv"

# Constants —  Generate Synthetic Data 
DEFAULT_N: int = 1500
DEFAULT_SEED: int = 42
DEFAULT_FILENAME: str = "barbershop_synthetic_data.csv"
START_DATE: date = date(2024, 1, 2)

BARBERS: list[str] = ["B01", "B02", "B03", "B04"]
BARBER_WEIGHTS: list[float] = [0.30, 0.30, 0.25, 0.15]

SERVICE_TYPES: list[str] = ["haircut", "beard_trim", "combo"]
SERVICE_WEIGHTS: list[float] = [0.50, 0.30, 0.20]
SERVICE_DURATIONS: dict[str, int] = {"haircut": 30, "beard_trim": 20, "combo": 45}

BOOKING_CHANNELS: list[str] = ["app", "phone", "walk-in"]
CHANNEL_WEIGHTS: list[float] = [0.45, 0.35, 0.20]

# Per-day additive risk on top of base rate of 0.10
DAY_RISK: dict[str, float] = {
    "Monday": 0.08, "Tuesday": 0.02, "Wednesday": 0.01,
    "Thursday": 0.02, "Friday": 0.04, "Saturday": 0.05, "Sunday": 0.10,
}

# Per-channel additive risk (negative = protective)
CHANNEL_RISK: dict[str, float] = {"app": -0.05, "phone": 0.03, "walk-in": 0.08}


# Constants ->  Model Features 
FEATURES = [
    "day_of_week", ##
    "hour_of_day", ##
    "lead_time_days", 
    "is_returning_customer", 
    "booking_channel", 
    "service_type", ##
    "reminder_sent", 
    "barber_id", ##
    "previous_no_shows", 
    "total_previous_visits" 
]

TARGET = "no_show"

# Experiment parameter sets (used by notebook/experiment.ipynb)
RANDOM_FOREST_PARAM_SETS: list[dict] = [
    {"n_estimators": 200, "max_depth": None, "min_samples_leaf": 1, "class_weight": "balanced"},
    {"n_estimators": 300, "max_depth": 10, "min_samples_leaf": 2, "class_weight": "balanced"},
    {"n_estimators": 500, "max_depth": 20, "min_samples_leaf": 4, "class_weight": "balanced"},
]

RF_PARAM_DISTRIBUTIONS = {
    "n_estimators": randint(200, 1200),          # more trees = stability
    "max_depth": [None] + list(range(5, 40)),    # allow both shallow & deep
    "min_samples_split": randint(2, 20),
    "min_samples_leaf": randint(1, 10),
    "max_features": ["sqrt", "log2", None, 0.3, 0.5, 0.7],
    "bootstrap": [True, False],
    "class_weight": ["balanced", "balanced_subsample", None],
}

RF_PARAM_GRID = {
    "n_estimators": [200, 400, 800],
    "max_depth": [None, 8, 16],
    "min_samples_split": [2, 8],
    "min_samples_leaf": [1, 3],
    "max_features": ["sqrt", 0.5],
    "bootstrap": [True, False],
    "class_weight": ["balanced", None],
}


XGB_PARAM_DISTRIBUTIONS = {
    "n_estimators": randint(300, 1500),
    "max_depth": randint(3, 10),
    "learning_rate": uniform(0.01, 0.2),  # 0.01 → 0.21
    "subsample": uniform(0.6, 0.4),       # 0.6 → 1.0
    "colsample_bytree": uniform(0.6, 0.4),
    
    # Regularization (CRITICAL)
    "gamma": uniform(0, 5),
    "min_child_weight": randint(1, 10),
    "reg_alpha": uniform(0, 1),
    "reg_lambda": uniform(1, 5),

    # Imbalance handling
    "scale_pos_weight": uniform(0.5, 10),

    "objective": ["binary:logistic"],
    "eval_metric": ["logloss"],
}

XGB_PARAM_GRID = {
    "n_estimators": [300, 800, 1200],
    "max_depth": [3, 5, 7],
    "learning_rate": [0.03, 0.07, 0.12],
    "subsample": [0.7, 0.9, 1.0],
    "colsample_bytree": [0.7, 0.9, 1.0],
    "gamma": [0, 1, 3],
    "min_child_weight": [1, 4, 8],
    "reg_alpha": [0, 0.3, 0.8],
    "reg_lambda": [1, 3, 6],
    "scale_pos_weight": [1, 3, 6],
    "objective": ["binary:logistic"],
    "eval_metric": ["logloss"],
}

# Constants —  Preprocessing 
DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
CHANNEL_ORDER = ["app", "phone", "walk-in"]   # low -> high risk (from domain analysis)
SERVICE_ORDER = ["beard_trim", "haircut", "combo"]
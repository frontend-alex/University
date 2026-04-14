"""
Central configuration for paths, synthetic data generation, preprocessing,
model experimentation, hyperparameter search, and production model.
"""

from pathlib import Path
from datetime import date
from scipy.stats import randint, uniform


# =========================================================
# 1. PROJECT & PATHS
# =========================================================

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent

DATA_DIR = PROJECT_ROOT / "data"
RAW_DATA_DIR = DATA_DIR / "raw"
REAL_DATA_DIR = DATA_DIR / "real"
PROCESSED_DATA_DIR = DATA_DIR / "processed"

MODEL_ARTIFACTS_DIR = PROJECT_ROOT / "artifacts" / "models"

RAW_CSV = RAW_DATA_DIR / "barbershop_synthetic_data.csv"
PROCESSED_CSV = PROCESSED_DATA_DIR / "barbershop_synthetic_data_processed.csv"
REAL_CSV = REAL_DATA_DIR / "no_show_real.csv"


# =========================================================
# 2. SYNTHETIC DATA GENERATION
# =========================================================

DEFAULT_N: int = 1500
DEFAULT_SEED: int = 42
DEFAULT_FILENAME: str = "barbershop_synthetic_data.csv"
START_DATE: date = date(2024, 1, 2)

# Entities
BARBERS = ["B01", "B02", "B03", "B04"]
BARBER_WEIGHTS = [0.30, 0.30, 0.25, 0.15]

SERVICE_TYPES = ["haircut", "beard_trim", "combo"]
SERVICE_WEIGHTS = [0.50, 0.30, 0.20]
SERVICE_DURATIONS = {
    "haircut": 30,
    "beard_trim": 20,
    "combo": 45,
}

BOOKING_CHANNELS = ["app", "phone", "walk-in"]
CHANNEL_WEIGHTS = [0.45, 0.35, 0.20]

# Risk model
DAY_RISK = {
    "Monday": 0.08,
    "Tuesday": 0.02,
    "Wednesday": 0.01,
    "Thursday": 0.02,
    "Friday": 0.04,
    "Saturday": 0.05,
    "Sunday": 0.10,
}

CHANNEL_RISK = {
    "app": -0.05,
    "phone": 0.03,
    "walk-in": 0.08,
}


# =========================================================
# 3. PREPROCESSING
# =========================================================

FEATURES = [
    "day_of_week",
    "hour_of_day",
    "lead_time_days",
    "is_returning_customer",
    "booking_channel",
    "service_type",
    "reminder_sent",
    "barber_id",
    "previous_no_shows",
    "total_previous_visits",
]

TARGET = "no_show"

# Ordinal encoding order (based on domain logic)
DAY_ORDER = [
    "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday", "Sunday"
]

CHANNEL_ORDER = ["app", "phone", "walk-in"]
SERVICE_ORDER = ["beard_trim", "haircut", "combo"]


# =========================================================
# 4. MODEL EXPERIMENT CONFIG
# =========================================================

RANDOM_FOREST_PARAM_SETS = [
    {
        "n_estimators": 200,
        "max_depth": None,
        "min_samples_leaf": 1,
        "class_weight": "balanced",
    },
    {
        "n_estimators": 300,
        "max_depth": 10,
        "min_samples_leaf": 2,
        "class_weight": "balanced",
    },
    {
        "n_estimators": 500,
        "max_depth": 20,
        "min_samples_leaf": 4,
        "class_weight": "balanced",
    },
]


# =========================================================
# 5. HYPERPARAMETER SEARCH SPACES
# =========================================================

# ----- Random Forest -----

RF_PARAM_DISTRIBUTIONS = {
    "n_estimators": randint(200, 1200),
    "max_depth": [None] + list(range(5, 40)),
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


# ----- XGBoost -----

XGB_PARAM_DISTRIBUTIONS = {
    "n_estimators": randint(300, 1500),
    "max_depth": randint(3, 10),
    "learning_rate": uniform(0.01, 0.2),
    "subsample": uniform(0.6, 0.4),
    "colsample_bytree": uniform(0.6, 0.4),

    # Regularization
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


# =========================================================
# 6. PRODUCTION MODEL CONFIG
# =========================================================

MODEL_FILENAME = "xgb_randomized_early_stopping.pkl"
MODEL_FILENAME_RANDOMFOREST = "rf.pkl"

# Threshold tuned for recall/F1 tradeoff
MODEL_THRESHOLD = 0.49183673469387756

MODEL_BEST_XGB_PARAMS = {
    "colsample_bytree": 0.8630451569201374,
    "eval_metric": "logloss",
    "gamma": 2.841543016677358,
    "learning_rate": 0.028734953565618497,
    "max_depth": 5,
    "min_child_weight": 6,
    "n_estimators": 1345,
    "objective": "binary:logistic",
    "reg_alpha": 0.24398964337908358,
    "reg_lambda": 5.865052773762228,
    "scale_pos_weight": 4.430977246667604,
    "subsample": 0.9568186220708453,
}
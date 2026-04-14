"""Central configuration for paths and constants."""

from pathlib import Path
from datetime import date


# Project root (parent of src/)
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent

# Data paths
DATA_DIR = PROJECT_ROOT / "data"
RAW_DATA_DIR = DATA_DIR / "raw"
REAL_DATA_DIR = DATA_DIR / "real"
PROCESSED_DATA_DIR = DATA_DIR / "processed"

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
# FEATURES = [
#     "is_returning_customer",
#     "total_previous_visits",
#     "reminder_sent",
#     "booking_channel",
#     "lead_time_days",
#     "previous_no_shows",
# ]
TARGET = "no_show"

# Constants —  Preprocessing 
DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
CHANNEL_ORDER = ["app", "phone", "walk-in"]   # low -> high risk (from domain analysis)
SERVICE_ORDER = ["beard_trim", "haircut", "combo"]
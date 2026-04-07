"""Preprocess the raw barbershop dataset for modeling."""
from __future__ import annotations

import pandas as pd

from pathlib import Path

from sklearn.preprocessing import MinMaxScaler, LabelEncoder

from src.utils.config import PROCESSED_CSV, PROCESSED_DATA_DIR, DAY_ORDER, CHANNEL_ORDER, SERVICE_ORDER
from src.data.loader import load_raw

def preprocess(df: pd.DataFrame | None = None, save: bool = True) -> pd.DataFrame:
    """
    Preprocess raw barbershop data:
    - hour_of_day             -> MinMax scaled to [0, 1]
    - day_of_week             -> ordinal encoded (Mon=0 … Sun=6)
    - lead_time_days          -> MinMax scaled to [0, 1]
    - is_returning_customer   -> already binary int, cast to int8
    - booking_channel         -> ordinal encoded by commitment level (app=0, phone=1, walk-in=2)
    - service_type            -> ordinal encoded by duration (beard_trim=0, haircut=1, combo=2)
    - reminder_sent           -> already binary int, cast to int8
    - barber_id               -> label encoded (B01→0, B02→1, B03→2, B04→3)
    - previous_no_shows       -> MinMax scaled to [0, 1]
    - total_previous_visits   -> MinMax scaled to [0, 1]
    """
    if df is None:
        df = load_raw()
    
    df = df.copy()

    # ------------------------------------------------------------------ 
    # 1. Ordinal encoding — order carries domain meaning                  
    # ------------------------------------------------------------------ 
    df["day_of_week"] = pd.Categorical(
        df["day_of_week"],
        categories=DAY_ORDER,
        ordered=True    
    ).codes # returns -1 for unseen values -> catch below

     # booking_channel: ordered low -> high commitment (app is safest)
    df["booking_channel"] = pd.Categorical(
        df["booking_channel"], categories=CHANNEL_ORDER, ordered=True
    ).codes

    # service_type: ordered by duration (beard_trim shortest, combo longest)
    df["service_type"] = pd.Categorical(
        df["service_type"], categories=SERVICE_ORDER, ordered=True
    ).codes

# ------------------------------------------------------------------ #
    # 2. Label encoding — barber_id has no inherent order                 #
    # ------------------------------------------------------------------ #

    le = LabelEncoder()
    df["barber_id"] = le.fit_transform(df["barber_id"])

    # ------------------------------------------------------------------ #
    # 3. Binary columns — already 0/1 int, just enforce dtype             #
    # ------------------------------------------------------------------ #

    df["is_returning_customer"] = df["is_returning_customer"].astype("int8")
    df["reminder_sent"] = df["reminder_sent"].astype("int8")

    # ------------------------------------------------------------------ #
    # 4. MinMax scaling — continuous/count features                       #
    # ------------------------------------------------------------------ #

    scaler = MinMaxScaler()
    cols_to_scale = [
        "hour_of_day",
        "lead_time_days",
        "previous_no_shows",
        "total_previous_visits",
    ]
    df[cols_to_scale] = scaler.fit_transform(df[cols_to_scale])

    # ------------------------------------------------------------------ #
    # 5. Persist processed dataset                                         #
    # ------------------------------------------------------------------ #

    if save:
        PROCESSED_DATA_DIR.mkdir(parents=True, exist_ok=True)
        df.to_csv(PROCESSED_CSV, index=False)
        print(f"Saved processed data -> {PROCESSED_CSV}  |  shape: {df.shape}")

    return df
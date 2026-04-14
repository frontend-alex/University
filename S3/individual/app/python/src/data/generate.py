"""Synthetic barbershop appointment data generator."""

import argparse
from datetime import date, timedelta
from pathlib import Path

import numpy as np
import pandas as pd

from src.config.config import (
    DEFAULT_N, DEFAULT_SEED, DEFAULT_FILENAME, START_DATE,
    BARBERS, BARBER_WEIGHTS,
    SERVICE_TYPES, SERVICE_WEIGHTS, SERVICE_DURATIONS,
    BOOKING_CHANNELS, CHANNEL_WEIGHTS,
    DAY_RISK, CHANNEL_RISK,
    RAW_DATA_DIR,
)


# Helpers

def _business_dates(start: date, n: int) -> list[date]:
    """Return n Mon–Sat dates starting from start."""
    days, current = [], start
    while len(days) < n:
        if current.weekday() != 6:
            days.append(current)
        current += timedelta(days=1)
    return days


def _no_show_prob(day, hour, lead, returning, channel, prev_noshows, reminder) -> float:
    """Additive risk model. Base rate = 0.10, clipped to [0.02, 0.95]."""
    p = 0.10
    p += DAY_RISK.get(day, 0.0)
    p += 0.07 if (hour <= 10 or hour >= 17) else 0.0
    p += 0.10 if lead >= 7 else (0.05 if lead >= 3 else 0.0)
    p += 0.10 if returning == 0 else 0.0
    p += CHANNEL_RISK.get(channel, 0.0)
    p += prev_noshows * 0.06
    p -= 0.08 if reminder == 1 else 0.0
    return float(np.clip(p, 0.02, 0.95))


# Public API

def generate(
    n: int = DEFAULT_N,
    seed: int = DEFAULT_SEED,
    save: bool = False,
    path: str | Path | None = None,
) -> pd.DataFrame:

    rng = np.random.default_rng(seed)

    # --- Features ---
    pool  = _business_dates(START_DATE, n)
    dates = sorted(rng.choice(pool, size=n, replace=True))

    day_of_week      = [d.strftime("%A") for d in dates]
    hour_of_day      = rng.integers(9, 19, size=n)
    barber_id        = rng.choice(BARBERS, size=n, p=BARBER_WEIGHTS)
    service_type     = rng.choice(SERVICE_TYPES, size=n, p=SERVICE_WEIGHTS)
    booking_channel  = rng.choice(BOOKING_CHANNELS, size=n, p=CHANNEL_WEIGHTS)
    lead_time_days   = rng.choice(
        range(15), size=n,
        p=[0.05,0.10,0.12,0.12,0.10,0.09,0.08,0.07,0.06,0.05,0.04,0.04,0.03,0.03,0.02],
    )
    is_returning          = rng.choice([0, 1], size=n, p=[0.35, 0.65])
    total_previous_visits = np.where(is_returning == 1, rng.integers(1, 20, size=n), 0)
    previous_no_shows     = np.array([
        rng.integers(0, min(3, v + 1)) if v > 0 else 0
        for v in total_previous_visits
    ])
    reminder_sent = rng.choice([0, 1], size=n, p=[0.30, 0.70])

    # --- Labels (probabilistic, NOT a hard threshold) ---
    probs = np.array([
        _no_show_prob(
            day_of_week[i], int(hour_of_day[i]), int(lead_time_days[i]),
            int(is_returning[i]), booking_channel[i],
            int(previous_no_shows[i]), int(reminder_sent[i]),
        )
        for i in range(n)
    ])
    no_show = (rng.random(n) < probs).astype(int)  #  probabilistic sampling

    # --- Assemble DataFrame ---
    df = pd.DataFrame({
        "appointment_id":       [f"APT-{str(i+1).zfill(4)}" for i in range(n)],
        "date":                 [str(d) for d in dates],
        "day_of_week":          day_of_week,
        "hour_of_day":          hour_of_day,
        "barber_id":            barber_id,
        "service_type":         service_type,
        "service_duration_min": [SERVICE_DURATIONS[s] for s in service_type],
        "booking_channel":      booking_channel,
        "lead_time_days":       lead_time_days,
        "is_returning_customer": is_returning,
        "previous_no_shows":    previous_no_shows,
        "total_previous_visits": total_previous_visits,
        "reminder_sent":        reminder_sent,
        "no_show":              no_show,
    })

    if save:
        out = Path(path) if path else RAW_DATA_DIR / DEFAULT_FILENAME
        out.parent.mkdir(parents=True, exist_ok=True)
        df.to_csv(out, index=False)
        print(f"Saved {n} rows → {out}  |  no-show rate: {no_show.mean():.2%}")

    return df

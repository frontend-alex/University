"""Synthetic barbershop appointment data generator.

This module mirrors the loader.py / preprocessing.py pattern used in this
project: all paths come from config, the public function accepts overrides,
and a ``save`` flag controls whether output is written to disk.

Usage (standalone)::

    python -m src.data.generate_data              # generate + save to raw/
    python -m src.data.generate_data --n 2000     # custom row count
    python -m src.data.generate_data --no-save    # return df only, no file
"""

# from __future__ import annotations

import argparse
from datetime import date, timedelta
from pathlib import Path

import numpy as np
import pandas as pd

from src.utils.config import (
    DEFAULT_N,
    DEFAULT_SEED,
    DEFAULT_FILENAME,
    START_DATE,
    BARBERS,
    BARBER_WEIGHTS,
    SERVICE_TYPES,
    SERVICE_WEIGHTS,
    SERVICE_DURATIONS,
    BOOKING_CHANNELS,
    CHANNEL_WEIGHTS,
    DAY_RISK,
    CHANNEL_RISK,
    RAW_DATA_DIR,
)

# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

def _business_dates(start: date, n: int) -> list[date]:
    """Return a list of at least *n* Mon–Sat dates starting from *start*."""
    days: list[date] = []
    current = start
    while len(days) < n:
        if current.weekday() != 6:  # skip Sunday
            days.append(current)
        current += timedelta(days=1)
    return days


def _no_show_prob(
    day: str,
    hour: int,
    lead: int,
    returning: int,
    channel: str,
    prev_noshows: int,
    reminder: int,
) -> float:
    """Compute per-appointment no-show probability from feature values.

    All risk deltas are additive on a base rate of 0.10, then clipped to
    [0.02, 0.95] to avoid degenerate probabilities.
    """
    p = 0.10
    p += DAY_RISK.get(day, 0.0)
    if hour <= 10 or hour >= 17:
        p += 0.07
    if lead >= 7:
        p += 0.10
    elif lead >= 3:
        p += 0.05
    if returning == 0:
        p += 0.10
    p += CHANNEL_RISK.get(channel, 0.0)
    p += prev_noshows * 0.06
    if reminder == 1:
        p -= 0.08
    return float(np.clip(p, 0.02, 0.95))


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def generate(
    n: int = DEFAULT_N,
    seed: int = DEFAULT_SEED,
    save: bool = False,
    path: str | Path | None = None,
) -> pd.DataFrame:
    """Generate a synthetic barbershop appointment dataset.

    Args:
        n:    Number of appointment rows to generate. Default 1500.
        seed: NumPy random seed for reproducibility. Default 42.
        save: If True, write the CSV to *path* (or the default raw data dir).
        path: Override output path. Falls back to RAW_DATA_DIR / DEFAULT_FILENAME.

    Returns:
        DataFrame with 14 columns matching the project data schema.

    Example::

        from src.data.generate_data import generate
        df = generate(n=2000, seed=7, save=True)
    """
    rng = np.random.default_rng(seed)

    pool = _business_dates(START_DATE, n)
    dates = sorted(rng.choice(pool, size=n, replace=True))  # type: ignore[arg-type]

    day_of_week_vals = [d.strftime("%A") for d in dates]
    hour_of_day = rng.integers(9, 19, size=n)
    barber_id = rng.choice(BARBERS, size=n, p=BARBER_WEIGHTS)
    service_type = rng.choice(SERVICE_TYPES, size=n, p=SERVICE_WEIGHTS)
    service_duration_min = [SERVICE_DURATIONS[s] for s in service_type]
    booking_channel = rng.choice(BOOKING_CHANNELS, size=n, p=CHANNEL_WEIGHTS)
    lead_time_days = rng.choice(
        range(0, 15), size=n,
        p=[0.05, 0.10, 0.12, 0.12, 0.10, 0.09, 0.08, 0.07,
           0.06, 0.05, 0.04, 0.04, 0.03, 0.03, 0.02],
    )
    is_returning = rng.choice([0, 1], size=n, p=[0.35, 0.65])
    total_previous_visits = np.where(
        is_returning == 1, rng.integers(1, 20, size=n), 0
    )
    previous_no_shows = np.array([
        rng.integers(0, min(3, v + 1)) if v > 0 else 0
        for v in total_previous_visits
    ])
    reminder_sent = rng.choice([0, 1], size=n, p=[0.30, 0.70])

    probs = [
        _no_show_prob(
            day_of_week_vals[i], int(hour_of_day[i]), int(lead_time_days[i]),
            int(is_returning[i]), booking_channel[i],
            int(previous_no_shows[i]), int(reminder_sent[i]),
        )
        for i in range(n)
    ]

    # no_show = np.array([rng.binomial(1, p) for p in probs])
    no_show = (np.array(probs) >= 0.18).astype(int)


    df = pd.DataFrame({
        "appointment_id": [f"APT-{str(i + 1).zfill(4)}" for i in range(n)],
        "date": [str(d) for d in dates],
        "day_of_week": day_of_week_vals,
        "hour_of_day": hour_of_day,
        "barber_id": barber_id,
        "service_type": service_type,
        "service_duration_min": service_duration_min,
        "booking_channel": booking_channel,
        "lead_time_days": lead_time_days,
        "is_returning_customer": is_returning,
        "previous_no_shows": previous_no_shows,
        "total_previous_visits": total_previous_visits,
        "reminder_sent": reminder_sent,
        "no_show": no_show,
    })

    if save:
        out = Path(path) if path is not None else RAW_DATA_DIR / DEFAULT_FILENAME
        out.parent.mkdir(parents=True, exist_ok=True)
        df.to_csv(out, index=False)
        print(f"Saved {n} rows -> {out}  |  no-show rate: {no_show.mean():.2%}")

    return df


# ---------------------------------------------------------------------------
# CLI entry point: python -m src.data.generate_data
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate synthetic barbershop data.")
    parser.add_argument("--n", type=int, default=DEFAULT_N, help="Number of rows (default 1500)")
    parser.add_argument("--seed", type=int, default=DEFAULT_SEED, help="Random seed (default 42)")
    parser.add_argument("--no-save", action="store_true", help="Skip writing CSV to disk")
    parser.add_argument("--out", type=str, default=None, help="Override output file path")
    args = parser.parse_args()

    df = generate(n=args.n, seed=args.seed, save=not args.no_save, path=args.out)
    print(f"Generated {len(df)} rows | no-show rate: {df['no_show'].mean():.2%}")
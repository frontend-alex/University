"""Preprocess Titanic dataset for training."""

import pandas as pd

from src.data import load_raw
from src.utils.config import PROCESSED_DATA_DIR, PROCESSED_CSV


def preprocess(df: pd.DataFrame | None = None, save: bool = False) -> pd.DataFrame:
    """
    Preprocess raw Titanic data:
    - Drop unused columns (home.dest, room, ticket, boat)
    - Map pclass (1st->1, 2nd->2, 3rd->3)
    - Map sex (male->0, female->1)
    - One-hot encode embarked (Cherbourg, Queenstown, Southampton)
    - Select features and target
    """
    if df is None:
        df = load_raw()

    # Drop columns with many missing values
    df = df.drop(["home.dest", "room", "ticket", "boat"], axis=1)

    # Encode categorical features
    df["pclass"] = df["pclass"].map({"1st": 1, "2nd": 2, "3rd": 3}).astype(int)
    df["sex"] = df["sex"].map({"male": 0, "female": 1}).astype(int)

    # Extract title from name (Mr, Miss, Mrs, Master, Other)
    df["title"] = df["name"].str.extract(r",\s*(\w+)\b", expand=False)
    df["title"] = df["title"].map({
        "Mr": 0, "Miss": 1, "Mrs": 2, "Master": 3
    }).fillna(4).astype(int)
    
    # One-hot encode embarked
    df = pd.concat([df, pd.get_dummies(df["embarked"])], axis=1)
    df = df.drop("embarked", axis=1)

    # Reorder: features + target
    all_cols = ["pclass", "sex", "title", "age", "Cherbourg", "Queenstown", "Southampton", "survived"]
    df = df[[c for c in all_cols if c in df.columns]]

    if save:
        PROCESSED_DATA_DIR.mkdir(parents=True, exist_ok=True)
        df.to_csv(PROCESSED_DATA_DIR / PROCESSED_CSV, index=False)

    return df

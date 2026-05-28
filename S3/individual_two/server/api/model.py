import pickle

import pandas as pd

from api.dto import MigraineInput
from src.config.config import FEATURES, SAVED_MODEL_RF, SAVED_MODELS_DIR


def predict_migraine_type(payload: MigraineInput) -> str:
    model_path = SAVED_MODELS_DIR / SAVED_MODEL_RF

    with open(model_path, "rb") as file:
        model = pickle.load(file)

    input_df = pd.DataFrame([payload.model_dump()], columns=FEATURES)
    return str(model.predict(input_df)[0])

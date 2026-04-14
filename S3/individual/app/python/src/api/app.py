import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import xgboost as xgb

from src.api.schemas import PredictRequest, PredictResponse, UserCard, UserDetail
from src.api.utils import load_model_bundle, score_people
from src.data.generate import generate
from src.data.preprocess import preprocess

app = FastAPI(title="No-Show Prediction API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


def _build_ui_dataset(size: int = 24) -> pd.DataFrame:
    raw = generate(n=size, seed=42, save=False)
    processed = preprocess(raw, save=False)

    cards = raw[["appointment_id", "day_of_week", "booking_channel", "service_type", "reminder_sent"]].copy()
    cards = cards.rename(columns={"appointment_id": "id"})
    cards["patient"] = processed.to_dict(orient="records")
    return cards


@app.post("/predict", response_model=PredictResponse)
def predict(request: PredictRequest) -> PredictResponse:
    try:
        bundle = load_model_bundle()
    except FileNotFoundError as exc:
        raise HTTPException(status_code=500, detail=f"Model artifact not found: {exc}") from exc

    try:
        row_df = pd.DataFrame([request.patient])
        scored = score_people(bundle, row_df)
    except KeyError as exc:
        raise HTTPException(status_code=400, detail=f"Missing required feature: {exc}") from exc
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Invalid input payload: {exc}") from exc

    probability = float(scored.iloc[0]["no_show_probability"])
    prediction = int(scored.iloc[0]["no_show_prediction"])
    threshold = float(bundle["threshold"])

    return PredictResponse(probability=probability, prediction=prediction, threshold=threshold)


@app.get("/users", response_model=list[UserCard])
def list_users() -> list[UserCard]:
    users_df = _build_ui_dataset(size=24)
    users_df = users_df.drop(columns=["patient"])
    return [UserCard(**item) for item in users_df.to_dict(orient="records")]


@app.get("/users/{user_id}", response_model=UserDetail)
def user_probability(user_id: str) -> UserDetail:
    users_df = _build_ui_dataset(size=24)
    user_rows = users_df[users_df["id"] == user_id]
    if user_rows.empty:
        raise HTTPException(status_code=404, detail=f"User not found: {user_id}")

    row = user_rows.iloc[0]
    patient = row["patient"]

    try:
        bundle = load_model_bundle()
    except FileNotFoundError as exc:
        raise HTTPException(status_code=500, detail=f"Model artifact not found: {exc}") from exc

    scored = score_people(bundle, pd.DataFrame([patient]))
    probability = float(scored.iloc[0]["no_show_probability"])
    prediction = int(scored.iloc[0]["no_show_prediction"])
    threshold = float(bundle["threshold"])
    model = bundle["model"]
    feature_names = bundle["features"]
    feature_frame = pd.DataFrame([patient])[feature_names]

    # Per-feature contributions from XGBoost (last value is bias term).
    booster = model.get_booster()
    contributions_raw = booster.predict(
        xgb.DMatrix(feature_frame, feature_names=feature_names),
        pred_contribs=True,
    )[0]
    feature_contributions = contributions_raw[:-1]
    factors = [
        {"feature": feature_names[idx], "impact": float(feature_contributions[idx])}
        for idx in range(len(feature_names))
    ]
    top_factors = sorted(factors, key=lambda item: abs(float(item["impact"])), reverse=True)[:5]

    return UserDetail(
        id=user_id,
        probability=probability,
        prediction=prediction,
        threshold=threshold,
        patient=patient,
        top_factors=top_factors,
    )

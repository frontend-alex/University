from typing import Any

from pydantic import BaseModel


class PredictRequest(BaseModel):
    patient: dict[str, Any]


class PredictResponse(BaseModel):
    probability: float
    prediction: int
    threshold: float


class UserCard(BaseModel):
    id: str
    day_of_week: str
    booking_channel: str
    service_type: str
    reminder_sent: int


class UserDetail(BaseModel):
    id: str
    probability: float
    prediction: int
    threshold: float
    patient: dict[str, Any]
    top_factors: list[dict[str, float | str]]

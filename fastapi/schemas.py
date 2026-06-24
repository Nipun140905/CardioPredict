from pydantic import BaseModel, Field, validator
from typing import Literal

class PredictRequest(BaseModel):
    model: Literal["hybrid", "rf", "svm", "xgb"] = "hybrid"
    age: float = Field(..., ge=1, le=120)
    sex: float = Field(..., ge=0, le=1)
    cp: float = Field(..., ge=0, le=3)
    trestbps: float = Field(..., ge=80, le=200)
    chol: float = Field(..., ge=100, le=600)
    fbs: float = Field(..., ge=0, le=1)
    restecg: float = Field(..., ge=0, le=2)
    thalach: float = Field(..., ge=60, le=220)
    exang: float = Field(..., ge=0, le=1)
    oldpeak: float = Field(..., ge=0.0, le=10.0)
    slope: float = Field(..., ge=0, le=2)
    ca: float = Field(..., ge=0, le=3)
    thal: float = Field(..., ge=0, le=2)

class PredictResponse(BaseModel):
    prediction: int
    probability: float
    risk_level: str
    threshold_used: float
    model_used: str
    feature_importance: dict

class ModelMetrics(BaseModel):
    accuracy: float
    auroc: float
    threshold: float
    precision: float
    recall: float
    f1: float
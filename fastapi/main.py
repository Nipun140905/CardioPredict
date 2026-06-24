from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from schemas import PredictRequest, PredictResponse
from services.predictor import predict, models, THRESHOLDS
from services.feature_importance import get_feature_importance

app = FastAPI(title="CardioPredict ML API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Tighten this after deploy — set to your Render/Vercel URLs
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_METRICS = {
    "rf": {
        "accuracy": 86.7, "auroc": 0.924, "threshold": 0.4064,
        "precision": 0.885, "recall": 0.821, "f1": 0.852
    },
    "svm": {
        "accuracy": 91.7, "auroc": 0.927, "threshold": 0.3636,
        "precision": 0.960, "recall": 0.857, "f1": 0.906
    },
    "xgb": {
        "accuracy": 88.3, "auroc": 0.944, "threshold": 0.3575,
        "precision": 0.889, "recall": 0.857, "f1": 0.808
    },
    "hybrid": {
        "accuracy": 91.7, "auroc": 0.944, "threshold": 0.5204,
        "precision": 1.000, "recall": 0.821, "f1": 0.902
    },
}

@app.get("/health")
def health():
    return {"status": "ok", "models_loaded": list(models.keys())}

@app.post("/predict")
def predict_endpoint(req: PredictRequest):
    features = req.dict(exclude={"model"})
    result   = predict(req.model, features)
    fi       = get_feature_importance(req.model, models[req.model])
    result["feature_importance"] = fi
    return result

@app.get("/models")
def get_models():
    return MODEL_METRICS
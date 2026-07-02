import subprocess
subprocess.run(['python', 'download_models.py'], check=True)

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from schemas import PredictRequest
from services.feature_importance import get_feature_importance
import services.predictor as predictor_module

app = FastAPI(title="CardioPredict ML API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_METRICS = {
    "rf": {"accuracy": 86.7, "auroc": 0.924, "threshold": 0.4064, "precision": 0.885, "recall": 0.821, "f1": 0.852},
    "svm": {"accuracy": 91.7, "auroc": 0.927, "threshold": 0.3636, "precision": 0.960, "recall": 0.857, "f1": 0.906},
    "xgb": {"accuracy": 88.3, "auroc": 0.944, "threshold": 0.3575, "precision": 0.889, "recall": 0.857, "f1": 0.808},
    "hybrid": {"accuracy": 91.7, "auroc": 0.944, "threshold": 0.5204, "precision": 1.000, "recall": 0.821, "f1": 0.902},
}

@app.api_route("/health", methods=["GET", "HEAD"])
def health():
    return {"status": "ok", "models_loaded": list(predictor_module.models.keys())}

@app.post("/predict")
def predict_endpoint(req: PredictRequest):
    features = req.dict(exclude={"model"})
    result = predictor_module.predict(req.model, features)
    fi = get_feature_importance(req.model, predictor_module.models[req.model])
    result["feature_importance"] = fi
    return result

@app.get("/models")
def get_models():
    return MODEL_METRICS
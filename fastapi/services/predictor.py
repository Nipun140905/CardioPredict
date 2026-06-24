import joblib
import numpy as np
import os

BASE = os.path.dirname(os.path.dirname(__file__))
PKL  = os.path.join(BASE, "pkl_files")

# Load all models once at startup
models = {
    "rf":     joblib.load(os.path.join(PKL, "rf.pkl")),
    "svm":    joblib.load(os.path.join(PKL, "svm.pkl")),
    "xgb":    joblib.load(os.path.join(PKL, "xgb.pkl")),
    "hybrid": joblib.load(os.path.join(PKL, "hybrid.pkl")),
}

THRESHOLDS = {
    "rf":     0.4064,
    "svm":    0.3636,
    "xgb":    0.3575,
    "hybrid": 0.5204,
}

FEATURE_NAMES = [
    "age", "sex", "cp", "trestbps", "chol",
    "fbs", "restecg", "thalach", "exang",
    "oldpeak", "slope", "ca", "thal"
]

def get_risk_level(prob: float) -> str:
    if prob < 0.30:
        return "Low"
    elif prob < 0.60:
        return "Medium"
    return "High"

def predict(model_key: str, features: dict) -> dict:
    model     = models[model_key]
    threshold = THRESHOLDS[model_key]

    X = np.array([[features[f] for f in FEATURE_NAMES]])

    # Hybrid needs DataFrame for feature names; RF/SVM/XGB are fine with array
    if model_key == "hybrid":
        import pandas as pd
        X = pd.DataFrame(X, columns=FEATURE_NAMES)

    prob       = float(model.predict_proba(X)[0][1])
    prediction = int(prob >= threshold)
    risk_level = get_risk_level(prob)

    return {
        "prediction":    prediction,
        "probability":   round(prob * 100, 2),
        "risk_level":    risk_level,
        "threshold_used": threshold,
        "model_used":    model_key,
    }
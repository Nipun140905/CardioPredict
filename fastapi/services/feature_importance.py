import numpy as np

FEATURE_NAMES = [
    "age", "sex", "cp", "trestbps", "chol",
    "fbs", "restecg", "thalach", "exang",
    "oldpeak", "slope", "ca", "thal"
]

def get_feature_importance(model_key: str, model) -> dict:
    """
    RF and XGBoost have native feature_importances_.
    SVM and Hybrid don't — return equal weights as fallback.
    For SVM pipeline: model.named_steps['model'] has no coef_ for rbf kernel.
    For Hybrid StackingClassifier: no direct importance available.
    """
    try:
        if model_key == "rf":
            importances = model.named_steps["model"].feature_importances_
        elif model_key == "xgb":
            importances = model.named_steps["model"].feature_importances_
        else:
            # SVM (rbf) and Hybrid — no native importance, use equal weights
            importances = np.ones(len(FEATURE_NAMES)) / len(FEATURE_NAMES)

        importance_dict = dict(zip(FEATURE_NAMES, [round(float(i), 4) for i in importances]))
        # Sort by importance descending, return top 5
        sorted_imp = dict(sorted(importance_dict.items(), key=lambda x: x[1], reverse=True)[:5])
        return sorted_imp

    except Exception:
        return {f: round(1/len(FEATURE_NAMES), 4) for f in FEATURE_NAMES[:5]}
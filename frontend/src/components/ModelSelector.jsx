const MODELS = [
    { key: 'hybrid', label: 'Hybrid Ensemble', accuracy: '91.7%', auroc: '0.946', recommended: true },
    { key: 'rf', label: 'Random Forest', accuracy: '86.7%', auroc: '0.924', recommended: false },
    { key: 'svm', label: 'SVM', accuracy: '91.7%', auroc: '0.927', recommended: false },
    { key: 'xgb', label: 'XGBoost', accuracy: '88.3%', auroc: '0.944', recommended: false },
];

const ModelSelector = ({ selected, onChange }) => {
    return (
        <div>
            <div className="row g-2">
                {MODELS.map(model => (
                    <div className="col-6 col-md-3" key={model.key}>
                        <div
                            className={`model-card ${selected === model.key ? 'selected' : ''}`}
                            onClick={() => onChange(model.key)}>
                            <div className="model-card-name">{model.label}</div>
                            <div className="model-card-accuracy">Acc: {model.accuracy}</div>
                            <div className="model-card-accuracy">AUROC: {model.auroc}</div>
                            {model.recommended && (
                                <div><span className="recommended-tag">Recommended</span></div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ModelSelector;
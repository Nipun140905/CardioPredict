import { useNavigate } from 'react-router-dom';
import RiskGauge from './RiskGauge';

const MODEL_LABELS = {
    hybrid: 'Hybrid Ensemble', rf: 'Random Forest',
    svm: 'SVM', xgb: 'XGBoost'
};

const RECOMMENDATIONS = {
    High: { text: 'Consult a cardiologist immediately.', bg: '#fef2f2', border: '#fecaca', color: '#dc2626' },
    Medium: { text: 'Schedule a checkup with your doctor soon.', bg: '#fffbeb', border: '#fde68a', color: '#d97706' },
    Low: { text: 'Maintain a healthy lifestyle and regular checkups.', bg: '#f0fdf4', border: '#bbf7d0', color: '#16a34a' }
};

const ResultCard = ({ result, onPredictAgain }) => {
    const navigate = useNavigate();
    const { prediction, probability, risk_level, model_used } = result;
    const rec = RECOMMENDATIONS[risk_level];
    const riskClass = risk_level === 'High' ? 'risk-high' : risk_level === 'Medium' ? 'risk-medium' : 'risk-low';

    return (
        <div className="result-card">
            <h5 style={{ fontWeight: '700', color: '#0f172a', marginBottom: '24px', letterSpacing: '-0.3px' }}>
                Prediction Result
            </h5>

            <div className="text-center mb-4">
                <span className={`risk-badge ${riskClass}`}>{risk_level} Risk</span>
                <p style={{ color: '#64748b', fontSize: '13px', marginTop: '8px', marginBottom: 0 }}>
                    {prediction === 1 ? 'Heart Disease Detected' : 'No Heart Disease Detected'}
                </p>
            </div>

            <RiskGauge probability={probability} />

            <div className="text-center mt-3 mb-4">
                <span style={{
                    fontSize: '13px', color: '#64748b',
                    background: '#f1f5f9', padding: '4px 14px',
                    borderRadius: '50px', border: '1px solid #e2e8f0'
                }}>
                    {MODEL_LABELS[model_used]}
                </span>
            </div>

            <div style={{
                background: rec.bg, border: `1px solid ${rec.border}`,
                color: rec.color, borderRadius: '8px',
                padding: '12px 16px', fontSize: '13px', marginBottom: '24px'
            }}>
                <strong>{risk_level} Risk:</strong> {rec.text}
            </div>

            <div className="d-flex gap-3">
                <button className="btn-app-secondary flex-fill" onClick={onPredictAgain}>
                    Predict Again
                </button>
                <button className="btn-app-primary flex-fill justify-content-center"
                    onClick={() => navigate('/history')}>
                    View History
                </button>
            </div>
        </div>
    );
};

export default ResultCard;
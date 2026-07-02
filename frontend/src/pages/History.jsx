import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { predictAPI } from '../services/api';

const FEATURE_LABELS = {
    age: 'Age', sex: 'Sex', cp: 'Chest Pain',
    trestbps: 'Resting BP', chol: 'Cholesterol',
    fbs: 'Fasting BS', restecg: 'Resting ECG',
    thalach: 'Max HR', exang: 'Ex. Angina',
    oldpeak: 'ST Depress.', slope: 'ST Slope',
    ca: 'Major Vessels', thal: 'Thalassemia'
};

const MODEL_LABELS = {
    hybrid: 'Hybrid Ensemble', rf: 'Random Forest',
    svm: 'SVM', xgb: 'XGBoost'
};

const History = () => {
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expanded, setExpanded] = useState(null);

    useEffect(() => { fetchHistory(); }, []);

    const fetchHistory = async () => {
        try {
            const res = await predictAPI.getHistory();
            setPredictions(res.data.predictions);
        } catch { setError('Failed to load prediction history.'); }
        finally { setLoading(false); }
    };

    const formatDate = (ts) => new Date(ts).toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });

    const getRiskBadge = (risk) => {
        const cls = risk === 'High' ? 'badge-high' : risk === 'Medium' ? 'badge-medium' : 'badge-low';
        return <span className={cls}>{risk}</span>;
    };

    if (loading) return (
        <div className="app-wrapper d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
            <div>
                <div className="spinner-border" style={{ color: '#2563eb' }}></div>
            </div>
        </div>
    );

    return (
        <div className="app-wrapper">
            <div className="container py-5">
                <div className="app-page-header">
                    <h2 className="app-page-title">Prediction History</h2>
                    <p className="app-page-subtitle">All your past CVD risk predictions</p>
                </div>

                {error && <div className="app-alert-error mb-4">{error}</div>}

                {predictions.length === 0 ? (
                    <div className="card-app p-5 text-center">
                        <div style={{ fontSize: '40px', marginBottom: '16px' }}>📋</div>
                        <h5 style={{ fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>
                            No predictions yet
                        </h5>
                        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
                            Start your first prediction to see history here.
                        </p>
                        <Link to="/predict" className="btn-app-primary">
                            Make a Prediction
                        </Link>
                    </div>
                ) : (
                    <div className="card-app">
                        <div className="history-stats-grid">
                            <div className="history-stat-card">
                                <div className="history-stat-value">{predictions.length}</div>
                                <div className="history-stat-label">Total Predictions</div>
                            </div>
                            <div className="history-stat-card">
                                <div className="history-stat-value">
                                    {predictions.length > 0
                                        ? Math.round(predictions.reduce((a, p) => a + p.probability, 0) / predictions.length) + '%'
                                        : '—'}
                                </div>
                                <div className="history-stat-label">Average Risk Score</div>
                            </div>
                            <div className="history-stat-card">
                                <div className="history-stat-value">{predictions.filter(p => p.risk_level === 'High').length}</div>
                                <div className="history-stat-label">High Risk Results</div>
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table className="app-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Date & Time</th>
                                        <th>Model</th>
                                        <th>Probability</th>
                                        <th>Risk</th>
                                        <th>Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {predictions.map((p, i) => (
                                        <>
                                            <tr key={p._id} className="expandable-row"
                                                onClick={() => setExpanded(prev => prev === p._id ? null : p._id)}>
                                                <td style={{ color: '#94a3b8', fontSize: '13px' }}>
                                                    {predictions.length - i}
                                                </td>
                                                <td style={{ fontSize: '13px', color: '#475569' }}>
                                                    {formatDate(p.timestamp)}
                                                </td>
                                                <td style={{ fontSize: '13px', fontWeight: '500' }}>
                                                    {MODEL_LABELS[p.model_used] || p.model_used}
                                                </td>
                                                <td>
                                                    <span style={{ fontWeight: '700', color: '#2563eb' }}>
                                                        {p.probability}%
                                                    </span>
                                                </td>
                                                <td>{getRiskBadge(p.risk_level)}</td>
                                                <td style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '500' }}>
                                                    {expanded === p._id ? '▲ Hide' : '▼ Show'}
                                                </td>
                                            </tr>
                                            {expanded === p._id && (
                                                <tr key={`${p._id}-exp`}>
                                                    <td colSpan="6" style={{ background: 'var(--brand-ivory-light)', padding: '20px 16px' }}>
                                                        <p style={{
                                                            fontSize: '11px', fontWeight: '700',
                                                            textTransform: 'uppercase', letterSpacing: '1px',
                                                            color: '#0d9488', marginBottom: '12px'
                                                        }}>Clinical Features</p>
                                                        <div className="row g-2">
                                                            {Object.entries(FEATURE_LABELS).map(([key, label]) => (
                                                                <div className="col-6 col-md-2" key={key}>
                                                                    <div>
                                                                        <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
                                                                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>{p[key]}</div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default History;
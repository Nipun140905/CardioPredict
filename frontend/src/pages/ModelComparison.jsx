import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { modelsAPI } from '../services/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MODEL_LABELS = { rf: 'Random Forest', svm: 'SVM', xgb: 'XGBoost', hybrid: 'Hybrid Ensemble' };

const ModelComparison = () => {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        modelsAPI.getModels()
            .then(res => setMetrics(res.data))
            .catch(() => setError('Failed to load model metrics.'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="app-wrapper d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
            <div className="spinner-border" style={{ color: '#2563eb' }}></div>
        </div>
    );

    if (error) return (
        <div className="app-wrapper"><div className="container py-5">
            <div className="app-alert-error">{error}</div>
        </div></div>
    );

    const models = ['rf', 'svm', 'xgb', 'hybrid'];

    const chartData = {
        labels: models.map(m => MODEL_LABELS[m]),
        datasets: [
            { label: 'Accuracy (%)', data: models.map(m => metrics[m].accuracy), backgroundColor: 'rgba(37,99,235,0.8)', borderRadius: 4 },
            { label: 'AUROC (%)', data: models.map(m => (metrics[m].auroc * 100).toFixed(1)), backgroundColor: 'rgba(13,148,136,0.8)', borderRadius: 4 },
            { label: 'F1 (%)', data: models.map(m => (metrics[m].f1 * 100).toFixed(1)), backgroundColor: 'rgba(244,63,94,0.7)', borderRadius: 4 },
            { label: 'Precision (%)', data: models.map(m => (metrics[m].precision * 100).toFixed(1)), backgroundColor: 'rgba(245,158,11,0.8)', borderRadius: 4 },
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top', labels: { color: '#475569', font: { size: 12, family: 'Inter' } } },
        },
        scales: {
            y: { beginAtZero: false, min: 75, max: 100, grid: { color: '#f1f5f9' }, ticks: { color: '#94a3b8' } },
            x: { grid: { display: false }, ticks: { color: '#475569' } }
        }
    };

    return (
        <div className="app-wrapper">
            <div className="container py-5">
                <div className="app-page-header">
                    <h2 className="app-page-title">Model Comparison</h2>
                    <p className="app-page-subtitle">Performance metrics for all 4 trained ML models on the UCI Cleveland dataset</p>
                </div>

                <div className="card-app p-4 mb-4">
                    <Bar data={chartData} options={chartOptions} />
                </div>

                <div className="card-app">
                    <div className="table-responsive">
                        <table className="app-table">
                            <thead>
                                <tr>
                                    <th>Model</th>
                                    <th>Accuracy</th>
                                    <th>AUROC</th>
                                    <th>Precision</th>
                                    <th>Recall</th>
                                    <th>F1</th>
                                    <th>Threshold</th>
                                </tr>
                            </thead>
                            <tbody>
                                {models.map(m => (
                                    <tr key={m} style={{ background: m === 'var(--brand-ivory)' }}>
                                        <td>
                                            <span style={{ fontWeight: '600', color: '#0f172a' }}>{MODEL_LABELS[m]}</span>
                                            {m === 'hybrid' && (
                                                <span className="recommended-tag ms-2">Recommended</span>
                                            )}
                                        </td>
                                        <td>{metrics[m].accuracy}%</td>
                                        <td>{metrics[m].auroc}</td>
                                        <td>{(metrics[m].precision * 100).toFixed(1)}%</td>
                                        <td>{(metrics[m].recall * 100).toFixed(1)}%</td>
                                        <td>{(metrics[m].f1 * 100).toFixed(1)}%</td>
                                        <td style={{ color: '#000000', fontSize: '13px' }}>{metrics[m].threshold}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModelComparison;
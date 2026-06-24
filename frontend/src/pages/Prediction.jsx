import { useState } from 'react';
import PatientForm from '../components/PatientForm';
import ModelSelector from '../components/ModelSelector';
import ResultCard from '../components/ResultCard';
import { predictAPI } from '../services/api';

const REQUIRED_FIELDS = [
    'age', 'sex', 'cp', 'trestbps', 'chol', 'fbs',
    'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal'
];
const FIELD_RANGES = {
    age: { min: 1, max: 120 }, trestbps: { min: 80, max: 200 },
    chol: { min: 100, max: 600 }, thalach: { min: 60, max: 220 },
    oldpeak: { min: 0, max: 10 },
};

const Prediction = () => {
    const [form, setForm] = useState({});
    const [model, setModel] = useState('hybrid');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [apiError, setApiError] = useState('');

    const validate = () => {
        const e = {};
        REQUIRED_FIELDS.forEach(field => {
            if (form[field] === undefined || form[field] === '') {
                e[field] = 'Required';
            } else if (FIELD_RANGES[field]) {
                const val = parseFloat(form[field]);
                const { min, max } = FIELD_RANGES[field];
                if (val < min || val > max) e[field] = `${min}–${max}`;
            }
        });
        return e;
    };

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const handleSubmit = async () => {
        const e = validate();
        if (Object.keys(e).length > 0) {
            setErrors(e);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        setLoading(true); setApiError(''); setResult(null);
        try {
            const payload = { model };
            REQUIRED_FIELDS.forEach(f => { payload[f] = parseFloat(form[f]); });
            const res = await predictAPI.predict(payload);
            setResult(res.data);
            setTimeout(() => {
                document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } catch (err) {
            setApiError(err.response?.data?.message || 'Prediction failed. Please try again.');
        } finally { setLoading(false); }
    };

    const handlePredictAgain = () => {
        setResult(null); setForm({}); setErrors({}); setApiError('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="app-wrapper">
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8">

                        <div className="app-page-header">
                            <h2 className="app-page-title">CVD Risk Prediction</h2>
                            <p className="app-page-subtitle">Enter all 13 clinical features to generate a prediction</p>
                        </div>

                        {apiError && (
                            <div className="app-alert-error mb-4">{apiError}</div>
                        )}
                        {Object.keys(errors).length > 0 && (
                            <div className="app-alert-warning mb-4">
                                Please fix the highlighted fields before submitting.
                            </div>
                        )}

                        {/* Patient Data */}
                        <div className="card-app p-4 mb-4">
                            <p className="card-section-label">Patient Clinical Data</p>
                            <PatientForm form={form} errors={errors} onChange={handleChange} />
                        </div>

                        {/* Model Selection */}
                        <div className="card-app p-4 mb-4">
                            <p className="card-section-label">Model Selection</p>
                            <ModelSelector selected={model} onChange={setModel} />
                        </div>

                        <div className="d-grid mb-4">
                            <button
                                className="btn-app-primary w-100 justify-content-center py-3"
                                onClick={handleSubmit}
                                disabled={loading}>
                                {loading ? (
                                    <><span className="spinner-border spinner-border-sm me-2"
                                        style={{ color: 'white' }}></span>Analyzing patient data...</>
                                ) : 'Predict Risk'}
                            </button>
                        </div>

                        {result && (
                            <div id="result-section">
                                <ResultCard result={result} onPredictAgain={handlePredictAgain} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Prediction;
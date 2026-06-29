import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const STATS = [
    { value: '91.7%', label: 'Best Model Accuracy' },
    { value: '0.946', label: 'Best AUROC Score' },
    { value: '4', label: 'ML Models' },
    { value: '13', label: 'Clinical Features' },
];

const STEPS = [
    { step: '01', title: 'Create Account', desc: 'Sign up with a verified email to save your prediction history securely.' },
    { step: '02', title: 'Enter Patient Data', desc: 'Fill in 13 clinical features including age, cholesterol, and ECG results.' },
    { step: '03', title: 'Choose ML Model', desc: 'Select from Hybrid Ensemble, Random Forest, SVM, or XGBoost.' },
    { step: '04', title: 'Get Risk Assessment', desc: 'Receive a probability score and risk classification instantly.' },
];

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="page-wrapper section-public">

            {/* Hero */}
            <section className="hero-section">
                <div className="container">
                    <div className="fade-in-up">
                        <div className="d-inline-flex align-items-center gap-2 mb-4 px-3 py-2"
                            style={{
                                background: 'rgba(247, 243, 238, 0.08)',
                                border: '1px solid rgba(247, 243, 238, 0.3)',
                                borderRadius: '50px',
                                fontSize: '12px',
                                fontWeight: '1100',
                                textTransform: 'uppercase',
                                color: 'var(--brand-ivory)',
                                letterSpacing: '1.5px'
                            }}>
                            Clinical Decision Support Platform
                        </div>
                        <h1 className="hero-title mb-3">
                            Cardiovascular Risk<br />
                            <span className="gradient-text">Prediction Engine</span>
                        </h1>
                        <p className="hero-subtitle mb-5">
                            Ensemble ML for Precision Cardiology
                        </p>
                        <div className="d-flex gap-3 justify-content-center flex-wrap">
                            <Link to={user ? '/predict' : '/login'} className="btn-hero-primary">
                                Start Prediction
                            </Link>
                            <Link to={user ? '/models' : '/login'} className="btn-hero-secondary">
                                View Models
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="container mb-5">
                <div className="row g-3">
                    {STATS.map((s, i) => (
                        <div className="col-6 col-md-3" key={i}>
                            <div className="stat-card">
                                <div className="stat-value">{s.value}</div>
                                <div className="stat-label">{s.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* How it works */}
            <section className="py-5">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>
                            How It Works
                        </h2>
                        <p style={{ color: '#64748b', fontSize: '15px', marginTop: '8px' }}>
                            From data entry to risk assessment in seconds
                        </p>
                    </div>
                    <div className="row g-3">
                        {STEPS.map((s, i) => (
                            <div className="col-md-6 col-lg-3" key={i}>
                                <div className="step-card">
                                    <div className="step-number">{s.step}</div>
                                    <h6 style={{ fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>
                                        {s.title}
                                    </h6>
                                    <p style={{ fontSize: '13px', color: '#64748b', marginBottom: 0, lineHeight: '1.6' }}>
                                        {s.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            {!user && (
                <section className="container" style={{ padding: '64px 0' }}>
                    <div className="card-app p-5 text-center">
                        <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.3px', marginBottom: '10px' }}>
                            Ready to get started?
                        </h3>
                        <p style={{ color: '#64748b', marginBottom: '28px', fontSize: '15px' }}>
                            Create a free account to access predictions and history.
                        </p>
                        <Link to="/signup" className="btn-hero-primary">
                            Create Free Account
                        </Link>
                    </div>
                </section>
            )}
        </div>
    );
};

export default Home;
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const { googleLogin } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSuccess = async (credentialResponse) => {
        setLoading(true);
        setError('');
        try {
            await googleLogin(credentialResponse.credential);
            navigate('/predict');
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleError = () => {
        setError('Google sign-in was cancelled or failed. Please try again.');
    };

    return (
        <div className="auth-wrapper">
            <div style={{ width: '100%', maxWidth: '420px' }}>
                <div className="text-center mb-5">
                    <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
                        <span style={{ fontWeight: '800', fontSize: '1.1rem', color: '#111827' }}>
                            Cardio<span style={{ color: 'var(--brand-orange)' }}>Predict</span>
                        </span>
                    </div>
                    <h2 className="auth-title">Welcome</h2>
                    <p className="auth-subtitle">Sign in or create an account to continue</p>
                </div>

                <div className="auth-card">
                    {error && <div className="auth-alert-error mb-4">{error}</div>}

                    <p style={{
                        fontSize: '14px',
                        color: 'var(--brand-brown)',
                        textAlign: 'center',
                        marginBottom: '24px',
                        lineHeight: '1.6'
                    }}>
                        Use your Google account to access CardioPredict. No password needed.
                    </p>

                    <div className="d-flex justify-content-center mb-4">
                        {loading ? (
                            <button className="auth-btn" disabled>
                                <span className="spinner-border spinner-border-sm me-2"
                                    style={{ color: 'white' }}></span>
                                Signing in...
                            </button>
                        ) : (
                            <GoogleLogin
                                onSuccess={handleSuccess}
                                onError={handleError}
                                useOneTap={false}
                                theme="outline"
                                size="large"
                                text="continue_with"
                                shape="rectangular"
                                width="320"
                            />
                        )}
                    </div>

                    <p style={{
                        fontSize: '12px',
                        color: '#94a3b8',
                        textAlign: 'center',
                        marginBottom: 0,
                        lineHeight: '1.6'
                    }}>
                        By continuing, you agree this app is for educational purposes only and not a substitute for medical advice.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
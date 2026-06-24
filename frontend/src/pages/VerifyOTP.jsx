import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

const VerifyOTP = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;
    const password = location.state?.password;

    if (!email) { navigate('/signup'); return null; }

    const handleVerify = async () => {
        if (!otp || otp.length !== 6) { setError('Please enter the 6-digit code'); return; }
        setLoading(true); setError('');
        try {
            await authAPI.verifyOTP({ email, otp });
            await login({ email, password });
            navigate('/predict');
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed. Please try again.');
        } finally { setLoading(false); }
    };

    const handleResend = async () => {
        setResending(true); setError(''); setSuccess('');
        try {
            await authAPI.resendOTP({ email });
            setSuccess('New code sent to your email.');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend code.');
        } finally { setResending(false); }
    };

    return (
        <div className="auth-wrapper">
            <div style={{ width: '100%', maxWidth: '420px' }}>
                <div className="text-center mb-5">
                    <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '16px',
                        background: 'var(--brand-ivory)',
                        border: '1px solid rgba(93, 64, 55, 0.15)',
                        color: 'var(--brand-orange)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center', margin: '0 auto 16px', fontSize: '24px'
                    }}
                    >
                        ✉
                    </div>
                    <h2 className="auth-title">Check your email</h2>
                    <p className="auth-subtitle">We sent a 6-digit code to</p>
                    <p style={{ fontWeight: '600', fontSize: '14px', marginTop: '4px' }}>{email}</p>
                </div>

                <div className="auth-card">
                    {error && <div className="auth-alert-error">{error}</div>}
                    {success && <div className="auth-alert-success">{success}</div>}

                    <div className="mb-4">
                        <label className="auth-label">Verification code</label>
                        <input
                            type="text"
                            className="auth-input text-center"
                            style={{ fontSize: '28px', letterSpacing: '14px', fontWeight: '700', padding: '16px' }}
                            placeholder="000000"
                            maxLength={6}
                            value={otp}
                            onChange={e => { setOtp(e.target.value.replace(/\D/g, '')); setError(''); }}
                            onKeyDown={e => e.key === 'Enter' && handleVerify()}
                        />
                        <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '6px' }}>
                            Code expires in 10 minutes
                        </p>
                    </div>

                    <button className="auth-btn mb-4" onClick={handleVerify} disabled={loading}>
                        {loading ? (
                            <><span className="spinner-border spinner-border-sm me-2"
                                style={{ color: 'white' }}></span>Verifying...</>
                        ) : 'Verify Email'}
                    </button>

                    <hr className="auth-divider" />

                    <p className="text-center mb-0" style={{ fontSize: '14px', color: '#9ca3af' }}>
                        Didn't receive it?{' '}
                        <button onClick={handleResend} disabled={resending}
                            style={{
                                background: 'none', border: 'none', color: '#6366f1',
                                fontWeight: '600', cursor: 'pointer', fontSize: '14px',
                                fontFamily: 'inherit', padding: 0
                            }}>
                            {resending ? 'Sending...' : 'Resend code'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VerifyOTP;
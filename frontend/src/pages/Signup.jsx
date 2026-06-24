import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const Signup = () => {
    const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const navigate = useNavigate();

    const validate = () => {
        const e = {};
        if (!form.email) e.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.(com|in|org|net|edu|co\.in|gov|io|ai)$/i.test(form.email))
            e.email = 'Please enter a valid email address';
        if (!form.password) e.password = 'Password is required';
        else if (form.password.length < 8) e.password = 'Minimum 8 characters';
        else if (!/\d/.test(form.password)) e.password = 'Must contain at least one number';
        if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password';
        else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
        return e;
    };

    const handleSubmit = async () => {
        const e = validate();
        if (Object.keys(e).length > 0) { setErrors(e); return; }
        setLoading(true);
        setApiError('');
        try {
            await authAPI.signup(form);
            navigate('/verify-otp', { state: { email: form.email, password: form.password } });
        } catch (err) {
            setApiError(err.response?.data?.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };

    return (
        <div className="auth-wrapper">
            <div style={{ width: '100%', maxWidth: '420px' }}>
                <div className="text-center mb-5">
                    <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
                        <span style={{ fontWeight: '800', fontSize: '1.1rem', color: '#111827' }}>
                            Cardio<span>Predict</span>
                        </span>
                    </div>
                    <h2 className="auth-title">Create account</h2>
                    <p className="auth-subtitle">Start predicting cardiovascular risk today</p>
                </div>

                <div className="auth-card">
                    {apiError && <div className="auth-alert-error">{apiError}</div>}

                    <div className="mb-3">
                        <label className="auth-label">Email address</label>
                        <input
                            type="email"
                            className={`auth-input ${errors.email ? 'is-invalid' : ''}`}
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={e => handleChange('email', e.target.value)}
                        />
                        {errors.email && <div className="invalid-msg">{errors.email}</div>}
                    </div>

                    <div className="mb-3">
                        <label className="auth-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className={`auth-input ${errors.password ? 'is-invalid' : ''}`}
                                placeholder="Min 8 chars, at least 1 number"
                                value={form.password}
                                style={{ paddingRight: '64px' }}
                                onChange={e => handleChange('password', e.target.value)}
                            />
                            <button type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute', right: '12px', top: '50%',
                                    transform: 'translateY(-50%)', background: 'none',
                                    border: 'none', color: '#9ca3af', fontSize: '13px',
                                    cursor: 'pointer', fontWeight: '500', fontFamily: 'inherit'
                                }}>
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                        {errors.password && <div className="invalid-msg">{errors.password}</div>}
                    </div>

                    <div className="mb-4">
                        <label className="auth-label">Confirm password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showConfirm ? 'text' : 'password'}
                                className={`auth-input ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                placeholder="Repeat your password"
                                value={form.confirmPassword}
                                style={{ paddingRight: '64px' }}
                                onChange={e => handleChange('confirmPassword', e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                            />
                            <button type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                style={{
                                    position: 'absolute', right: '12px', top: '50%',
                                    transform: 'translateY(-50%)', background: 'none',
                                    border: 'none', color: '#9ca3af', fontSize: '13px',
                                    cursor: 'pointer', fontWeight: '500', fontFamily: 'inherit'
                                }}>
                                {showConfirm ? 'Hide' : 'Show'}
                            </button>
                        </div>
                        {errors.confirmPassword && <div className="invalid-msg">{errors.confirmPassword}</div>}
                    </div>

                    <button className="auth-btn mb-4" onClick={handleSubmit} disabled={loading}>
                        {loading ? (
                            <><span className="spinner-border spinner-border-sm me-2"
                                style={{ color: 'white' }}></span>Creating account...</>
                        ) : 'Create Account'}
                    </button>

                    <hr className="auth-divider" />

                    <p className="text-center mb-0" style={{ fontSize: '14px', color: '#9ca3af' }}>
                        Already have an account?{' '}
                        <Link to="/login" className="auth-link">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
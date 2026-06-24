import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState('');

    const handleDeleteAccount = async () => {
        setDeleting(true); setError('');
        try {
            await authAPI.deleteAccount();
            await logout();
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete account.');
            setDeleting(false);
        }
    };

    return (
        <div className="app-wrapper">
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-5">
                        <div className="app-page-header">
                            <h2 className="app-page-title">Profile</h2>
                            <p className="app-page-subtitle">Manage your account settings</p>
                        </div>

                        {/* Account Info */}
                        <div className="card-app p-4 mb-4">
                            <p className="card-section-label">Account Information</p>
                            <div className="mb-3">
                                <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '3px', fontWeight: '500' }}>Email</p>
                                <p style={{ fontSize: '15px', fontWeight: '500', color: '#0f172a', marginBottom: 0 }}>
                                    {user?.email}
                                </p>
                            </div>
                            <hr style={{ borderColor: '#f1f5f9', margin: '16px 0' }} />
                            <div>
                                <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '3px', fontWeight: '500' }}>
                                    Member Since
                                </p>
                                <p style={{ fontSize: '15px', fontWeight: '500', color: '#0f172a', marginBottom: 0 }}>
                                    {user?.created_at
                                        ? new Date(user.created_at).toLocaleDateString('en-IN', {
                                            day: '2-digit', month: 'long', year: 'numeric'
                                        })
                                        : 'June 2026'
                                    }
                                </p>
                            </div>
                        </div>

                        {/* Danger Zone */}
                        <div className="card-app p-4">
                            <p style={{
                                fontSize: '11px', fontWeight: '700', textTransform: 'uppercase',
                                letterSpacing: '1px', color: '#dc2626', marginBottom: '8px'
                            }}>
                                Danger Zone
                            </p>
                            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px', lineHeight: '1.6' }}>
                                Permanently delete your account and all prediction history. This cannot be undone.
                            </p>

                            {error && <div className="app-alert-error mb-3">{error}</div>}

                            {!showConfirm ? (
                                <button className="btn-app-danger" onClick={() => setShowConfirm(true)}>
                                    Delete Account
                                </button>
                            ) : (
                                <div>
                                    <p style={{ fontSize: '13px', color: '#dc2626', fontWeight: '500', marginBottom: '12px' }}>
                                        Are you sure? This action is permanent.
                                    </p>
                                    <div className="d-flex gap-2">
                                        <button className="btn-confirm-danger" onClick={handleDeleteAccount} disabled={deleting}>
                                            {deleting ? (
                                                <><span className="spinner-border spinner-border-sm me-1"
                                                    style={{ color: 'white' }}></span>Deleting...</>
                                            ) : 'Yes, Delete My Account'}
                                        </button>
                                        <button className="btn-cancel" onClick={() => setShowConfirm(false)} disabled={deleting}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
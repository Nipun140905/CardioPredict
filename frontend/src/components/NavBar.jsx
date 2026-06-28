import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavBar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-cardio sticky-top">
            <div className="container">
                <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
                    <span style={{ fontWeight: '800', fontSize: '1.4rem', color: 'var(--brand-navy)', letterSpacing: '-0.5px' }}>
                        Cardio<span style={{ color: 'var(--brand-orange)' }}>Predict</span></span>
                </Link>

                <button className="navbar-toggler border-0" type="button"
                    data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-center gap-1">
                        {user ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/predict">Predict</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/history">History</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/models">System Diagnostics</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/profile">Profile</Link>
                                </li>
                                <li className="nav-item ms-2">
                                    <button className="btn-nav-ghost"
                                        onClick={handleLogout}>Logout</button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Login</Link>
                                </li>
                                <li className="nav-item ms-2">
                                    <Link className="btn-nav-primary" to="/login">Get Started</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
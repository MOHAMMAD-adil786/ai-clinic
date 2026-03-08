import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { FiActivity, FiMail, FiLock } from 'react-icons/fi';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            if (user.role === 'admin') navigate('/admin');
            else if (user.role === 'doctor') navigate('/doctor');
            else if (user.role === 'receptionist') navigate('/receptionist');
            else navigate('/patient');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(email, password);
            toast.success('Logged in successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed. Please check credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            {/* Animated Background Elements */}
            <div className="bg-blob blob-1"></div>
            <div className="bg-blob blob-2"></div>

            <div className="login-container">
                <div className="login-logo fade-in">
                    <div className="icon" style={{ background: 'none', boxShadow: 'none' }}>
                        <img src="/logo.svg" alt="PulseAI Logo" style={{ width: '100%', height: '100%' }} />
                    </div>
                    <h1>PulseAI</h1>
                    <p>Intelligence in Every Beat</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form slide-up">
                    <div className="form-group search-input-wrapper" style={{ margin: '0 0 20px', maxWidth: 'none', animationDelay: '0.1s' }}>
                        <FiMail className="search-icon" />
                        <input
                            type="email"
                            placeholder="Email address"
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group search-input-wrapper" style={{ margin: '0 0 28px', maxWidth: 'none', animationDelay: '0.2s' }}>
                        <FiLock className="search-icon" />
                        <input
                            type="password"
                            placeholder="Password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary slide-up" disabled={loading} style={{ animationDelay: '0.3s' }}>
                        {loading ? 'Authenticating...' : 'Sign In To Clinic'}
                    </button>
                </form>

                <div className="login-footer fade-in" style={{ animationDelay: '0.5s' }}>
                    <p className="demo-label">DEMO ACCESS</p>
                    <div className="demo-grid">
                        <div className="demo-item">
                            <span className="role">Admin:</span>
                            <span className="creds">admin@clinic.com / password123</span>
                        </div>
                        <div className="demo-item">
                            <span className="role">Doctor:</span>
                            <span className="creds">doc@clinic.com / password123</span>
                        </div>
                        <div className="demo-item">
                            <span className="role">Receptionist:</span>
                            <span className="creds">frontdesk@clinic.com / password123</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

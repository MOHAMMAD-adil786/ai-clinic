import { useState, useEffect } from 'react';
import { FiCalendar, FiFileText, FiClock, FiActivity } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const PatientDashboard = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [aptRes, presRes] = await Promise.all([
                    api.get('/appointments/my-appointments'),
                    api.get('/prescriptions/my-prescriptions')
                ]);
                setAppointments(aptRes.data);
                setPrescriptions(presRes.data);
            } catch (error) {
                toast.error('Failed to load patient data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const upcomingApt = appointments.find(a => new Date(a.date) >= new Date() && a.status !== 'cancelled');
    const pastAptCount = appointments.filter(a => new Date(a.date) < new Date() || a.status === 'completed').length;

    if (loading) {
        return <div className="loading-spinner"><div className="spinner"></div></div>;
    }

    return (
        <div className="fade-in">
            <div className="ai-card" style={{ marginBottom: '28px' }}>
                <h3>Welcome, {user.name}</h3>
                <p>Your AI-powered health portal. Manage appointments and view smart prescriptions all in one place.</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card blue">
                    <div className="stat-icon"><FiCalendar /></div>
                    <div className="stat-value">{upcomingApt ? 1 : 0}</div>
                    <div className="stat-label">Upcoming Appointment</div>
                </div>

                <div className="stat-card green">
                    <div className="stat-icon"><FiClock /></div>
                    <div className="stat-value">{pastAptCount}</div>
                    <div className="stat-label">Past Visits</div>
                </div>

                <div className="stat-card purple">
                    <div className="stat-icon"><FiFileText /></div>
                    <div className="stat-value">{prescriptions.length}</div>
                    <div className="stat-label">Digital Prescriptions</div>
                </div>
            </div>

            <div className="grid-2">
                <div className="card">
                    <div className="card-header">
                        <h3>Next Appointment</h3>
                    </div>
                    <div className="card-body">
                        {upcomingApt ? (
                            <div style={{ padding: '20px', background: 'var(--primary-bg)', borderRadius: 'var(--radius)', border: '1px solid #bae6fd' }}>
                                <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary-dark)', marginBottom: '4px' }}>
                                    {new Date(upcomingApt.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                </div>
                                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text)', marginBottom: '16px' }}>
                                    {upcomingApt.time}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                    <strong>Doctor:</strong> Dr. {upcomingApt.doctorId?.name} ({upcomingApt.doctorId?.specialization})
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                                    <strong>Status:</strong>
                                    <span className={`badge badge-${upcomingApt.status}`}>{upcomingApt.status}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-icon"><FiCalendar /></div>
                                <h3>No upcoming appointments</h3>
                                <p>You have no scheduled visits at the moment.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <h3>Recent Prescriptions</h3>
                        <Link to="/patient/prescriptions" className="btn btn-sm btn-secondary">View All</Link>
                    </div>
                    {prescriptions.length === 0 ? (
                        <div className="empty-state" style={{ padding: '40px 20px' }}>
                            <div className="empty-icon"><FiFileText /></div>
                            <h3>No prescriptions</h3>
                        </div>
                    ) : (
                        <>
                            <div className="desktop-only-table" style={{ overflowX: 'auto' }}>
                                <table className="data-table">
                                    <tbody>
                                        {prescriptions.slice(0, 3).map(p => (
                                            <tr key={p._id}>
                                                <td>
                                                    <div style={{ fontWeight: '600', color: 'var(--text)' }}>
                                                        Dr. {p.doctorId?.name}
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                                                        {new Date(p.createdAt).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="badge badge-pro" style={{ fontSize: '0.65rem' }}>
                                                        AI Analyzed
                                                    </div>
                                                </td>
                                                <td style={{ textAlign: 'right' }}>
                                                    <Link to={`/prescription/${p._id}`} className="btn btn-sm btn-primary">
                                                        View
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card View */}
                            <div className="mobile-card-list" style={{ padding: '16px' }}>
                                {prescriptions.slice(0, 3).map(p => (
                                    <div key={p._id} className="mobile-card">
                                        <div className="mobile-card-header">
                                            <div className="mobile-card-title">Dr. {p.doctorId?.name}</div>
                                            <div className="badge badge-pro">AI Analyzed</div>
                                        </div>
                                        <div className="mobile-card-details">
                                            <div className="mobile-detail-item">
                                                <FiFileText className="mobile-detail-icon" />
                                                <span>{p.diagnosis || 'General Checkup'}</span>
                                            </div>
                                            <div className="mobile-detail-item">
                                                <FiActivity className="mobile-detail-icon" />
                                                <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="mobile-card-actions">
                                            <Link to={`/prescription/${p._id}`} className="btn btn-primary" style={{ flex: 1, textAlign: 'center' }}>
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;

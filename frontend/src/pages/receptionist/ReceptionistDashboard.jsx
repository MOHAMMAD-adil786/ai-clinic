import { useState, useEffect } from 'react';
import { FiUsers, FiCalendar, FiClock, FiPlusCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';

const ReceptionistDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTodayAppointments = async () => {
            try {
                const now = new Date();
                const today = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
                const res = await api.get(`/appointments?date=${today}`);
                setAppointments(res.data);
            } catch (error) {
                toast.error('Failed to load appointments');
            } finally {
                setLoading(false);
            }
        };

        fetchTodayAppointments();
    }, []);

    const pendingCount = appointments.filter(a => a.status === 'pending').length;
    const confirmedCount = appointments.filter(a => a.status === 'confirmed').length;

    return (
        <div className="fade-in">
            <div className="stats-grid">
                <div className="stat-card blue">
                    <div className="stat-icon"><FiCalendar /></div>
                    <div className="stat-value">{appointments.length}</div>
                    <div className="stat-label">Total Appointments Today</div>
                </div>

                <div className="stat-card orange">
                    <div className="stat-icon"><FiClock /></div>
                    <div className="stat-value">{pendingCount}</div>
                    <div className="stat-label">Pending Confirmation</div>
                </div>

                <div className="stat-card green">
                    <div className="stat-icon"><FiUsers /></div>
                    <div className="stat-value">{confirmedCount}</div>
                    <div className="stat-label">Confirmed/Waiting</div>
                </div>

                <div className="stat-card purple" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Link to="/receptionist/register-patient" className="btn btn-primary" style={{ marginBottom: '10px', justifyContent: 'center' }}>
                        <FiPlusCircle /> New Patient
                    </Link>
                    <Link to="/receptionist/book-appointment" className="btn btn-secondary" style={{ justifyContent: 'center' }}>
                        <FiCalendar /> Book Appointment
                    </Link>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h3>Today's Schedule</h3>
                </div>
                <div className="card-body" style={{ padding: 0 }}>
                    {loading ? (
                        <div className="loading-spinner"><div className="spinner"></div></div>
                    ) : appointments.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon"><FiCalendar /></div>
                            <h3>No appointments today</h3>
                            <p>Schedule a new appointment to see it here.</p>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Time</th>
                                        <th>Patient</th>
                                        <th>Doctor</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.map(apt => (
                                        <tr key={apt._id}>
                                            <td style={{ fontWeight: '600' }}>{apt.time}</td>
                                            <td>
                                                <div style={{ fontWeight: '500' }}>{apt.patientId?.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{apt.patientId?.contact}</div>
                                            </td>
                                            <td>Dr. {apt.doctorId?.name}</td>
                                            <td>
                                                <span className={`badge badge-${apt.status}`}>
                                                    {apt.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReceptionistDashboard;

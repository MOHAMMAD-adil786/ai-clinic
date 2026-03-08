import { useState, useEffect } from 'react';
import { FiSearch, FiCheck, FiX, FiCalendar } from 'react-icons/fi';
import api from '../api/axios';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const ManageAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('');
    const { user } = useAuth();

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            let url = '/appointments';
            const params = new URLSearchParams();

            if (filter !== 'all') params.append('status', filter);
            if (dateFilter) params.append('date', dateFilter);

            if (params.toString()) url += `?${params.toString()}`;

            const res = await api.get(url);
            setAppointments(res.data);
        } catch (error) {
            toast.error('Failed to load appointments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [filter, dateFilter]);

    const handleStatusChange = async (id, newStatus) => {
        try {
            await api.put(`/appointments/${id}`, { status: newStatus });
            toast.success(`Appointment marked as ${newStatus}`);
            fetchAppointments();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    return (
        <div className="fade-in">
            <div className="card" style={{ marginBottom: '24px' }}>
                <div className="card-body" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div className="form-group" style={{ margin: 0, minWidth: '200px' }}>
                        <label className="form-label">Filter by Status</label>
                        <select
                            className="form-input"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="all">All Appointments</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    <div className="form-group" style={{ margin: 0, minWidth: '200px' }}>
                        <label className="form-label">Filter by Date</label>
                        <input
                            type="date"
                            className="form-input"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                        />
                    </div>

                    {(filter !== 'all' || dateFilter) && (
                        <div style={{ marginTop: '24px' }}>
                            <button
                                className="btn btn-secondary"
                                onClick={() => { setFilter('all'); setDateFilter(''); }}
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h3>Appointments</h3>
                    <div className="badge badge-primary">{appointments.length} Records</div>
                </div>
                <div className="card-body" style={{ padding: 0 }}>
                    {loading ? (
                        <div className="loading-spinner"><div className="spinner"></div></div>
                    ) : appointments.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon"><FiCalendar /></div>
                            <h3>No appointments found</h3>
                            <p>No appointments match your current filters.</p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table View */}
                            <div className="desktop-only-table" style={{ overflowX: 'auto' }}>
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Date & Time</th>
                                            <th>Patient</th>
                                            <th>Doctor</th>
                                            <th>Reason</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {appointments.map(apt => (
                                            <tr key={apt._id}>
                                                <td>
                                                    <div style={{ fontWeight: '600' }}>
                                                        {new Date(apt.date).toLocaleDateString()}
                                                    </div>
                                                    <div style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.85rem' }}>
                                                        {apt.time}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{ fontWeight: '500' }}>{apt.patientId?.name}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                                                        {apt.patientId?.contact}
                                                    </div>
                                                </td>
                                                <td>Dr. {apt.doctorId?.name}</td>
                                                <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {apt.reason || '-'}
                                                </td>
                                                <td>
                                                    <span className={`badge badge-${apt.status}`}>
                                                        {apt.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="action-buttons">
                                                        {apt.status === 'pending' && (user.role === 'admin' || user.role === 'receptionist') && (
                                                            <button
                                                                className="btn-icon"
                                                                title="Confirm"
                                                                style={{ color: 'var(--success)', borderColor: 'var(--success)' }}
                                                                onClick={() => handleStatusChange(apt._id, 'confirmed')}
                                                            >
                                                                <FiCheck />
                                                            </button>
                                                        )}

                                                        {apt.status === 'confirmed' && user.role === 'doctor' && (
                                                            <button
                                                                className="btn-icon"
                                                                title="Mark Completed"
                                                                style={{ color: 'var(--success)', borderColor: 'var(--success)' }}
                                                                onClick={() => handleStatusChange(apt._id, 'completed')}
                                                            >
                                                                <FiCheck />
                                                            </button>
                                                        )}

                                                        {['pending', 'confirmed'].includes(apt.status) && (
                                                            <button
                                                                className="btn-icon"
                                                                title="Cancel"
                                                                style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}
                                                                onClick={() => {
                                                                    if (window.confirm('Are you sure you want to cancel this appointment?')) {
                                                                        handleStatusChange(apt._id, 'cancelled');
                                                                    }
                                                                }}
                                                            >
                                                                <FiX />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card View */}
                            <div className="mobile-card-list">
                                {appointments.map(apt => (
                                    <div key={apt._id} className="mobile-card" style={{ borderLeft: `4px solid var(--${apt.status === 'pending' ? 'secondary' : apt.status === 'confirmed' ? 'primary' : apt.status === 'completed' ? 'success' : 'danger'})` }}>
                                        <div className="mobile-card-header">
                                            <div className="mobile-card-title">{apt.patientId?.name}</div>
                                            <span className={`badge badge-${apt.status}`} style={{ fontSize: '0.7rem' }}>
                                                {apt.status}
                                            </span>
                                        </div>

                                        <div className="mobile-card-details">
                                            <div className="mobile-detail-item">
                                                <FiCalendar className="mobile-detail-icon" />
                                                <span style={{ fontWeight: '600', color: 'var(--primary)' }}>
                                                    {new Date(apt.date).toLocaleDateString()} @ {apt.time}
                                                </span>
                                            </div>
                                            <div className="mobile-detail-item">
                                                <FiUser className="mobile-detail-icon" />
                                                <span>Doctor: Dr. {apt.doctorId?.name}</span>
                                            </div>
                                            {apt.reason && (
                                                <div className="mobile-detail-item">
                                                    <FiFileText className="mobile-detail-icon" />
                                                    <span>Reason: {apt.reason}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mobile-card-actions">
                                            {apt.status === 'pending' && (user.role === 'admin' || user.role === 'receptionist') && (
                                                <button
                                                    className="btn btn-sm"
                                                    style={{ flex: 1, background: 'var(--success)', color: 'white' }}
                                                    onClick={() => handleStatusChange(apt._id, 'confirmed')}
                                                >
                                                    <FiCheck /> Confirm
                                                </button>
                                            )}

                                            {apt.status === 'confirmed' && user.role === 'doctor' && (
                                                <button
                                                    className="btn btn-sm"
                                                    style={{ flex: 1, background: 'var(--success)', color: 'white' }}
                                                    onClick={() => handleStatusChange(apt._id, 'completed')}
                                                >
                                                    <FiCheck /> Complete
                                                </button>
                                            )}

                                            {['pending', 'confirmed'].includes(apt.status) && (
                                                <button
                                                    className="btn btn-sm"
                                                    style={{ flex: 1, background: 'white', border: '1px solid var(--danger)', color: 'var(--danger)' }}
                                                    onClick={() => {
                                                        if (window.confirm('Are you sure you want to cancel this appointment?')) {
                                                            handleStatusChange(apt._id, 'cancelled');
                                                        }
                                                    }}
                                                >
                                                    <FiX /> Cancel
                                                </button>
                                            )}
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

export default ManageAppointments;

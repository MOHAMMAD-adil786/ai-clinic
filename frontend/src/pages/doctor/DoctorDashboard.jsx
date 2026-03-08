import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FiCalendar, FiCheckSquare, FiFileText, FiClock } from 'react-icons/fi';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';

const DoctorDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await api.get('/analytics/doctor');
                setData(res.data);
            } catch (error) {
                toast.error('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) {
        return <div className="loading-spinner"><div className="spinner"></div></div>;
    }

    if (!data) return null;

    return (
        <div className="fade-in">
            <div className="stats-grid">
                <div className="stat-card blue">
                    <div className="stat-icon"><FiCalendar /></div>
                    <div className="stat-value">{data.stats.todayAppointments}</div>
                    <div className="stat-label">Appointments Today</div>
                </div>

                <div className="stat-card green">
                    <div className="stat-icon"><FiCheckSquare /></div>
                    <div className="stat-value">{data.stats.completedAppointments}</div>
                    <div className="stat-label">Completed All Time</div>
                </div>

                <div className="stat-card purple">
                    <div className="stat-icon"><FiFileText /></div>
                    <div className="stat-value">{data.stats.prescriptionsCount}</div>
                    <div className="stat-label">Prescriptions Written</div>
                </div>

                <div className="stat-card orange">
                    <div className="stat-icon"><FiClock /></div>
                    <div className="stat-value">{data.stats.monthlyAppointments}</div>
                    <div className="stat-label">Appointments this Month</div>
                </div>
            </div>

            <div className="grid-2">
                <div className="card">
                    <div className="card-header">
                        <h3>Weekly Patient Load</h3>
                    </div>
                    <div className="card-body" style={{ height: '320px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.weeklyTrend}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="day" />
                                <YAxis allowDecimals={false} />
                                <Tooltip cursor={{ fill: 'rgba(14, 165, 233, 0.05)' }} />
                                <Bar dataKey="appointments" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <h3>Today's Schedule Quick View</h3>
                    </div>
                    <div className="card-body">
                        <div className="empty-state">
                            <div className="empty-icon"><FiCalendar /></div>
                            <h3>Ready to see patients</h3>
                            <p>Check the Appointments tab for your full schedule today.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;

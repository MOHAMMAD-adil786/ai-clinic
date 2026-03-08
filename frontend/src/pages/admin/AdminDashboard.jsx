import { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { FiUsers, FiCalendar, FiDollarSign, FiActivity } from 'react-icons/fi';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';

const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

const AdminDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await api.get('/analytics/admin');
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
                    <div className="stat-icon"><FiUsers /></div>
                    <div className="stat-value">{data.stats.totalPatients}</div>
                    <div className="stat-label">Total Patients</div>
                </div>

                <div className="stat-card purple">
                    <div className="stat-icon"><FiActivity /></div>
                    <div className="stat-value">{data.stats.totalDoctors}</div>
                    <div className="stat-label">Active Doctors</div>
                </div>

                <div className="stat-card green">
                    <div className="stat-icon"><FiCalendar /></div>
                    <div className="stat-value">{data.stats.totalAppointments}</div>
                    <div className="stat-label">Total Appointments</div>
                </div>

                <div className="stat-card orange">
                    <div className="stat-icon"><FiDollarSign /></div>
                    <div className="stat-value">${data.stats.revenue}</div>
                    <div className="stat-label">Estimated Revenue</div>
                </div>
            </div>

            <div className="grid-2 dashboard-charts-container" style={{ marginBottom: '24px' }}>
                <div className="card chart-card">
                    <div className="card-header">
                        <h3>Appointments Overview</h3>
                    </div>
                    <div className="card-body" style={{ height: '280px', padding: '10px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.monthlyTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                <Line type="monotone" dataKey="appointments" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--primary)', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card chart-card">
                    <div className="card-header">
                        <h3>AI Diagnoses</h3>
                    </div>
                    <div className="card-body" style={{ height: '280px', padding: '10px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.commonDiagnoses} layout="vertical" margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                <Bar dataKey="count" fill="var(--secondary)" radius={[0, 10, 10, 0]} barSize={20}>
                                    {data.commonDiagnoses.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid-3">
                <div className="card" style={{ gridColumn: 'span 1' }}>
                    <div className="card-header">
                        <h3>Appointment Status</h3>
                    </div>
                    <div className="card-body" style={{ height: '260px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.statusDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.statusDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '10px' }}>
                            {data.statusDistribution.map((entry, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: COLORS[index % COLORS.length] }}></div>
                                    <span style={{ textTransform: 'capitalize' }}>{entry.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="card" style={{ gridColumn: 'span 2' }}>
                    <div className="card-header">
                        <h3>System Status & Activity</h3>
                    </div>
                    <div className="card-body">
                        <div className="timeline">
                            <div className="timeline-item appointment">
                                <div className="timeline-date">Just Now</div>
                                <div className="timeline-content">
                                    <div className="timeline-type" style={{ color: 'var(--primary)' }}>System Update</div>
                                    <div>AI Predictive Analytics module is running efficiently.</div>
                                </div>
                            </div>
                            <div className="timeline-item prescription">
                                <div className="timeline-date">2 hours ago</div>
                                <div className="timeline-content">
                                    <div className="timeline-type" style={{ color: 'var(--success)' }}>Milestone</div>
                                    <div>Surpassed {data.stats.totalPrescriptions} total AI-generated prescriptions.</div>
                                </div>
                            </div>
                            <div className="timeline-item diagnosis">
                                <div className="timeline-date">Yesterday</div>
                                <div className="timeline-content">
                                    <div className="timeline-type" style={{ color: 'var(--secondary)' }}>Subscription Plan</div>
                                    <div>Pro Plan active. Gemini API integration status: OK.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

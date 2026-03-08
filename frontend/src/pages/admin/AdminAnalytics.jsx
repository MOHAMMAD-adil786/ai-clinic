import { FiPieChart } from 'react-icons/fi';
import AdminDashboard from './AdminDashboard';

// Re-using the AdminDashboard component for the /admin/analytics route
// since it already contains the Recharts implementation of all the clinic analytics data.
const AdminAnalytics = () => {
    return (
        <div className="fade-in">
            <div style={{ marginBottom: '20px' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FiPieChart color="var(--primary)" />
                    Clinic Performance Analytics
                </h2>
                <p style={{ color: 'var(--text-light)' }}>Comprehensive data visualization of clinic operations, appointments, and AI usage metrics.</p>
            </div>
            <AdminDashboard />
        </div>
    );
};

export default AdminAnalytics;

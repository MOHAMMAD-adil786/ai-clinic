import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    FiHome, FiUsers, FiCalendar, FiFileText,
    FiPieChart, FiSettings, FiLogOut, FiActivity,
    FiMenu, FiX
} from 'react-icons/fi';

const DashboardLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    const getNavItems = () => {
        const role = user?.role;
        const items = [];

        // Dashboard Home (for everyone)
        items.push({ icon: FiHome, label: 'Dashboard', path: `/${role}` });

        if (role === 'admin') {
            items.push({ icon: FiUsers, label: 'Manage Staff', path: '/admin/staff' });
            items.push({ icon: FiPieChart, label: 'Analytics', path: '/admin/analytics' });
            items.push({ icon: FiSettings, label: 'Subscription Plans', path: '/admin/plans' });
        }

        if (role === 'doctor' || role === 'admin' || role === 'receptionist') {
            items.push({ icon: FiUsers, label: 'Patients', path: '/patients' });
            items.push({ icon: FiCalendar, label: 'Appointments', path: '/appointments' });
        }

        if (role === 'doctor') {
            items.push({ icon: FiFileText, label: 'My Prescriptions', path: '/doctor/prescriptions' });
            items.push({ icon: FiActivity, label: 'AI Diagnosis', path: '/doctor/ai-diagnosis' });
        }

        if (role === 'receptionist') {
            items.push({ icon: FiUsers, label: 'Register Patient', path: '/receptionist/register-patient' });
            items.push({ icon: FiCalendar, label: 'Book Appointment', path: '/receptionist/book-appointment' });
        }

        if (role === 'patient') {
            items.push({ icon: FiCalendar, label: 'My Appointments', path: '/patient/appointments' });
            items.push({ icon: FiFileText, label: 'My Prescriptions', path: '/patient/prescriptions' });
            items.push({ icon: FiActivity, label: 'AI Diagnosis', path: '/patient/ai-diagnosis' });
            items.push({ icon: FiSettings, label: 'My Profile', path: '/patient/profile' });
        }

        return items;
    };

    const navItems = getNavItems();

    return (
        <div className={`app-layout ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            {/* Sidebar Overlay */}
            {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

            {/* Sidebar */}
            <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-logo">
                    <button className="mobile-close" onClick={closeSidebar}>
                        <FiX />
                    </button>
                    <div className="logo-icon" style={{ background: 'none', boxShadow: 'none' }}>
                        <img src="/logo.svg" alt="PulseAI Logo" style={{ width: '100%', height: '100%' }} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.4rem', letterSpacing: '-0.5px' }}>PulseAI</h2>
                        <span style={{ color: 'var(--primary-light)', fontWeight: '700' }}>SMART HEALTH</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <div className="nav-section-title">Main Menu</div>
                    {navItems.map((item, index) => {
                        const isActive = location.pathname === item.path ||
                            (item.path !== `/${user?.role}` && location.pathname.startsWith(item.path));
                        return (
                            <Link
                                key={index}
                                to={item.path}
                                className={`nav-item ${isActive ? 'active' : ''}`}
                                onClick={closeSidebar}
                            >
                                <item.icon className="nav-icon" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="sidebar-footer">
                    <button onClick={() => { logout(); closeSidebar(); }} className="logout-btn">
                        <FiLogOut className="nav-icon" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="page-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button className="mobile-menu-btn" onClick={toggleSidebar}>
                            <FiMenu />
                        </button>
                        <h1>
                            {navItems.find(item =>
                                location.pathname === item.path ||
                                (item.path !== `/${user?.role}` && location.pathname.startsWith(item.path))
                            )?.label || 'Dashboard'}
                        </h1>
                    </div>

                    <div className="user-info">
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text)' }}>
                                {user?.name}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'capitalize' }}>
                                {user?.role} {user?.subscriptionPlan === 'pro' && '• Pro'}
                            </div>
                        </div>
                        <div className="user-avatar">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                    </div>
                </header>

                <div className="page-body">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;

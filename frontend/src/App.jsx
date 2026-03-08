import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageStaff from './pages/admin/ManageStaff';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import SubscriptionPlans from './pages/admin/SubscriptionPlans';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import ReceptionistDashboard from './pages/receptionist/ReceptionistDashboard';
import PatientDashboard from './pages/patient/PatientDashboard';
import RegisterPatient from './pages/receptionist/RegisterPatient';
import BookAppointment from './pages/receptionist/BookAppointment';
import ManagePatients from './pages/ManagePatients';
import ManageAppointments from './pages/ManageAppointments';
import AddDiagnosis from './pages/doctor/AddDiagnosis';
import WritePrescription from './pages/doctor/WritePrescription';
import ViewPrescription from './pages/ViewPrescription';
import DoctorPrescriptions from './pages/doctor/DoctorPrescriptions';
import PatientPrescriptions from './pages/patient/PatientPrescriptions';
import PatientAIDiagnosis from './pages/patient/PatientAIDiagnosis';
import AITool from './pages/doctor/AITool';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="loading-spinner"><div className="spinner"></div></div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" />;
    }

    return children;
};

const RoleBasedRedirect = () => {
    const { user, loading } = useAuth();

    if (loading) return null;

    if (!user) return <Navigate to="/login" />;

    switch (user.role) {
        case 'admin': return <Navigate to="/admin" />;
        case 'doctor': return <Navigate to="/doctor" />;
        case 'receptionist': return <Navigate to="/receptionist" />;
        case 'patient': return <Navigate to="/patient" />;
        default: return <Navigate to="/login" />;
    }
};

function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<RoleBasedRedirect />} />

            {/* Admin Routes */}
            <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <DashboardLayout>
                        <AdminDashboard />
                    </DashboardLayout>
                </ProtectedRoute>
            } />
            <Route path="/admin/staff" element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <DashboardLayout>
                        <ManageStaff />
                    </DashboardLayout>
                </ProtectedRoute>
            } />
            <Route path="/admin/analytics" element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <DashboardLayout>
                        <AdminAnalytics />
                    </DashboardLayout>
                </ProtectedRoute>
            } />
            <Route path="/admin/plans" element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <DashboardLayout>
                        <SubscriptionPlans />
                    </DashboardLayout>
                </ProtectedRoute>
            } />

            {/* Doctor Routes */}
            <Route path="/doctor" element={
                <ProtectedRoute allowedRoles={['doctor']}>
                    <DashboardLayout>
                        <DoctorDashboard />
                    </DashboardLayout>
                </ProtectedRoute>
            } />
            <Route path="/doctor/add-diagnosis/:patientId" element={
                <ProtectedRoute allowedRoles={['doctor']}>
                    <DashboardLayout>
                        <AddDiagnosis />
                    </DashboardLayout>
                </ProtectedRoute>
            } />
            <Route path="/doctor/write-prescription/:patientId/:appointmentId?" element={
                <ProtectedRoute allowedRoles={['doctor']}>
                    <DashboardLayout>
                        <WritePrescription />
                    </DashboardLayout>
                </ProtectedRoute>
            } />
            <Route path="/doctor/prescriptions" element={
                <ProtectedRoute allowedRoles={['doctor']}>
                    <DashboardLayout>
                        <DoctorPrescriptions />
                    </DashboardLayout>
                </ProtectedRoute>
            } />
            <Route path="/doctor/ai-diagnosis" element={
                <ProtectedRoute allowedRoles={['doctor']}>
                    <DashboardLayout>
                        <AITool />
                    </DashboardLayout>
                </ProtectedRoute>
            } />

            {/* Receptionist Routes */}
            <Route path="/receptionist" element={
                <ProtectedRoute allowedRoles={['receptionist']}>
                    <DashboardLayout>
                        <ReceptionistDashboard />
                    </DashboardLayout>
                </ProtectedRoute>
            } />
            <Route path="/receptionist/register-patient" element={
                <ProtectedRoute allowedRoles={['receptionist']}>
                    <DashboardLayout>
                        <RegisterPatient />
                    </DashboardLayout>
                </ProtectedRoute>
            } />
            <Route path="/receptionist/book-appointment" element={
                <ProtectedRoute allowedRoles={['receptionist']}>
                    <DashboardLayout>
                        <BookAppointment />
                    </DashboardLayout>
                </ProtectedRoute>
            } />

            {/* Patient Routes */}
            <Route path="/patient" element={
                <ProtectedRoute allowedRoles={['patient']}>
                    <DashboardLayout>
                        <PatientDashboard />
                    </DashboardLayout>
                </ProtectedRoute>
            } />
            <Route path="/patient/prescriptions" element={
                <ProtectedRoute allowedRoles={['patient']}>
                    <DashboardLayout>
                        <PatientPrescriptions />
                    </DashboardLayout>
                </ProtectedRoute>
            } />
            <Route path="/patient/ai-diagnosis" element={
                <ProtectedRoute allowedRoles={['patient']}>
                    <DashboardLayout>
                        <PatientAIDiagnosis />
                    </DashboardLayout>
                </ProtectedRoute>
            } />

            {/* Shared Routes (with different access levels) */}
            <Route path="/patients" element={
                <ProtectedRoute allowedRoles={['admin', 'doctor', 'receptionist']}>
                    <DashboardLayout>
                        <ManagePatients />
                    </DashboardLayout>
                </ProtectedRoute>
            } />
            <Route path="/appointments" element={
                <ProtectedRoute allowedRoles={['admin', 'doctor', 'receptionist']}>
                    <DashboardLayout>
                        <ManageAppointments />
                    </DashboardLayout>
                </ProtectedRoute>
            } />
            <Route path="/prescription/:id" element={
                <ProtectedRoute>
                    <DashboardLayout>
                        <ViewPrescription />
                    </DashboardLayout>
                </ProtectedRoute>
            } />
        </Routes>
    );
}

export default App;

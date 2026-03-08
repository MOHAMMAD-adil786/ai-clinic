import { useState, useEffect } from 'react';
import { FiFileText, FiDownload, FiSearch, FiEye } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const DoctorPrescriptions = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        const fetchPrescriptions = async () => {
            try {
                const res = await api.get('/prescriptions');
                // Filter prescriptions for this specific doctor
                const doctorPrescriptions = res.data.filter(p =>
                    p.doctorId?._id === user._id || p.doctorId === user._id
                );
                setPrescriptions(doctorPrescriptions);
            } catch (error) {
                toast.error('Failed to load prescriptions');
            } finally {
                setLoading(false);
            }
        };

        fetchPrescriptions();
    }, [user._id]);

    const filteredPrescriptions = prescriptions.filter(p =>
        p.patientId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fade-in">
            <div className="search-bar">
                <div className="search-input-wrapper">
                    <FiSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by patient name or diagnosis..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h3><FiFileText style={{ marginRight: '8px' }} /> My Prescriptions History</h3>
                    <div className="badge badge-primary">{filteredPrescriptions.length} Records</div>
                </div>
                <div className="card-body" style={{ padding: 0 }}>
                    {loading ? (
                        <div className="loading-spinner"><div className="spinner"></div></div>
                    ) : filteredPrescriptions.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon"><FiFileText /></div>
                            <h3>No prescriptions found</h3>
                            <p>You haven't written any prescriptions matching this search.</p>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Patient</th>
                                        <th>Diagnosis</th>
                                        <th>Medicines</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPrescriptions.map(p => (
                                        <tr key={p._id}>
                                            <td style={{ fontWeight: '500' }}>
                                                {new Date(p.createdAt).toLocaleDateString()}
                                            </td>
                                            <td>
                                                <div style={{ fontWeight: '600' }}>{p.patientId?.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                                                    Age: {p.patientId?.age}
                                                </div>
                                            </td>
                                            <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {p.diagnosis || '-'}
                                            </td>
                                            <td>
                                                <span className="badge badge-secondary">
                                                    {p.medicines?.length || 0} prescribed
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <Link to={`/prescription/${p._id}`} className="btn-icon" title="View Details">
                                                        <FiEye />
                                                    </Link>
                                                    <button
                                                        className="btn-icon"
                                                        title="Download PDF"
                                                        onClick={() => window.open(`/api/prescriptions/${p._id}/pdf`, '_blank')}
                                                    >
                                                        <FiDownload />
                                                    </button>
                                                </div>
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

export default DoctorPrescriptions;

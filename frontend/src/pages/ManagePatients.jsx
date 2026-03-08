import { useState, useEffect } from 'react';
import { FiSearch, FiEye, FiDownload, FiFileText, FiUser, FiPhone, FiMail, FiClock, FiActivity } from 'react-icons/fi';
import api from '../api/axios';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const ManagePatients = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [patientHistory, setPatientHistory] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await api.get('/patients');
                setPatients(res.data);
            } catch (error) {
                toast.error('Failed to load patients');
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, []);

    const openPatientHistory = async (patient) => {
        setSelectedPatient(patient);
        setShowModal(true);
        setPatientHistory(null); // Show loading state in modal

        try {
            const res = await api.get(`/patients/${patient._id}/history`);
            setPatientHistory(res.data);
        } catch (error) {
            toast.error('Failed to load patient history');
        }
    };

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.contact.includes(searchTerm) ||
        (p.email && p.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="fade-in">
            <div className="search-bar">
                <div className="search-input-wrapper">
                    <FiSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search patients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h3>Patient Directory</h3>
                    <div className="badge badge-confirmed">{filteredPatients.length} Results</div>
                </div>
                <div className="card-body" style={{ padding: 0 }}>
                    {loading ? (
                        <div className="loading-spinner"><div className="spinner"></div></div>
                    ) : filteredPatients.length === 0 ? (
                        <div className="empty-state">
                            <h3>No patients found</h3>
                            <p>Try adjusting your search criteria.</p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table View */}
                            <div className="desktop-only-table" style={{ overflowX: 'auto' }}>
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Details</th>
                                            <th>Contact</th>
                                            <th>Added On</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredPatients.map(patient => (
                                            <tr key={patient._id}>
                                                <td style={{ fontWeight: '600' }}>{patient.name}</td>
                                                <td>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                        Age: {patient.age} | Gender: <span style={{ textTransform: 'capitalize' }}>{patient.gender}</span>
                                                        {patient.bloodGroup && ` | Blood: ${patient.bloodGroup}`}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>{patient.contact}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{patient.email}</div>
                                                </td>
                                                <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                    {new Date(patient.createdAt).toLocaleDateString()}
                                                </td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <button
                                                            className="btn btn-sm btn-secondary"
                                                            onClick={() => openPatientHistory(patient)}
                                                        >
                                                            <FiEye /> History
                                                        </button>

                                                        {user.role === 'doctor' && (
                                                            <>
                                                                {user.subscriptionPlan === 'pro' && (
                                                                    <button
                                                                        className="btn btn-sm"
                                                                        style={{ background: 'var(--secondary)', color: 'white' }}
                                                                        onClick={() => window.location.href = `/doctor/add-diagnosis/${patient._id}`}
                                                                    >
                                                                        AI Diagnosis
                                                                    </button>
                                                                )}
                                                                <button
                                                                    className="btn btn-sm btn-primary"
                                                                    onClick={() => window.location.href = `/doctor/write-prescription/${patient._id}`}
                                                                >
                                                                    Rx
                                                                </button>
                                                            </>
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
                                {filteredPatients.map(patient => (
                                    <div key={patient._id} className="mobile-card">
                                        <div className="mobile-card-header">
                                            <div className="mobile-card-title">{patient.name}</div>
                                            <div className="badge badge-primary" style={{ fontSize: '0.65rem' }}>ID: {patient._id.slice(-4)}</div>
                                        </div>

                                        <div className="mobile-card-details">
                                            <div className="mobile-detail-item">
                                                <FiUser className="mobile-detail-icon" />
                                                <span>Age: {patient.age} • {patient.gender} • {patient.bloodGroup || 'N/A'}</span>
                                            </div>
                                            <div className="mobile-detail-item">
                                                <FiPhone className="mobile-detail-icon" />
                                                <span>{patient.contact}</span>
                                            </div>
                                            {patient.email && (
                                                <div className="mobile-detail-item">
                                                    <FiMail className="mobile-detail-icon" />
                                                    <span>{patient.email}</span>
                                                </div>
                                            )}
                                            <div className="mobile-detail-item">
                                                <FiClock className="mobile-detail-icon" />
                                                <span>Since: {new Date(patient.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        <div className="mobile-card-actions">
                                            <button
                                                className="btn btn-sm btn-secondary"
                                                style={{ flex: 1 }}
                                                onClick={() => openPatientHistory(patient)}
                                            >
                                                <FiEye /> History
                                            </button>

                                            {user.role === 'doctor' && (
                                                <button
                                                    className="btn btn-sm btn-primary"
                                                    style={{ flex: 1 }}
                                                    onClick={() => window.location.href = `/doctor/write-prescription/${patient._id}`}
                                                >
                                                    Write Rx
                                                </button>
                                            )}
                                        </div>

                                        {user.role === 'doctor' && user.subscriptionPlan === 'pro' && (
                                            <button
                                                className="btn btn-sm"
                                                style={{
                                                    width: '100%',
                                                    marginTop: '8px',
                                                    background: 'var(--gradient-primary)',
                                                    color: 'white',
                                                    border: 'none'
                                                }}
                                                onClick={() => window.location.href = `/doctor/add-diagnosis/${patient._id}`}
                                            >
                                                <FiActivity style={{ marginRight: '6px' }} /> AI Assesment
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Medical History: {selectedPatient?.name}</h2>
                            <button className="btn-icon" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div style={{ display: 'flex', gap: '20px', marginBottom: '24px', padding: '16px', background: 'var(--bg)', borderRadius: 'var(--radius)' }}>
                                <div><strong>Age:</strong> {selectedPatient?.age}</div>
                                <div><strong style={{ textTransform: 'capitalize' }}>Gender:</strong> {selectedPatient?.gender}</div>
                                <div><strong>Allergies:</strong> {selectedPatient?.allergies || 'None'}</div>
                            </div>

                            <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>Timeline</h3>

                            {!patientHistory ? (
                                <div className="loading-spinner" style={{ padding: '30px' }}><div className="spinner"></div></div>
                            ) : patientHistory.length === 0 ? (
                                <div className="empty-state">
                                    <p>No medical history found for this patient.</p>
                                </div>
                            ) : (
                                <div className="timeline">
                                    {patientHistory.map((item, index) => (
                                        <div key={index} className={`timeline-item ${item.type}`}>
                                            <div className="timeline-date">
                                                {new Date(item.timestamp).toLocaleString()}
                                            </div>
                                            <div className="timeline-content">
                                                <div className="timeline-type" style={{
                                                    color: item.type === 'appointment' ? 'var(--primary)' :
                                                        item.type === 'prescription' ? 'var(--success)' : 'var(--secondary)'
                                                }}>
                                                    {item.type}
                                                </div>

                                                {item.type === 'appointment' && (
                                                    <div>
                                                        <div><strong>Dr. {item.data.doctorId?.name}</strong></div>
                                                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                                            Status: {item.data.status} | Reason: {item.data.reason || 'Not specified'}
                                                        </div>
                                                    </div>
                                                )}

                                                {item.type === 'prescription' && (
                                                    <div>
                                                        <div><strong>Dr. {item.data.doctorId?.name}</strong></div>
                                                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px' }}>
                                                            {item.data.medicines?.length || 0} medicines prescribed
                                                        </div>
                                                        <button
                                                            className="btn btn-sm btn-secondary"
                                                            onClick={() => window.open(`/api/prescriptions/${item.data._id}/pdf`, '_blank')}
                                                        >
                                                            <FiDownload /> Download PDF
                                                        </button>
                                                    </div>
                                                )}

                                                {item.type === 'diagnosis' && (
                                                    <div>
                                                        <div><strong>AI-Assisted Assessment</strong> by Dr. {item.data.doctorId?.name}</div>
                                                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
                                                            <strong>Symptoms:</strong> {item.data.symptoms?.join(', ')}
                                                        </div>
                                                        <div style={{ marginTop: '8px' }}>
                                                            <span className={`badge badge-${item.data.riskLevel}`}>
                                                                Risk: {item.data.riskLevel}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagePatients;

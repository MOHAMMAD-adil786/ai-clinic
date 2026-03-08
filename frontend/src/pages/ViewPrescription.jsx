import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiDownload, FiArrowLeft, FiActivity } from 'react-icons/fi';
import api from '../api/axios';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const ViewPrescription = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [prescription, setPrescription] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPrescription = async () => {
            try {
                const res = await api.get(`/prescriptions/${id}`);
                setPrescription(res.data);
            } catch (error) {
                toast.error('Prescription not found');
                navigate(-1);
            } finally {
                setLoading(false);
            }
        };

        fetchPrescription();
    }, [id, navigate]);

    const handleDownloadPDF = () => {
        window.open(`/api/prescriptions/${id}/pdf`, '_blank');
    };

    if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;

    return (
        <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <button
                className="btn btn-secondary"
                style={{ marginBottom: '20px' }}
                onClick={() => navigate(-1)}
            >
                <FiArrowLeft /> Back
            </button>

            <div className="card">
                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Prescription Details</h3>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            Date: {new Date(prescription.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    <button className="btn btn-primary" onClick={handleDownloadPDF}>
                        <FiDownload /> Download PDF
                    </button>
                </div>

                <div className="card-body">
                    <div className="grid-2" style={{ marginBottom: '32px' }}>
                        <div style={{ background: 'var(--bg)', padding: '16px', borderRadius: 'var(--radius)' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', fontWeight: '600' }}>Patient Info</div>
                            <div style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--text)' }}>
                                {prescription.patientId?.name}
                            </div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                Age: {prescription.patientId?.age} • Gender: <span style={{ textTransform: 'capitalize' }}>{prescription.patientId?.gender}</span>
                            </div>
                        </div>

                        <div style={{ background: 'var(--bg)', padding: '16px', borderRadius: 'var(--radius)' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', fontWeight: '600' }}>Doctor Info</div>
                            <div style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--text)' }}>
                                Dr. {prescription.doctorId?.name}
                            </div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                {prescription.doctorId?.specialization}
                            </div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                        <h4 style={{ fontSize: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '8px', marginBottom: '16px' }}>Diagnosis</h4>
                        <div style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text)' }}>
                            {prescription.diagnosis}
                        </div>
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                        <h4 style={{ fontSize: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '8px', margin: '0 0 16px 0' }}>Medicines</h4>
                        <table className="data-table" style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                            <thead style={{ background: 'var(--bg)' }}>
                                <tr>
                                    <th style={{ padding: '12px 16px' }}>Medicine</th>
                                    <th style={{ padding: '12px 16px' }}>Dosage</th>
                                    <th style={{ padding: '12px 16px' }}>Frequency</th>
                                    <th style={{ padding: '12px 16px' }}>Duration</th>
                                </tr>
                            </thead>
                            <tbody>
                                {prescription.medicines.map((med, index) => (
                                    <tr key={index}>
                                        <td style={{ padding: '12px 16px', fontWeight: '600' }}>{med.name}</td>
                                        <td style={{ padding: '12px 16px' }}>{med.dosage}</td>
                                        <td style={{ padding: '12px 16px' }}>{med.frequency}</td>
                                        <td style={{ padding: '12px 16px' }}>{med.duration}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {prescription.instructions && (
                        <div style={{ marginBottom: '32px' }}>
                            <h4 style={{ fontSize: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '8px', marginBottom: '16px' }}>Instructions / Advice</h4>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                                {prescription.instructions}
                            </p>
                        </div>
                    )}

                    {prescription.aiExplanation && (
                        <div className="ai-result">
                            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-dark)', fontSize: '1.05rem', marginBottom: '12px' }}>
                                <FiActivity /> AI Explanation
                            </h4>
                            <p style={{ fontSize: '0.95rem', color: '#334155', lineHeight: '1.6' }}>
                                {prescription.aiExplanation}
                            </p>
                        </div>
                    )}

                    {!prescription.aiExplanation && user.role === 'patient' && (
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontStyle: 'italic', marginTop: '24px' }}>
                            *AI explanation is currently being generated for this prescription. Refresh the page in a few moments.
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default ViewPrescription;

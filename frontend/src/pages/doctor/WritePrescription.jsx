import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { FiPlus, FiTrash2, FiFileText } from 'react-icons/fi';

const WritePrescription = () => {
    const { patientId, appointmentId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Initialize diagnosis from AddDiagnosis state if passed
    const [diagnosis, setDiagnosis] = useState(location.state?.diagnosis || '');
    const [instructions, setInstructions] = useState('');

    const [medicines, setMedicines] = useState([
        { name: '', dosage: '', frequency: '1-0-1 (Twice daily)', duration: '5 days' }
    ]);

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const res = await api.get(`/patients/${patientId}`);
                setPatient(res.data);
            } catch (error) {
                toast.error('Failed to load patient');
                navigate('/patients');
            } finally {
                setLoading(false);
            }
        };
        fetchPatient();
    }, [patientId, navigate]);

    const addMedicineRow = () => {
        setMedicines([...medicines, { name: '', dosage: '', frequency: '1-0-1 (Twice daily)', duration: '5 days' }]);
    };

    const removeMedicineRow = (index) => {
        if (medicines.length > 1) {
            const updated = [...medicines];
            updated.splice(index, 1);
            setMedicines(updated);
        }
    };

    const handleMedChange = (index, field, value) => {
        const updated = [...medicines];
        updated[index][field] = value;
        setMedicines(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate
        if (medicines.some(m => !m.name || !m.dosage || !m.frequency || !m.duration)) {
            toast.error('Please fill all medicine fields');
            return;
        }

        if (!diagnosis.trim()) {
            toast.error('Please enter a diagnosis');
            return;
        }

        setSaving(true);
        try {
            // 1. Save prescription
            const data = {
                patientId,
                diagnosis,
                instructions,
                medicines,
                ...(appointmentId && { appointmentId })
            };

            const res = await api.post('/prescriptions', data);
            const prescriptionId = res.data._id;

            // 2. Generate AI Explanation in background (non-blocking)
            api.post('/ai/explain-prescription', { prescriptionId })
                .then(() => console.log('AI explanation attached'))
                .catch(err => console.error('Failed to attach AI explanation', err));

            if (appointmentId) {
                // Mark appointment as completed
                await api.put(`/appointments/${appointmentId}`, { status: 'completed' });
            }

            toast.success('Prescription saved successfully');
            navigate(`/prescription/${prescriptionId}`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save prescription');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;

    return (
        <div className="fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div className="card">
                <div className="card-header">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiFileText /> Write Prescription
                    </h3>
                    <div className="badge badge-confirmed">Patient: {patient?.name}</div>
                </div>

                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group" style={{ marginBottom: '24px' }}>
                            <label className="form-label" style={{ fontSize: '0.95rem' }}>Final Diagnosis *</label>
                            <input
                                type="text"
                                className="form-input"
                                value={diagnosis}
                                onChange={(e) => setDiagnosis(e.target.value)}
                                placeholder="e.g., Acute Viral Pharyngitis"
                                required
                                style={{ fontSize: '1.05rem', padding: '12px 16px', borderColor: 'var(--primary)', boxShadow: '0 0 0 3px rgba(14, 165, 233, 0.1)' }}
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text)' }}>Medicines *</h4>
                            <button type="button" className="btn btn-sm btn-secondary" onClick={addMedicineRow}>
                                <FiPlus /> Add Medicine
                            </button>
                        </div>

                        <div style={{ background: 'var(--bg)', padding: '16px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', marginBottom: '24px' }}>
                            <div className="medicine-row-grid medicine-grid-labels" style={{ marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' }}>
                                <div>Medicine Name</div>
                                <div>Dosage</div>
                                <div>Frequency</div>
                                <div>Duration</div>
                                <div></div>
                            </div>

                            {medicines.map((med, index) => (
                                <div key={index} className="medicine-row-grid" style={{ marginBottom: '12px' }}>
                                    <div className="form-group" style={{ margin: 0 }}>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={med.name}
                                            onChange={e => handleMedChange(index, 'name', e.target.value)}
                                            placeholder="Medicine"
                                            required
                                        />
                                    </div>
                                    <div className="form-group" style={{ margin: 0 }}>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={med.dosage}
                                            onChange={e => handleMedChange(index, 'dosage', e.target.value)}
                                            placeholder="Dosage"
                                            required
                                        />
                                    </div>
                                    <div className="form-group" style={{ margin: 0 }}>
                                        <select
                                            className="form-input"
                                            value={med.frequency}
                                            onChange={e => handleMedChange(index, 'frequency', e.target.value)}
                                        >
                                            <option value="1-0-1 (Twice daily)">1-0-1 (Twice daily)</option>
                                            <option value="1-1-1 (Thrice daily)">1-1-1 (Thrice daily)</option>
                                            <option value="1-0-0 (Morning)">1-0-0 (Morning)</option>
                                            <option value="0-0-1 (Night)">0-0-1 (Night)</option>
                                            <option value="SOS (When needed)">SOS (When needed)</option>
                                            <option value="STAT (Immediately)">STAT (Immediately)</option>
                                        </select>
                                    </div>
                                    <div className="form-group" style={{ margin: 0 }}>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={med.duration}
                                            onChange={e => handleMedChange(index, 'duration', e.target.value)}
                                            placeholder="Duration"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        className="btn-icon"
                                        style={{ color: 'var(--danger)' }}
                                        onClick={() => removeMedicineRow(index)}
                                        disabled={medicines.length === 1}
                                    >
                                        <FiTrash2 />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="form-group">
                            <label className="form-label">General Instructions / Advice</label>
                            <textarea
                                className="form-input"
                                value={instructions}
                                onChange={(e) => setInstructions(e.target.value)}
                                placeholder="e.g., Drink plenty of water, rest for 3 days..."
                                style={{ height: '80px' }}
                            />
                        </div>

                        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '16px', borderRadius: 'var(--radius-sm)', marginBottom: '24px', fontSize: '0.85rem', color: '#166534' }}>
                            <strong>AI Magic ✨:</strong> Once saved, our AI will automatically generate a simple, patient-friendly explanation of this prescription and attach it to the PDF.
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={saving}>
                                {saving ? 'Saving...' : 'Save & Generate PDF'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default WritePrescription;

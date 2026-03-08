import { useState, useEffect } from 'react';
import { FiActivity, FiSearch, FiUser, FiInfo } from 'react-icons/fi';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';

const AITool = () => {
    const [patients, setPatients] = useState([]);
    const [selectedPatientId, setSelectedPatientId] = useState('');
    const [symptoms, setSymptoms] = useState('');
    const [medicalHistory, setMedicalHistory] = useState('');
    const [loading, setLoading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(null);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await api.get('/patients');
                setPatients(res.data);
            } catch (error) {
                toast.error('Failed to load patients for selection');
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, []);

    const handleAnalysis = async (e) => {
        e.preventDefault();
        if (!symptoms.trim()) return toast.error('Please enter symptoms');

        setAnalyzing(true);
        setResult(null);

        try {
            const symptomArray = symptoms.split(',').map(s => s.trim()).filter(s => s !== '');

            // If a patient is selected, we get more accurate results
            const selectedPatient = patients.find(p => p._id === selectedPatientId);

            const response = await api.post('/ai/symptom-check', {
                patientId: selectedPatientId || null,
                symptoms: symptomArray,
                age: selectedPatient?.age || 30, // Default if no patient
                gender: selectedPatient?.gender || 'not specified',
                history: medicalHistory || selectedPatient?.allergies || 'None'
            });

            setResult(response.data);
            toast.success('AI Analysis complete');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to get AI diagnosis');
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="fade-in">
            <div className="card" style={{ marginBottom: '24px', background: 'linear-gradient(135deg, var(--primary), var(--accent))', color: 'white' }}>
                <div className="card-body">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '15px' }}>
                            <FiActivity size={32} />
                        </div>
                        <div>
                            <h2 style={{ margin: 0 }}>PulseAI Diagnostic Tool</h2>
                            <p style={{ opacity: 0.9, marginBottom: 0 }}>Advanced clinical assistant for healthcare professionals.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid-2">
                <div className="card">
                    <div className="card-header">
                        <h3>Input Clinical Data</h3>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleAnalysis}>
                            <div className="form-group">
                                <label className="form-label">Search/Select Patient (Optional)</label>
                                <select
                                    className="form-input"
                                    value={selectedPatientId}
                                    onChange={(e) => setSelectedPatientId(e.target.value)}
                                >
                                    <option value="">-- General Diagnostic (No Patient) --</option>
                                    {patients.map(p => (
                                        <option key={p._id} value={p._id}>{p.name} ({p.contact})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Symptoms (Comma separated)</label>
                                <textarea
                                    className="form-input"
                                    rows="4"
                                    placeholder="e.g. Sharp chest pain, cough, shortness of breath..."
                                    value={symptoms}
                                    onChange={(e) => setSymptoms(e.target.value)}
                                ></textarea>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Clinical Notes / History</label>
                                <textarea
                                    className="form-input"
                                    rows="3"
                                    placeholder="Relevant family history or previous conditions..."
                                    value={medicalHistory}
                                    onChange={(e) => setMedicalHistory(e.target.value)}
                                ></textarea>
                            </div>

                            <button type="submit" className="btn btn-primary btn-block" disabled={analyzing}>
                                {analyzing ? 'AI Processing...' : 'Run Analysis'}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="card" style={{ borderTop: '4px solid var(--secondary)' }}>
                    <div className="card-header">
                        <h3>Clinical Assessment</h3>
                    </div>
                    <div className="card-body">
                        {!result && !analyzing && (
                            <div className="empty-state">
                                <FiSearch size={48} color="#cbd5e1" />
                                <p>Provide clinical data to generate AI insights.</p>
                            </div>
                        )}

                        {analyzing && (
                            <div className="loading-spinner" style={{ minHeight: '300px' }}>
                                <div className="spinner"></div>
                                <p style={{ marginTop: '16px', color: 'var(--primary)' }}>Analyzing with Gemini AI...</p>
                            </div>
                        )}

                        {result && (
                            <div className="fade-in">
                                <div style={{
                                    padding: '16px',
                                    borderRadius: '12px',
                                    background: result.riskLevel === 'high' || result.riskLevel === 'critical' ? 'var(--danger-bg)' : 'var(--success-bg)',
                                    marginBottom: '20px'
                                }}>
                                    <LabelValue label="Risk Level" value={result.riskLevel.toUpperCase()} color={result.riskLevel === 'high' ? 'var(--danger)' : 'var(--success)'} />
                                </div>

                                <h4 style={{ fontSize: '0.9rem', marginBottom: '12px' }}>Differential Diagnoses</h4>
                                {result.possibleConditions?.map((item, idx) => (
                                    <div key={idx} style={{
                                        padding: '12px',
                                        background: 'var(--bg)',
                                        borderRadius: '8px',
                                        marginBottom: '8px',
                                        display: 'flex',
                                        justifyContent: 'space-between'
                                    }}>
                                        <span style={{ fontWeight: '600' }}>{item.condition}</span>
                                        <span className="badge badge-info">{item.probability}</span>
                                    </div>
                                ))}

                                <h4 style={{ fontSize: '0.9rem', marginTop: '20px', marginBottom: '12px' }}>Recommended Investigations</h4>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {result.suggestedTests?.map((test, idx) => (
                                        <span key={idx} className="badge badge-medium">{test}</span>
                                    ))}
                                </div>

                                {result.recommendations && (
                                    <div style={{ marginTop: '20px', padding: '12px', background: '#f8fafc', borderLeft: '3px solid var(--secondary)', fontSize: '0.85rem' }}>
                                        <strong>Clinical Notes:</strong> {result.recommendations}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const LabelValue = ({ label, value, color }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#64748b' }}>{label}</span>
        <span style={{ fontWeight: '700', color: color || 'inherit' }}>{value}</span>
    </div>
);

export default AITool;

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { FiActivity, FiAlertCircle, FiCheck, FiPlus, FiX } from 'react-icons/fi';

const AddDiagnosis = () => {
    const { patientId } = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);

    const [symptomInput, setSymptomInput] = useState('');
    const [symptoms, setSymptoms] = useState([]);
    const [medicalHistory, setMedicalHistory] = useState('');

    const [analyzing, setAnalyzing] = useState(false);
    const [aiResult, setAiResult] = useState(null);

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const res = await api.get(`/patients/${patientId}`);
                setPatient(res.data);
            } catch (error) {
                toast.error('Failed to load patient data');
                navigate('/patients');
            } finally {
                setLoading(false);
            }
        };
        fetchPatient();
    }, [patientId, navigate]);

    const addSymptom = () => {
        if (symptomInput.trim() && !symptoms.includes(symptomInput.trim())) {
            setSymptoms([...symptoms, symptomInput.trim()]);
            setSymptomInput('');
        }
    };

    const removeSymptom = (sym) => {
        setSymptoms(symptoms.filter(s => s !== sym));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSymptom();
        }
    };

    const runAiAnalysis = async () => {
        if (symptoms.length === 0) {
            toast.error('Please add at least one symptom');
            return;
        }

        setAnalyzing(true);
        setAiResult(null);

        try {
            const res = await api.post('/ai/symptom-check', {
                patientId,
                symptoms,
                age: patient.age,
                gender: patient.gender,
                history: medicalHistory || patient.allergies || 'None recorded'
            });

            setAiResult(res.data);
            if (res.data.fallback) {
                toast.error('Free tier AI limitation. Showing fallback results.');
            } else {
                toast.success('AI Analysis complete');
            }
        } catch (error) {
            if (error.response?.status === 403) {
                toast.error('AI Features require a Pro subscription plan');
            } else {
                toast.error('Failed to run AI analysis');
            }
        } finally {
            setAnalyzing(false);
        }
    };

    const proceedToPrescription = () => {
        // Pass the top AI condition as the preliminary diagnosis string
        const topCondition = aiResult?.possibleConditions?.[0]?.condition || '';
        navigate(`/doctor/write-prescription/${patientId}`, { state: { diagnosis: topCondition } });
    };

    if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;

    return (
        <div className="fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div className="card" style={{ marginBottom: '24px' }}>
                <div className="card-body" style={{ background: 'var(--primary-bg)', borderLeft: '4px solid var(--primary)', borderRadius: 'var(--radius)' }}>
                    <h3 style={{ margin: 0, color: 'var(--primary-dark)' }}>Patient: {patient?.name}</h3>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
                        Age: {patient?.age} | Gender: {patient?.gender} {patient?.allergies ? `| Allergies: ${patient.allergies}` : ''}
                    </div>
                </div>
            </div>

            <div className="grid-2">
                <div className="card">
                    <div className="card-header">
                        <h3><FiActivity style={{ marginRight: '8px' }} /> Smart Symptom Checker</h3>
                    </div>
                    <div className="card-body">
                        <div className="form-group">
                            <label className="form-label">Symptoms *</label>
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={symptomInput}
                                    onChange={(e) => setSymptomInput(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    placeholder="e.g., headache, fever, cough..."
                                />
                                <button type="button" className="btn btn-secondary" onClick={addSymptom}>
                                    <FiPlus /> Add
                                </button>
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {symptoms.map((sym, i) => (
                                    <div key={i} style={{
                                        background: '#e0f2fe', color: '#0369a1', padding: '4px 12px',
                                        borderRadius: '20px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px'
                                    }}>
                                        {sym}
                                        <FiX style={{ cursor: 'pointer' }} onClick={() => removeSymptom(sym)} />
                                    </div>
                                ))}
                                {symptoms.length === 0 && (
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontStyle: 'italic' }}>
                                        No symptoms added yet.
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Additional Medical Notes / History</label>
                            <textarea
                                className="form-input"
                                value={medicalHistory}
                                onChange={(e) => setMedicalHistory(e.target.value)}
                                placeholder="Any recent events, family history, etc."
                                style={{ height: '80px' }}
                            />
                        </div>

                        <button
                            className="btn btn-primary"
                            style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '16px' }}
                            onClick={runAiAnalysis}
                            disabled={analyzing || symptoms.length === 0}
                        >
                            <FiActivity />
                            {analyzing ? 'Analyzing Symptoms (Gemini AI)...' : 'Run Smart AI Analysis'}
                        </button>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <h3>AI Assessment Results</h3>
                    </div>
                    <div className="card-body" style={{ minHeight: '300px' }}>
                        {analyzing ? (
                            <div className="loading-spinner" style={{ height: '100%', flexDirection: 'column' }}>
                                <div className="spinner" style={{ marginBottom: '16px' }}></div>
                                <div style={{ color: 'var(--text-secondary)' }}>Gemini AI is analyzing patient data...</div>
                            </div>
                        ) : !aiResult ? (
                            <div className="empty-state">
                                <FiActivity className="empty-icon" />
                                <p>Input symptoms and run analysis to see AI recommendations here.</p>
                            </div>
                        ) : (
                            <div className="fade-in">
                                <div style={{
                                    padding: '16px', borderRadius: 'var(--radius)', marginBottom: '20px',
                                    background: aiResult.riskLevel === 'high' || aiResult.riskLevel === 'critical' ? 'var(--danger-bg)' :
                                        aiResult.riskLevel === 'medium' ? 'var(--warning-bg)' : 'var(--success-bg)'
                                }}>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700',
                                        color: aiResult.riskLevel === 'high' || aiResult.riskLevel === 'critical' ? 'var(--danger)' :
                                            aiResult.riskLevel === 'medium' ? 'var(--warning)' : 'var(--success)'
                                    }}>
                                        <FiAlertCircle />
                                        Risk Level: <span style={{ textTransform: 'capitalize' }}>{aiResult.riskLevel}</span>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <h4 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '12px' }}>Possible Conditions:</h4>
                                    {aiResult.possibleConditions?.map((cond, i) => (
                                        <div key={i} style={{
                                            padding: '12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                                            marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                        }}>
                                            <div style={{ fontWeight: '500' }}>{cond.condition}</div>
                                            <div className={`badge badge-${cond.probability?.toLowerCase() === 'high' ? 'high' : cond.probability?.toLowerCase() === 'medium' ? 'medium' : 'low'}`}>
                                                {cond.probability} Probability
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {aiResult.suggestedTests?.length > 0 && (
                                    <div style={{ marginBottom: '20px' }}>
                                        <h4 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '8px' }}>Suggested Tests:</h4>
                                        <ul style={{ paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                            {aiResult.suggestedTests.map((test, i) => <li key={i} style={{ marginBottom: '4px' }}>{test}</li>)}
                                        </ul>
                                    </div>
                                )}

                                {aiResult.recommendations && (
                                    <div style={{
                                        padding: '12px', background: '#f8fafc', borderLeft: '3px solid var(--secondary)',
                                        fontSize: '0.85rem', color: '#475569', marginBottom: '24px'
                                    }}>
                                        <strong>AI Notes:</strong> {aiResult.recommendations}
                                    </div>
                                )}

                                <button
                                    className="btn btn-success"
                                    style={{ width: '100%', justifyContent: 'center' }}
                                    onClick={proceedToPrescription}
                                >
                                    <FiCheck /> Proceed to Prescription
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddDiagnosis;

import { useState } from 'react';
import { FiActivity, FiSearch, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';

const PatientAIDiagnosis = () => {
    const [symptoms, setSymptoms] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!symptoms.trim()) {
            return toast.error('Please enter your symptoms');
        }

        setLoading(true);
        setResult(null);

        try {
            // Transform comma separated string to array
            const symptomArray = symptoms.split(',').map(s => s.trim()).filter(s => s !== '');

            const response = await api.post('/ai/patient-symptom-check', {
                symptoms: symptomArray
            });

            setResult(response.data);
            toast.success('AI Analysis complete');
        } catch (error) {
            console.error('AI Error:', error);
            toast.error(error.response?.data?.message || 'Failed to get AI diagnosis');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fade-in">
            <div className="ai-card" style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <FiActivity size={24} color="var(--primary)" />
                    <h2 style={{ margin: 0 }}>Smart AI Diagnosis</h2>
                </div>
                <p>Describe how you're feeling, and our AI will provide a preliminary analysis of potential conditions and recommendations.</p>
                <div className="badge badge-pro">Powered by Gemini AI</div>
            </div>

            <div className="grid-2">
                <div className="card">
                    <div className="card-header">
                        <h3>Describe Symptoms</h3>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Enter Symptoms (separated by commas)</label>
                                <textarea
                                    className="form-control"
                                    rows="5"
                                    placeholder="e.g. Headache, fever, fatigue, sore throat"
                                    value={symptoms}
                                    onChange={(e) => setSymptoms(e.target.value)}
                                    disabled={loading}
                                ></textarea>
                                <small style={{ color: 'var(--text-light)', marginTop: '8px', display: 'block' }}>
                                    Be as specific as possible for better results.
                                </small>
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary btn-block"
                                disabled={loading}
                                style={{ marginTop: '16px' }}
                            >
                                {loading ? 'Analyzing...' : 'Start AI Analysis'}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <h3>AI Analysis Result</h3>
                    </div>
                    <div className="card-body">
                        {!result && !loading && (
                            <div className="empty-state">
                                <div className="empty-icon"><FiSearch /></div>
                                <h3>Waiting for input</h3>
                                <p>Enter your symptoms and click "Start AI Analysis" to see results here.</p>
                            </div>
                        )}

                        {loading && (
                            <div className="loading-spinner" style={{ minHeight: '200px' }}>
                                <div className="spinner"></div>
                                <p style={{ marginTop: '16px', color: 'var(--primary)', fontWeight: '600' }}>AI is thinking...</p>
                            </div>
                        )}

                        {result && (
                            <div className="fade-in">
                                <div style={{
                                    padding: '16px',
                                    background: result.riskLevel === 'high' || result.riskLevel === 'critical' ? '#fee2e2' : '#f0fdf4',
                                    borderRadius: 'var(--radius)',
                                    marginBottom: '20px',
                                    border: `1px solid ${result.riskLevel === 'high' || result.riskLevel === 'critical' ? '#fecaca' : '#bbf7d0'}`
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                        {result.riskLevel === 'high' || result.riskLevel === 'critical' ?
                                            <FiAlertCircle color="#dc2626" /> : <FiCheckCircle color="#16a34a" />
                                        }
                                        <h4 style={{ margin: 0, textTransform: 'capitalize' }}>Risk Level: {result.riskLevel}</h4>
                                    </div>
                                </div>

                                <h4 style={{ marginBottom: '12px' }}>Possible Conditions:</h4>
                                <ul style={{ padding: 0, listStyle: 'none', marginBottom: '24px' }}>
                                    {result.possibleConditions?.map((item, idx) => (
                                        <li key={idx} style={{
                                            padding: '12px',
                                            background: 'var(--primary-bg)',
                                            borderRadius: '8px',
                                            marginBottom: '8px',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <span style={{ fontWeight: '600' }}>{item.condition}</span>
                                            <span className="badge badge-info">{item.probability}</span>
                                        </li>
                                    ))}
                                </ul>

                                <h4 style={{ marginBottom: '12px' }}>Recommended Tests:</h4>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                                    {result.suggestedTests?.map((test, idx) => (
                                        <span key={idx} className="badge" style={{ background: '#e0f2fe', color: '#0369a1' }}>
                                            {test}
                                        </span>
                                    ))}
                                </div>

                                <div style={{
                                    padding: '16px',
                                    background: '#fffbeb',
                                    borderRadius: 'var(--radius)',
                                    border: '1px solid #fef3c7',
                                    fontSize: '0.85rem',
                                    color: '#92400e'
                                }}>
                                    <strong>Disclaimer:</strong> This AI diagnosis is for information purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Please consult a qualified doctor for any medical concerns.
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientAIDiagnosis;

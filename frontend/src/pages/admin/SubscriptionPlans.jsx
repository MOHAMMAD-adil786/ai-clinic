import { FiSettings, FiCheck } from 'react-icons/fi';

const SubscriptionPlans = () => {
    return (
        <div className="fade-in card">
            <div className="card-header">
                <h3><FiSettings style={{ marginRight: '8px' }} /> SaaS Subscription Plans</h3>
            </div>
            <div className="card-body">

                <div className="grid-2" style={{ marginTop: '20px' }}>

                    <div className="card" style={{ border: '1px solid var(--border)' }}>
                        <div className="card-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '15px' }}>
                            <h3 style={{ margin: 0 }}>Basic Plan</h3>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Free</div>
                        </div>
                        <div className="card-body">
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                <li style={{ padding: '8px 0', borderBottom: '1px solid var(--background)' }}><FiCheck color="var(--success)" style={{ marginRight: '10px' }} /> Unlimited Patients</li>
                                <li style={{ padding: '8px 0', borderBottom: '1px solid var(--background)' }}><FiCheck color="var(--success)" style={{ marginRight: '10px' }} /> Unlimited Appointments</li>
                                <li style={{ padding: '8px 0', borderBottom: '1px solid var(--background)' }}><FiCheck color="var(--success)" style={{ marginRight: '10px' }} /> PDF Prescriptions</li>
                                <li style={{ padding: '8px 0', color: 'var(--text-light)' }}>- No AI Symptom Checker</li>
                                <li style={{ padding: '8px 0', color: 'var(--text-light)' }}>- No AI Explanations</li>
                                <li style={{ padding: '8px 0', color: 'var(--text-light)' }}>- No Predictive Analytics</li>
                            </ul>
                            <button className="btn" style={{ width: '100%', marginTop: '20px' }}>Downgrade to Free</button>
                        </div>
                    </div>

                    <div className="card" style={{ border: '2px solid var(--primary)', backgroundColor: 'var(--background)' }}>
                        <div className="card-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '15px' }}>
                            <h3 style={{ margin: 0, color: 'var(--primary)' }}>Pro Plan (Active)</h3>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>$49<span style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>/month</span></div>
                        </div>
                        <div className="card-body">
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                <li style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}><FiCheck color="var(--success)" style={{ marginRight: '10px' }} /> Everything in Basic</li>
                                <li style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}><FiCheck color="var(--primary)" style={{ marginRight: '10px' }} /> Smart AI Symptom Checker</li>
                                <li style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}><FiCheck color="var(--primary)" style={{ marginRight: '10px' }} /> Gemini-Powered Prescription Explanations</li>
                                <li style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}><FiCheck color="var(--primary)" style={{ marginRight: '10px' }} /> Automated Risk Flagging System</li>
                                <li style={{ padding: '8px 0' }}><FiCheck color="var(--primary)" style={{ marginRight: '10px' }} /> Advanced Predictive Analytics</li>
                            </ul>
                            <button className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }}>Current Plan</button>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default SubscriptionPlans;

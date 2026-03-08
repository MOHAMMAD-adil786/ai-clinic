import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { FiUserPlus } from 'react-icons/fi';

const RegisterPatient = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: 'male',
        contact: '',
        email: '',
        address: '',
        bloodGroup: '',
        allergies: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await api.post('/patients', formData);
            toast.success('Patient registered successfully!');
            navigate('/patients');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to register patient');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="card">
                <div className="card-header">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiUserPlus /> Register New Patient
                    </h3>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Full Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-input"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Age *</label>
                                <input
                                    type="number"
                                    name="age"
                                    className="form-input"
                                    value={formData.age}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Gender *</label>
                                <select
                                    name="gender"
                                    className="form-input"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Contact Number *</label>
                                <input
                                    type="text"
                                    name="contact"
                                    className="form-input"
                                    value={formData.contact}
                                    onChange={handleChange}
                                    placeholder="03XX-XXXXXXX"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Email (Optional)</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-input"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Blood Group</label>
                                <select
                                    name="bloodGroup"
                                    className="form-input"
                                    value={formData.bloodGroup}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Protocol</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Home Address</label>
                            <input
                                type="text"
                                name="address"
                                className="form-input"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Known Allergies (if any)</label>
                            <textarea
                                name="allergies"
                                className="form-input"
                                value={formData.allergies}
                                onChange={handleChange}
                                placeholder="List any drug or food allergies..."
                            ></textarea>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Saving...' : 'Register Patient'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPatient;

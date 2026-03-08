import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { FiCalendar } from 'react-icons/fi';

const BookAppointment = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);

    const [formData, setFormData] = useState({
        patientId: '',
        doctorId: '',
        date: '',
        time: '09:00',
        reason: '',
        notes: ''
    });

    useEffect(() => {
        const fetchSelectData = async () => {
            try {
                const [patientsRes, doctorsRes] = await Promise.all([
                    api.get('/patients'),
                    api.get('/users/doctors')
                ]);
                setPatients(patientsRes.data);
                setDoctors(doctorsRes.data);
            } catch (error) {
                toast.error('Failed to load form data');
            }
        };
        fetchSelectData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('/appointments', formData);
            toast.success('Appointment booked successfully!');
            navigate('/appointments');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to book appointment');
        } finally {
            setLoading(false);
        }
    };

    // Helper to generate time slots
    const generateTimeSlots = () => {
        const slots = [];
        for (let i = 9; i <= 17; i++) {
            slots.push(`${i.toString().padStart(2, '0')}:00`);
            slots.push(`${i.toString().padStart(2, '0')}:30`);
        }
        return slots;
    };

    return (
        <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="card">
                <div className="card-header">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiCalendar /> Book Appointment
                    </h3>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Select Patient *</label>
                            <select
                                name="patientId"
                                className="form-input"
                                value={formData.patientId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">-- Choose a patient --</option>
                                {patients.map(p => (
                                    <option key={p._id} value={p._id}>{p.name} ({p.contact})</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Select Doctor *</label>
                                <select
                                    name="doctorId"
                                    className="form-input"
                                    value={formData.doctorId}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">-- Choose a doctor --</option>
                                    {doctors.map(d => (
                                        <option key={d._id} value={d._id}>Dr. {d.name} ({d.specialization})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Date *</label>
                                <input
                                    type="date"
                                    name="date"
                                    className="form-input"
                                    value={formData.date}
                                    onChange={handleChange}
                                    min={new Date().toISOString().split('T')[0]}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Time Slot *</label>
                                <select
                                    name="time"
                                    className="form-input"
                                    value={formData.time}
                                    onChange={handleChange}
                                    required
                                >
                                    {generateTimeSlots().map(time => (
                                        <option key={time} value={time}>{time}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Reason for Visit *</label>
                            <input
                                type="text"
                                name="reason"
                                className="form-input"
                                value={formData.reason}
                                onChange={handleChange}
                                placeholder="e.g., General checkup, Fever, Follow-up"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Additional Notes</label>
                            <textarea
                                name="notes"
                                className="form-input"
                                value={formData.notes}
                                onChange={handleChange}
                                placeholder="Any specific requests or information..."
                            ></textarea>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Booking...' : 'Book Appointment'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BookAppointment;

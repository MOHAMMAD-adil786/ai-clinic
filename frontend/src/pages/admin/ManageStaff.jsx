import { useState, useEffect } from 'react';
import { FiUsers, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';

const ManageStaff = () => {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app this would call /api/users to get doctors/receptionists
        // For now we simulate with empty array if endpoint not ready
        setLoading(false);
    }, []);

    return (
        <div className="fade-in card">
            <div className="card-header">
                <h3><FiUsers style={{ marginRight: '8px' }} /> Manage Clinic Staff</h3>
                <button className="btn btn-primary"><FiPlus /> Add Staff Member</button>
            </div>
            <div className="card-body">
                <div className="empty-state">
                    <div className="empty-icon"><FiUsers /></div>
                    <h3>Staff Directory</h3>
                    <p>Staff management module is ready to be connected to the backend API.</p>
                </div>
            </div>
        </div>
    );
};

export default ManageStaff;

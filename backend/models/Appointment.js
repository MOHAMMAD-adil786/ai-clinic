const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: [true, 'Appointment date is required']
    },
    time: {
        type: String,
        required: [true, 'Appointment time is required']
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    reason: {
        type: String,
        trim: true
    },
    notes: {
        type: String,
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);

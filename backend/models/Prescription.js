const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
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
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    },
    medicines: [{
        name: { type: String, required: true },
        dosage: { type: String, required: true },
        frequency: { type: String, required: true },
        duration: { type: String, required: true }
    }],
    instructions: {
        type: String,
        trim: true
    },
    diagnosis: {
        type: String,
        trim: true
    },
    aiExplanation: {
        type: String,
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Prescription', prescriptionSchema);

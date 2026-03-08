const mongoose = require('mongoose');

const diagnosisLogSchema = new mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    symptoms: [{
        type: String,
        required: true
    }],
    age: {
        type: Number
    },
    gender: {
        type: String
    },
    history: {
        type: String
    },
    aiResponse: {
        type: String
    },
    possibleConditions: [{
        condition: String,
        probability: String
    }],
    riskLevel: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'low'
    },
    suggestedTests: [{
        type: String
    }]
}, { timestamps: true });

module.exports = mongoose.model('DiagnosisLog', diagnosisLogSchema);

const express = require('express');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const DiagnosisLog = require('../models/DiagnosisLog');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all patients
router.get('/', protect, authorize('admin', 'doctor', 'receptionist'), async (req, res) => {
    try {
        const patients = await Patient.find().populate('createdBy', 'name').sort('-createdAt');
        res.json(patients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single patient
router.get('/:id', protect, async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id).populate('createdBy', 'name');
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.json(patient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get patient medical history timeline
router.get('/:id/history', protect, authorize('admin', 'doctor', 'receptionist'), async (req, res) => {
    try {
        const patientId = req.params.id;

        const [appointments, prescriptions, diagnosisLogs] = await Promise.all([
            Appointment.find({ patientId }).populate('doctorId', 'name specialization').sort('-date'),
            Prescription.find({ patientId }).populate('doctorId', 'name').sort('-createdAt'),
            DiagnosisLog.find({ patientId }).populate('doctorId', 'name').sort('-createdAt')
        ]);

        const timeline = [];

        appointments.forEach(apt => {
            timeline.push({
                type: 'appointment',
                date: apt.date,
                data: apt,
                timestamp: apt.createdAt
            });
        });

        prescriptions.forEach(pres => {
            timeline.push({
                type: 'prescription',
                date: pres.createdAt,
                data: pres,
                timestamp: pres.createdAt
            });
        });

        diagnosisLogs.forEach(diag => {
            timeline.push({
                type: 'diagnosis',
                date: diag.createdAt,
                data: diag,
                timestamp: diag.createdAt
            });
        });

        timeline.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        res.json(timeline);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create patient
router.post('/', protect, authorize('admin', 'doctor', 'receptionist'), async (req, res) => {
    try {
        const patient = await Patient.create({
            ...req.body,
            createdBy: req.user._id
        });
        res.status(201).json(patient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update patient
router.put('/:id', protect, authorize('admin', 'doctor', 'receptionist'), async (req, res) => {
    try {
        const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.json(patient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete patient
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.json({ message: 'Patient removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

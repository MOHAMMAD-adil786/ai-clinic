const express = require('express');
const Prescription = require('../models/Prescription');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all prescriptions
router.get('/', protect, async (req, res) => {
    try {
        let filter = {};
        if (req.user.role === 'doctor') filter.doctorId = req.user._id;
        if (req.query.patientId) filter.patientId = req.query.patientId;

        const prescriptions = await Prescription.find(filter)
            .populate('patientId', 'name age gender')
            .populate('doctorId', 'name specialization')
            .sort('-createdAt');
        res.json(prescriptions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get patient's own prescriptions
router.get('/my-prescriptions', protect, authorize('patient'), async (req, res) => {
    try {
        const Patient = require('../models/Patient');
        const patient = await Patient.findOne({ email: req.user.email });
        if (!patient) return res.json([]);

        const prescriptions = await Prescription.find({ patientId: patient._id })
            .populate('doctorId', 'name specialization')
            .sort('-createdAt');
        res.json(prescriptions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single prescription
router.get('/:id', protect, async (req, res) => {
    try {
        const prescription = await Prescription.findById(req.params.id)
            .populate('patientId', 'name age gender contact')
            .populate('doctorId', 'name specialization phone');
        if (!prescription) {
            return res.status(404).json({ message: 'Prescription not found' });
        }
        res.json(prescription);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create prescription
router.post('/', protect, authorize('doctor'), async (req, res) => {
    try {
        const prescription = await Prescription.create({
            ...req.body,
            doctorId: req.user._id
        });
        const populated = await prescription.populate([
            { path: 'patientId', select: 'name age gender' },
            { path: 'doctorId', select: 'name specialization' }
        ]);
        res.status(201).json(populated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Download prescription PDF
router.get('/:id/pdf', protect, async (req, res) => {
    try {
        const prescription = await Prescription.findById(req.params.id)
            .populate('patientId', 'name age gender contact')
            .populate('doctorId', 'name specialization phone');

        if (!prescription) {
            return res.status(404).json({ message: 'Prescription not found' });
        }

        const { generatePrescriptionPDF } = require('../services/pdfService');
        const pdfBuffer = await generatePrescriptionPDF(prescription);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=prescription-${prescription._id}.pdf`);
        res.send(pdfBuffer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

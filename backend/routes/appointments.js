const express = require('express');
const Appointment = require('../models/Appointment');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all appointments
router.get('/', protect, async (req, res) => {
    try {
        let filter = {};

        if (req.user.role === 'doctor') {
            filter.doctorId = req.user._id;
        }

        if (req.query.status) filter.status = req.query.status;
        if (req.query.date) {
            // date comes as YYYY-MM-DD from frontend
            const dateStr = req.query.date;
            const startOfDay = new Date(`${dateStr}T00:00:00.000Z`);
            const endOfDay = new Date(`${dateStr}T23:59:59.999Z`);
            filter.date = { $gte: startOfDay, $lte: endOfDay };
        }
        if (req.query.doctorId) filter.doctorId = req.query.doctorId;

        const appointments = await Appointment.find(filter)
            .populate('patientId', 'name age gender contact')
            .populate('doctorId', 'name specialization')
            .sort('-date');

        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get appointments for a patient (patient can see own)
router.get('/my-appointments', protect, authorize('patient'), async (req, res) => {
    try {
        const Patient = require('../models/Patient');
        const patient = await Patient.findOne({ email: req.user.email });
        if (!patient) {
            return res.json([]);
        }
        const appointments = await Appointment.find({ patientId: patient._id })
            .populate('doctorId', 'name specialization')
            .sort('-date');
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create appointment
router.post('/', protect, authorize('admin', 'doctor', 'receptionist'), async (req, res) => {
    try {
        const appointment = await Appointment.create(req.body);
        const populated = await appointment.populate([
            { path: 'patientId', select: 'name age gender contact' },
            { path: 'doctorId', select: 'name specialization' }
        ]);
        res.status(201).json(populated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update appointment status
router.put('/:id', protect, async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id, req.body, { new: true, runValidators: true }
        ).populate([
            { path: 'patientId', select: 'name age gender contact' },
            { path: 'doctorId', select: 'name specialization' }
        ]);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete/Cancel appointment
router.delete('/:id', protect, async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndDelete(req.params.id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.json({ message: 'Appointment cancelled' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

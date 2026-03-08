const express = require('express');
const { protect, authorize, checkSubscription } = require('../middleware/auth');
const { symptomCheck, explainPrescription, riskFlagging, predictiveAnalytics } = require('../services/aiService');
const DiagnosisLog = require('../models/DiagnosisLog');
const Prescription = require('../models/Prescription');

const router = express.Router();

// Smart Symptom Checker (Doctor Version)
router.post('/symptom-check', protect, authorize('doctor'), checkSubscription('pro'), async (req, res) => {
    try {
        const { symptoms, age, gender, history, patientId } = req.body;

        if (!symptoms || symptoms.length === 0) {
            return res.status(400).json({ message: 'Symptoms are required' });
        }

        const aiResult = await symptomCheck(symptoms, age, gender, history);

        // Save diagnosis log
        const diagnosisLog = await DiagnosisLog.create({
            doctorId: req.user._id,
            patientId,
            symptoms,
            age,
            gender,
            history,
            aiResponse: JSON.stringify(aiResult),
            possibleConditions: aiResult.possibleConditions || [],
            riskLevel: aiResult.riskLevel || 'low',
            suggestedTests: aiResult.suggestedTests || []
        });

        res.json({ ...aiResult, diagnosisLogId: diagnosisLog._id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Smart Symptom Checker (Patient Self-Check)
router.post('/patient-symptom-check', protect, authorize('patient'), async (req, res) => {
    try {
        const { symptoms, age, gender, history } = req.body;

        if (!symptoms || symptoms.length === 0) {
            return res.status(400).json({ message: 'Symptoms are required' });
        }

        const aiResult = await symptomCheck(symptoms, age, gender, history);

        // Save diagnosis log (no doctorId for self-check)
        // Note: For patients, we use their own ID as patientId and keep doctorId null
        // We'll need to find the Patient record associated with this User if exists,
        // or just use the User ID if they are the same in this system.
        // Assuming there is a 1:1 mapping or User can act as Patient context.

        // Find if there is a patient record for this user email
        const Patient = require('../models/Patient');
        let patient = await Patient.findOne({ email: req.user.email });

        const diagnosisLog = await DiagnosisLog.create({
            patientId: patient ? patient._id : req.user._id, // Fallback to user ID if no patient record
            symptoms,
            age: age || patient?.age,
            gender: gender || patient?.gender,
            history,
            aiResponse: JSON.stringify(aiResult),
            possibleConditions: aiResult.possibleConditions || [],
            riskLevel: aiResult.riskLevel || 'low',
            suggestedTests: aiResult.suggestedTests || []
        });

        res.json({ ...aiResult, diagnosisLogId: diagnosisLog._id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Prescription Explanation
router.post('/explain-prescription', protect, checkSubscription('pro'), async (req, res) => {
    try {
        const { prescriptionId } = req.body;

        const prescription = await Prescription.findById(prescriptionId)
            .populate('patientId', 'name');

        if (!prescription) {
            return res.status(404).json({ message: 'Prescription not found' });
        }

        const explanation = await explainPrescription(
            prescription,
            prescription.patientId?.name || 'Patient'
        );

        // Save explanation to prescription
        prescription.aiExplanation = explanation.simpleExplanation;
        await prescription.save();

        res.json(explanation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Risk Flagging
router.post('/risk-flag', protect, authorize('doctor', 'admin'), checkSubscription('pro'), async (req, res) => {
    try {
        const { patientId } = req.body;

        const Patient = require('../models/Patient');
        const Appointment = require('../models/Appointment');

        const [patient, diagnosisLogs, appointments] = await Promise.all([
            Patient.findById(patientId),
            DiagnosisLog.find({ patientId }).sort('-createdAt').limit(10),
            Appointment.find({ patientId }).sort('-date').limit(10)
        ]);

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        const patientHistory = {
            patient: { name: patient.name, age: patient.age, gender: patient.gender, allergies: patient.allergies },
            recentDiagnoses: diagnosisLogs.map(d => ({
                symptoms: d.symptoms,
                riskLevel: d.riskLevel,
                conditions: d.possibleConditions,
                date: d.createdAt
            })),
            recentAppointments: appointments.map(a => ({
                reason: a.reason,
                status: a.status,
                date: a.date
            }))
        };

        const riskAnalysis = await riskFlagging(patientHistory);
        res.json(riskAnalysis);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Predictive Analytics
router.get('/predictive-analytics', protect, authorize('admin'), checkSubscription('pro'), async (req, res) => {
    try {
        const Appointment = require('../models/Appointment');
        const Patient = require('../models/Patient');
        const User = require('../models/User');

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const [recentDiagnoses, recentAppointments, totalPatients, totalDoctors] = await Promise.all([
            DiagnosisLog.find({ createdAt: { $gte: thirtyDaysAgo } }),
            Appointment.find({ date: { $gte: thirtyDaysAgo } }),
            Patient.countDocuments(),
            User.countDocuments({ role: 'doctor' })
        ]);

        const analyticsData = {
            totalPatients,
            totalDoctors,
            recentAppointmentsCount: recentAppointments.length,
            diagnosesThisMonth: recentDiagnoses.length,
            commonSymptoms: recentDiagnoses.flatMap(d => d.symptoms).slice(0, 20),
            appointmentStatuses: recentAppointments.reduce((acc, a) => {
                acc[a.status] = (acc[a.status] || 0) + 1;
                return acc;
            }, {})
        };

        const predictions = await predictiveAnalytics(analyticsData);
        res.json(predictions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

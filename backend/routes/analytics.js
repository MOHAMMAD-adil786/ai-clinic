const express = require('express');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const DiagnosisLog = require('../models/DiagnosisLog');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Admin Analytics
router.get('/admin', protect, authorize('admin'), async (req, res) => {
    try {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);

        const [
            totalPatients, totalDoctors, totalReceptionists,
            totalAppointments, monthlyAppointments,
            completedAppointments, prescriptions,
            diagnosisLogs, recentAppointments
        ] = await Promise.all([
            Patient.countDocuments(),
            User.countDocuments({ role: 'doctor' }),
            User.countDocuments({ role: 'receptionist' }),
            Appointment.countDocuments(),
            Appointment.countDocuments({ date: { $gte: thirtyDaysAgo } }),
            Appointment.countDocuments({ status: 'completed' }),
            Prescription.countDocuments(),
            DiagnosisLog.find({ createdAt: { $gte: sixMonthsAgo } }),
            Appointment.find({ date: { $gte: sixMonthsAgo } })
        ]);

        // Monthly appointment trend
        const monthlyTrend = [];
        for (let i = 5; i >= 0; i--) {
            const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
            const count = recentAppointments.filter(a =>
                new Date(a.date) >= start && new Date(a.date) <= end
            ).length;
            monthlyTrend.push({
                month: start.toLocaleString('default', { month: 'short' }),
                appointments: count
            });
        }

        // Common diagnoses
        const diagnosisCounts = {};
        diagnosisLogs.forEach(log => {
            log.possibleConditions?.forEach(c => {
                if (c.condition && c.condition !== 'AI analysis unavailable') {
                    diagnosisCounts[c.condition] = (diagnosisCounts[c.condition] || 0) + 1;
                }
            });
        });
        const commonDiagnoses = Object.entries(diagnosisCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, count]) => ({ name, count }));

        // Appointment status distribution
        const statusCounts = { pending: 0, confirmed: 0, completed: 0, cancelled: 0 };
        recentAppointments.forEach(a => {
            if (statusCounts[a.status] !== undefined) statusCounts[a.status]++;
        });

        // Simulated revenue ($50 per completed appointment)
        const revenue = completedAppointments * 50;

        res.json({
            stats: {
                totalPatients,
                totalDoctors,
                totalReceptionists,
                totalAppointments,
                monthlyAppointments,
                completedAppointments,
                totalPrescriptions: prescriptions,
                revenue
            },
            monthlyTrend,
            commonDiagnoses,
            statusDistribution: Object.entries(statusCounts).map(([name, value]) => ({ name, value }))
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Doctor Analytics
router.get('/doctor', protect, authorize('doctor'), async (req, res) => {
    try {
        const doctorId = req.user._id;
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        const today = new Date(`${todayStr}T00:00:00.000Z`);
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const [
            totalAppointments, todayAppointments,
            monthlyAppointments, completedAppointments,
            prescriptionsCount, recentAppointments
        ] = await Promise.all([
            Appointment.countDocuments({ doctorId }),
            Appointment.countDocuments({ doctorId, date: { $gte: today } }),
            Appointment.countDocuments({ doctorId, date: { $gte: thirtyDaysAgo } }),
            Appointment.countDocuments({ doctorId, status: 'completed' }),
            Prescription.countDocuments({ doctorId }),
            Appointment.find({ doctorId, date: { $gte: thirtyDaysAgo } })
        ]);

        // Weekly trend
        const weeklyTrend = [];
        for (let i = 6; i >= 0; i--) {
            const day = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate());
            const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
            const count = recentAppointments.filter(a =>
                new Date(a.date) >= dayStart && new Date(a.date) < dayEnd
            ).length;
            weeklyTrend.push({
                day: day.toLocaleString('default', { weekday: 'short' }),
                appointments: count
            });
        }

        res.json({
            stats: {
                totalAppointments,
                todayAppointments,
                monthlyAppointments,
                completedAppointments,
                prescriptionsCount
            },
            weeklyTrend
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

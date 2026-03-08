const express = require('express');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all users (Admin only)
router.get('/', protect, authorize('admin'), async (req, res) => {
    try {
        const { role } = req.query;
        const filter = role ? { role } : {};
        const users = await User.find(filter).sort('-createdAt');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all doctors
router.get('/doctors', protect, async (req, res) => {
    try {
        const doctors = await User.find({ role: 'doctor', isActive: true });
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create user (Admin only)
router.post('/', protect, authorize('admin'), async (req, res) => {
    try {
        const { name, email, password, role, phone, specialization } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const user = await User.create({ name, email, password, role, phone, specialization });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update user (Admin only)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const { name, email, phone, specialization, isActive, subscriptionPlan } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.phone = phone || user.phone;
        user.specialization = specialization || user.specialization;
        if (isActive !== undefined) user.isActive = isActive;
        if (subscriptionPlan) user.subscriptionPlan = subscriptionPlan;

        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete user (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

const mongoose = require('mongoose');
const Appointment = require('./models/Appointment');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

async function checkAppointments() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const allAppointments = await Appointment.find().limit(5);
        console.log('Total appointments:', await Appointment.countDocuments());
        console.log('Recent 5 appointments:');
        allAppointments.forEach(a => {
            console.log(`ID: ${a._id}, Date: ${a.date.toISOString()}, Status: ${a.status}`);
        });

        const now = new Date();
        const today = new Date().toISOString().split('T')[0];
        console.log('Current Date (UTC):', now.toISOString());
        console.log('Today string (Frontend style):', today);

        const startOfDay = new Date(today);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);

        console.log('Filter Range:', startOfDay.toISOString(), 'to', endOfDay.toISOString());

        const todayAppointments = await Appointment.find({
            date: { $gte: startOfDay, $lte: endOfDay }
        });
        console.log('Appointments found for today:', todayAppointments.length);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkAppointments();

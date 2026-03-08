const mongoose = require('mongoose');
const Appointment = require('./models/Appointment');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

async function addTestAppointment() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const testApt = {
            patientId: '69a364031334b222f06f1c2e',
            doctorId: '69a3cc0360e4696043c1de64',
            date: new Date('2026-03-08'), // This should match what frontend sends ("2026-03-08")
            time: '10:00',
            status: 'pending',
            reason: 'Test Appointment Today'
        };

        const created = await Appointment.create(testApt);
        console.log('Created appointment:', {
            id: created._id,
            date: created.date.toISOString(),
            status: created.status
        });

        // Now test the filter logic from appointments.js
        const queryDate = '2026-03-08';
        const startOfDay = new Date(queryDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(queryDate);
        endOfDay.setHours(23, 59, 59, 999);

        console.log('Filter Range:', startOfDay.toISOString(), 'to', endOfDay.toISOString());

        const found = await Appointment.find({
            date: { $gte: startOfDay, $lte: endOfDay }
        });
        console.log('Appointments found for 2026-03-08:', found.length);
        found.forEach(a => console.log(`- ID: ${a._id}, Date: ${a.date.toISOString()}`));

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

addTestAppointment();

const mongoose = require('mongoose');
const Patient = require('./models/Patient');
const User = require('./models/User');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

async function listData() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const patients = await Patient.find().limit(1);
        const doctors = await User.find({ role: 'doctor' }).limit(1);

        console.log('Patient:', patients[0] ? { name: patients[0].name, id: patients[0]._id } : 'None');
        console.log('Doctor:', doctors[0] ? { name: doctors[0].name, id: doctors[0]._id } : 'None');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

listData();

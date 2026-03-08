const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log('MongoDB Connected correctly for seeding');

    // Clear only users to avoid duplicate email errors
    await User.deleteMany({});
    console.log('Cleared existing users');

    const admin = await User.create({
        name: 'Admin User',
        email: 'admin@clinic.com',
        password: 'password123',
        role: 'admin',
        phone: '0300-1111111',
        subscriptionPlan: 'pro'
    });

    const doctor = await User.create({
        name: 'Sarah Khan',
        email: 'doc@clinic.com',
        password: 'password123',
        role: 'doctor',
        phone: '0300-2222222',
        specialization: 'General Physician',
        subscriptionPlan: 'pro'
    });

    const receptionist = await User.create({
        name: 'Front Desk',
        email: 'frontdesk@clinic.com',
        password: 'password123',
        role: 'receptionist',
        phone: '0300-3333333'
    });

    console.log('Demo Users Created Successfully:');
    console.log('Admin:', admin.email, '/ password123');
    console.log('Doctor:', doctor.email, '/ password123');
    console.log('Receptionist:', receptionist.email, '/ password123');

    process.exit();
}).catch(err => {
    console.error('Seeding error:', err);
    process.exit(1);
});

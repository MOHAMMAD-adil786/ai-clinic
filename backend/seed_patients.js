const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Patient = require('./models/Patient');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log('MongoDB Connected correctly for seeding patients');

    const admin = await User.findOne({ role: 'admin' });

    if (!admin) {
        console.error('No admin user found to associate patients with. Run node seed.js first.');
        process.exit(1);
    }

    await Patient.deleteMany({});

    await Patient.create([
        {
            name: 'John Doe',
            age: 35,
            gender: 'male',
            contact: '0300-4445555',
            email: 'john.doe@example.com',
            address: '123 Main St, City',
            bloodGroup: 'O+',
            allergies: 'Penicillin',
            createdBy: admin._id
        },
        {
            name: 'Jane Smith',
            age: 28,
            gender: 'female',
            contact: '0300-6667777',
            email: 'jane.s@example.com',
            address: '456 Oak Avenue, City',
            bloodGroup: 'A-',
            allergies: 'None',
            createdBy: admin._id
        },
        {
            name: 'Demo Patient',
            age: 45,
            gender: 'male',
            contact: '0300-8889999',
            email: 'demo@example.com',
            address: '789 Pine Road, City',
            bloodGroup: 'B+',
            allergies: 'Dust, Peanuts',
            createdBy: admin._id
        }
    ]);

    console.log('3 Demo Patients created successfully.');
    process.exit();
}).catch(err => {
    console.error('Seeding error:', err);
    process.exit(1);
});

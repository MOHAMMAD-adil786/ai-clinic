const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

async function listUsers() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const users = await User.find().select('+password');
        console.log(`Found ${users.length} users.`);
        users.forEach(u => {
            console.log(`- Email: ${u.email}, Role: ${u.role}, Password Hash: ${u.password ? 'Exists' : 'MISSING'}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

listUsers();

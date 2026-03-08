const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

async function testConnection() {
    console.log('Starting MongoDB connection test...');
    console.log('URI:', process.env.MONGO_URI ? 'Defined' : 'UNDEFINED');

    try {
        // Use a short timeout to avoid hanging
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // 5 seconds
        });
        console.log('✅ Connection Successful!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Connection Failed!');
        console.error('Error Name:', error.name);
        console.error('Error Message:', error.message);
        process.exit(1);
    }
}

testConnection();

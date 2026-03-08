const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: 'c:/Users/Mohammad Ukkasha/Desktop/hackaton/ai-clinic/backend/.env' });

async function testConnection() {
    console.log('Testing connection to:', process.env.MONGO_URI);
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('SUCCESS: Connected to MongoDB!');
        process.exit(0);
    } catch (err) {
        console.error('FAILURE: Could not connect to MongoDB.');
        console.error('Error Code:', err.code);
        console.error('Error Message:', err.message);
        if (err.reason) {
            console.error('Reason:', JSON.stringify(err.reason, null, 2));
        }
        process.exit(1);
    }
}

testConnection();

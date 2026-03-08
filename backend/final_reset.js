const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

async function finalReset() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = [
            { email: 'admin@clinic.com', password: 'password123' },
            { email: 'doc@clinic.com', password: 'password123' },
            { email: 'frontdesk@clinic.com', password: 'password123' }
        ];

        for (const u of users) {
            const user = await User.findOne({ email: u.email });
            if (user) {
                user.password = u.password;
                await user.save();
                console.log(`✅ Reset: ${u.email}`);
            }
        }
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}
finalReset();

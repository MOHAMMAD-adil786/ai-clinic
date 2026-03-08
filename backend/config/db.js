const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error('❌ MongoDB Connection Error!');
    console.error(`Message: ${error.message}`);
    if (error.message.includes('IP not whitelisted') || error.message.includes('Could not connect to any servers')) {
      console.error('💡 TIP: Check if your current IP is whitelisted in MongoDB Atlas (Network Access).');
    }
    // Don't exit process here so server can still provide a meaningful health check
    return false;
  }
};

module.exports = connectDB;

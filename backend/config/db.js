const mongoose = require('mongoose');

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      console.error('CRITICAL: MONGO_URI is not defined in environment variables');
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    if (cached.conn) {
      return cached.conn;
    }

    if (!cached.promise) {
      cached.promise = mongoose.connect(uri).then((mongoose) => {
        console.log(`MongoDB Connected: ${mongoose.connection.host}`);
        return mongoose;
      });
    }

    cached.conn = await cached.promise;
    return cached.conn;

  } catch (error) {
    console.error('❌ MongoDB Connection Error!');
    console.error(`Message: ${error.message}`);
    if (error.message.includes('IP not whitelisted') || error.message.includes('Could not connect to any servers')) {
      console.error('💡 TIP: Check if your current IP is whitelisted in MongoDB Atlas (Network Access).');
    }
    throw error;
  }
};

module.exports = connectDB;

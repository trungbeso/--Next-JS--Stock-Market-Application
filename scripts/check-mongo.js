/* Simple script to verify MongoDB connectivity using Mongoose.
   Usage: npm run check:db
*/
const mongoose = require('mongoose');

// Load environment variables from .env if present
try {
  require('dotenv').config();
} catch (e) {
  // dotenv might not be installed; ignore if not found
}

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('Error: MONGODB_URI is not defined in environment variables.');
  process.exit(1);
}

(async () => {
  try {
    const start = Date.now();
    await mongoose.connect(uri, { bufferCommands: false });
    const ms = Date.now() - start;
    console.log(`MongoDB connection successful (in ${ms} ms).`);
    // Optionally ping admin
    try {
      const admin = mongoose.connection.db.admin();
      const ping = await admin.ping();
      console.log('Ping result:', ping);
    } catch (err) {
      // Not critical if ping fails
    }
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('MongoDB connection failed:');
    console.error(err && err.message ? err.message : err);
    process.exit(2);
  }
})();

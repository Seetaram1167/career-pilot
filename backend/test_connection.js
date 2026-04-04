const mongoose = require('mongoose');
require('dotenv').config({ path: 'd:/carrier pilot/backend/.env' });

const test = async () => {
  try {
    console.log('Connecting to:', process.env.MONGO_URI.replace(/:([^@]+)@/, ':****@'));
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('SUCCESS: Connected to MongoDB Atlas');
    process.exit(0);
  } catch (err) {
    console.error('FAILURE:', err.message);
    process.exit(1);
  }
};

test();

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Mentor = require('../backend/models/Mentor');

dotenv.config({ path: '../backend/.env' });

const updatePrices = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Update Top Rated to 2500
    const topResult = await Mentor.updateMany({ isTopRated: true }, { price: 2500 });
    console.log(`Updated ${topResult.modifiedCount} top-rated mentors to ₹2500`);

    // Update Rest to 1500
    const restResult = await Mentor.updateMany({ isTopRated: false }, { price: 1500 });
    console.log(`Updated ${restResult.modifiedCount} regular mentors to ₹1500`);

    process.exit(0);
  } catch (error) {
    console.error('Error updating prices:', error);
    process.exit(1);
  }
};

updatePrices();

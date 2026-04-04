const mongoose = require('mongoose');
const Mentor = require('./models/Mentor');

async function updateMentors() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/careerpilot');
    console.log('Connected to DB');
    
    // Update EVERY mentor to a distinct number
    const result = await Mentor.updateMany({}, { 
      $set: { phone: '+91 70123 45678' } 
    });
    
    console.log('Mentors found:', await Mentor.countDocuments());
    console.log('Update result:', result);
    
    const adrian = await Mentor.findOne({ name: /Adrian Miller/i });
    console.log('Dr. Adrian Miller current phone:', adrian.phone);
    
    process.exit(0);
  } catch (err) {
    console.error('Update failed:', err);
    process.exit(1);
  }
}

updateMentors();

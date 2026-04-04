const mongoose = require('mongoose');
const User = require('./models/User');

async function findUsersWithPurchases() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/careerpilot');
    const users = await User.find({ "purchases.0": { $exists: true } }, 'email name purchases');
    console.log(JSON.stringify(users, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

findUsersWithPurchases();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://127.0.0.1:27017/careerpilot').then(async () => {
  const db = mongoose.connection.db;
  const users = await db.collection('users').find({}).toArray();

  console.log('\n===== Checking & Fixing Passwords =====');
  for (const user of users) {
    const isAlreadyHashed = user.password && user.password.startsWith('$2');
    
    if (isAlreadyHashed) {
      console.log(`✅ ${user.email} — password already hashed, skipping.`);
    } else {
      // Password is plaintext — hash it now
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(user.password, salt);
      await db.collection('users').updateOne(
        { _id: user._id },
        { $set: { password: hashed } }
      );
      console.log(`🔐 FIXED: ${user.email} — password was plain text, now hashed.`);
    }
  }
  
  console.log('\n✅ All done! You can now log in normally.');
  mongoose.disconnect();
}).catch(e => console.error('Error:', e.message));

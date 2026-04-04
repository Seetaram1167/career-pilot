/**
 * Admin Password Reset Script
 * Usage: node resetPassword.js <email> <newPassword>
 * Example: node resetPassword.js seeta3105@gmail.com MyNewPass123
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const [,, email, newPassword] = process.argv;

if (!email || !newPassword) {
  console.log('\n❌ Usage: node resetPassword.js <email> <newPassword>');
  console.log('   Example: node resetPassword.js seeta3105@gmail.com MyNewPass123\n');
  process.exit(1);
}

mongoose.connect('mongodb://127.0.0.1:27017/careerpilot').then(async () => {
  const db = mongoose.connection.db;
  const user = await db.collection('users').findOne({ email });

  if (!user) {
    console.log(`\n❌ No user found with email: ${email}\n`);
    mongoose.disconnect();
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(newPassword, salt);
  await db.collection('users').updateOne(
    { email },
    { $set: { password: hashed } }
  );

  console.log(`\n✅ Password reset successfully for: ${email}`);
  console.log(`   New password: ${newPassword}`);
  console.log('   You can now log in with the new password.\n');
  mongoose.disconnect();
}).catch(e => console.error('DB Error:', e.message));

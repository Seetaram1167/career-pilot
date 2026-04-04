const mongoose = require("mongoose");
require("dotenv").config({ path: "d:/carrier pilot/backend/.env" });

const User = mongoose.model("User", new mongoose.Schema({ role: String, email: String }));

async function check() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({});
    console.log("Total Users in Database:", users.length);
    users.forEach(u => {
      console.log(`- ${u.email} (${u.role || "no-role"})`);
    });
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

check();

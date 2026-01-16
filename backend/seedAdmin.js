import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import Admin from "./models/Admin.js";
import connectDB from "./config/db.js";      

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await Admin.findOne({ email: "dammy@gmail.com" });
    if (existingAdmin) {
      console.log("✅ Admin already exists");
      process.exit();
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("dammy123", salt); 

    const admin = await Admin.create({
      name: "Super Admin",
      email: "dammy@gmail.com",  
      password: hashedPassword,
      phone: "08020304050",
    });

    console.log("✅ Admin seeded successfully:", admin.email);
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding admin:", err.message);
    process.exit(1);
  }
};

seedAdmin();

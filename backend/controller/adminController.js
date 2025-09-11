import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.js";
import Admin from "../models/Admin.js";
import Artisan from "../models/Artisan.js";
import Booking from "../models/Booking.js";
import Student from "../models/Student.js"; // ✅ Add this


// Admin login
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = await generateToken(admin._id, "admin");

    res.status(200).json({
      message: "Admin logged in successfully",
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email },
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Analytics
export const getAnalytics = async (req, res) => {
  try {
    const artisanCount = await Artisan.countDocuments();
    const bookingCount = await Booking.countDocuments();

    const approvedArtisanCount = await Artisan.countDocuments({ status: "approved" });
    const pendingArtisanCount = await Artisan.countDocuments({ status: "pending" });

    const studentCount = await Student.countDocuments(); // ✅ Need to import Student model

    const popularSkills = await Artisan.aggregate([
      { $group: { _id: "$skillCategory", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    res.json({
      artisanCount,
      bookingCount,
      approvedArtisanCount,
      pendingArtisanCount,
      studentCount,
      popularSkills,
    });
  } catch (err) {
    console.error("Error fetching analytics:", err);
    res.status(500).json({ msg: "Server error" });
  }
};


// models/Artisan.js
import mongoose from "mongoose";

const previousWorkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String }, // Cloudinary URL
  createdAt: { type: Date, default: Date.now }
});

const artisanSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    description: { type: String }, // artisan bio
    skillCategory: { type: String, required: true },
    phone: { type: String, required: true },
    availability: { type: Boolean, default: true },
    location: { type: String, required: true },
    yearsOfExperience: { type: Number, required: true },
    profilePhoto: { type: String }, 
    verificationDocs: [{ type: String }], 
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    rating: { type: Number, default: 0 },
    previousWorks: [previousWorkSchema]
  },
  { timestamps: true }
);

const Artisan = mongoose.model("Artisan", artisanSchema);
export default Artisan;

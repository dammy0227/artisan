import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    department: { type: String, required: true },
    faculty: { type: String, required: true },
    password: { type: String, required: true }, 
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);
export default Student;

// routes/studentRoutes.js
import express from "express";
import {
  registerStudent,
  loginStudent,
  updateStudent,
  getStudentById
} from "../controller/studentController.js";
import {
  getArtisans,
  getArtisanById,
  getPreviousWorksByArtisan,
  getPreviousWorkById
} from "../controller/artisanController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// =====================
// Public routes
// =====================
router.post("/register", registerStudent);
router.post("/login", loginStudent);

// Students can view only approved artisans
router.get("/artisans", getArtisans);
router.get("/artisans/:id", getArtisanById);

// ✅ Get previous works of a specific approved artisan
router.get("/artisans/:id/previous-works", getPreviousWorksByArtisan);

// ✅ Get a single previous work by ID of an approved artisan
router.get("/artisans/previous-works/:workId", getPreviousWorkById);

// =====================
// Protected routes (student)
// =====================
router.use(protect);
router.use(authorizeRoles("student"));

// Update own profile
router.put("/update", updateStudent);

// Get own profile by ID
router.get("/:id", getStudentById);

export default router;

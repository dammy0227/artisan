import express from "express";
import { loginAdmin, getAnalytics } from "../controller/adminController.js";
import { approveArtisan, rejectArtisan, getArtisansForAdmin} from "../controller/artisanController.js";
import { getAllStudent, deleteStudent } from "../controller/studentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Public route
router.post("/login", loginAdmin);

// Protected routes (admin only)
router.use(protect);
router.use(authorizeRoles("admin"));

// Artisan management
router.put("/artisan/approve/:artisanId", approveArtisan);
router.put("/artisan/reject/:artisanId", rejectArtisan);

// Analytics
router.get("/analytics", getAnalytics);

// Get pending artisans
router.get("/artisans", getArtisansForAdmin);

// Student management
router.get("/students", getAllStudent);
router.delete("/students/:id", deleteStudent);

export default router;

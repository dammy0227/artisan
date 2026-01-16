import express from "express";
import { loginAdmin, getAnalytics } from "../controller/adminController.js";
import { approveArtisan, rejectArtisan, getArtisansForAdmin} from "../controller/artisanController.js";
import { getAllStudent, deleteStudent } from "../controller/studentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();


router.post("/login", loginAdmin);

router.use(protect);
router.use(authorizeRoles("admin"));

router.put("/artisan/approve/:artisanId", approveArtisan);
router.put("/artisan/reject/:artisanId", rejectArtisan);

router.get("/analytics", getAnalytics);

router.get("/artisans", getArtisansForAdmin);

router.get("/students", getAllStudent);
router.delete("/students/:id", deleteStudent);

export default router;

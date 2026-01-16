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


router.post("/register", registerStudent);
router.post("/login", loginStudent);


router.get("/artisans", getArtisans);
router.get("/artisans/:id", getArtisanById);


router.get("/artisans/:id/previous-works", getPreviousWorksByArtisan);

router.get("/artisans/previous-works/:workId", getPreviousWorkById);


router.use(protect);
router.use(authorizeRoles("student"));

router.put("/update", updateStudent);

router.get("/:id", getStudentById);

export default router;

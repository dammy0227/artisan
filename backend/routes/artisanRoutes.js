import express from "express";
import {
  registerArtisan,
  loginArtisan,
  updateArtisan,
  addPreviousWork,
  getOwnPreviousWorks,
  getOwnPreviousWorkById,
  updatePreviousWork,
  deletePreviousWork
} from "../controller/artisanController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import upload from "../utils/multer.js";

const router = express.Router();

// =====================
// ✅ Public Routes
// =====================
router.post(
  "/register",
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "verificationDocs", maxCount: 5 },
  ]),
  registerArtisan
);

router.post("/login", loginArtisan);

// =====================
// ✅ Protected Artisan Routes
// =====================
router.use(protect);                   // All routes below require authentication
router.use(authorizeRoles("artisan")); // Only artisan can access

// Update artisan profile
router.put(
  "/update",
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "verificationDocs", maxCount: 5 },
  ]),
  updateArtisan
);

// Add a previous work
router.post(
  "/previous-work",
  upload.single("image"), // expects a single image file
  addPreviousWork
);

// Get all previous works of logged-in artisan
router.get("/previous-works", getOwnPreviousWorks);

// Get a single previous work by ID for logged-in artisan
router.get("/previous-works/:workId", getOwnPreviousWorkById);

// Update a previous work of logged-in artisan
router.put(
  "/previous-works/:workId",
  upload.single("image"),
  updatePreviousWork
);

// Delete a previous work of logged-in artisan
router.delete("/previous-works/:workId", deletePreviousWork);

export default router;

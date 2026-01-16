import express from "express";
import {
  createReview,
  getReviewsForArtisan,
  getReviewsForStudent,
  getReviewsForLoggedArtisan,
} from "../controller/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect);


router.post("/", authorizeRoles("student"), createReview); 
router.get("/student/me", authorizeRoles("student"), getReviewsForStudent); 


router.get("/artisan/me", authorizeRoles("artisan"), getReviewsForLoggedArtisan);


router.get("/:artisanId", getReviewsForArtisan); 

export default router;

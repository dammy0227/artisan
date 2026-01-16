import express from "express";
import {
  createBooking,
  getBookingByStudent,
  getBookingByArtisan,
  updateBookingStatus,
} from "../controller/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect);


router.post("/", authorizeRoles("student"), createBooking); 
router.get("/student", authorizeRoles("student"), getBookingByStudent); 


router.get("/artisan", authorizeRoles("artisan"), getBookingByArtisan);
router.put("/artisan/:bookingId", authorizeRoles("artisan"), updateBookingStatus); 

export default router;

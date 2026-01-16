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

router.post(
  "/register",
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "verificationDocs", maxCount: 5 },
  ]),
  registerArtisan
);

router.post("/login", loginArtisan);


router.use(protect);              
router.use(authorizeRoles("artisan")); 


router.put(
  "/update",
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "verificationDocs", maxCount: 5 },
  ]),
  updateArtisan
);


router.post(
  "/previous-work",
  upload.single("image"), 
  addPreviousWork
);


router.get("/previous-works", getOwnPreviousWorks);

router.get("/previous-works/:workId", getOwnPreviousWorkById);


router.put(
  "/previous-works/:workId",
  upload.single("image"),
  updatePreviousWork
);

router.delete("/previous-works/:workId", deletePreviousWork);

export default router;

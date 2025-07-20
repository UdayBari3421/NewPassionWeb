import { Router } from "express";
import {
  addCourse,
  educatorDashboardData,
  getEducatorCourses,
  getEnrolledStudentsData,
  updateRoleToEductor,
} from "../controllers/educatorController.js";
import upload from "../configs/multer.js";
import { protectEducator } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/update-role", updateRoleToEductor);
router.post("/add-course", upload.single("image"), protectEducator, addCourse);
router.get("/courses", protectEducator, getEducatorCourses);
router.get("/dashboard", protectEducator, educatorDashboardData);
router.get("/enrolled-students", protectEducator, getEnrolledStudentsData);

export default router;

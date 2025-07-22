import { Router } from "express";
import {
  addCourseToUser,
  addUserRating,
  getUserCourseProgress,
  getUserData,
  purchaseCourse,
  updateUserCourseProgress,
  userEnrolledCourses,
} from "../controllers/userController.js";

const router = Router();

router.get("/data", getUserData);
router.get("/enrolled-courses", userEnrolledCourses);
router.post("/purchase", purchaseCourse);
router.post("/add-course", addCourseToUser);

router.post("/update-course-progress", updateUserCourseProgress);
router.post("/get-course-progress", getUserCourseProgress);
router.post("/add-rating", addUserRating);

export default router;

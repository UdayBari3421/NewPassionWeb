import { Router } from "express";
import { getUserData, purchaseCourse, userEnrolledCourses } from "../controllers/userController.js";

const router = Router();

router.get("/data", getUserData);
router.get("/enrolled-courses", userEnrolledCourses);
router.post("/purchase", purchaseCourse);

export default router;

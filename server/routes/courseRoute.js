import { Router } from "express";
import { getAllCourses, getCourseId } from "../controllers/courseController.js";

const router = Router();

router.get("/all", getAllCourses);
router.get("/:id", getCourseId);

export default router;

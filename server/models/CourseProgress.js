import { model, Schema } from "mongoose";

const courseProgressSchema = new Schema(
  {
    userId: { type: String, required: true },
    courseId: { type: String, required: true },
    completed: { type: Boolean, default: false },
    lectureCompleted: [],
  },
  { minimize: false }
);

export const CourseProgress = model("CourseProgress", courseProgressSchema);

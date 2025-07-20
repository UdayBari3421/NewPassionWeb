import { clerkClient } from "@clerk/express";
import Course from "../models/Course.model.js";
import { v2 as cloudinary } from "cloudinary";
import { Purchase } from "../models/Purchase.model.js";

export const updateRoleToEductor = async (req, res) => {
  try {
    const userId = req.auth().userId;

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: { role: "educator" },
    });

    return res.json({ success: true, message: "You can publish the course now" });
  } catch (error) {
    return res.json({ message: error.message, success: false });
  }
};

export const addCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    const imageFile = req.file;

    const educatorId = req.auth().userId;

    if (!imageFile) {
      return res.json({ success: false, message: "Thumbnail not attached" }).status(400);
    }

    const parsedCourseData = JSON.parse(courseData);
    parsedCourseData.educator = educatorId;

    const newCourse = await Course.create(parsedCourseData);
    const imageUpload = await cloudinary.uploader.upload(imageFile.path);
    newCourse.courseThumbnail = imageUpload.secure_url;

    await newCourse.save();

    return res.json({ message: "Course Added", success: true }).status(200);

    //
  } catch (error) {
    return res.json({ message: error.message, success: false });
  }
};

export const getEducatorCourses = async (req, res) => {
  try {
    const educator = req.auth().userId;
    const courses = await Course.find({ educator });
    return res.json({ success: true, courses }).status(200);
  } catch (error) {
    return res.json({
      message: error.message,
      success: false,
    });
  }
};

export const educatorDashboardData = async (req, res) => {
  try {
    const educator = req.auth().userId;
    const courses = await Course.find({ educator });
    const totalCourses = courses.length;

    const courseIds = courses.map((course) => course._id);

    // Calculate total Earnings
    const purchases = await Purchase.find({
      courseId: {
        $in: courseIds,
      },
      status: "completed",
    });
    const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);

    //Collect unique enrolled student Ids with there course title
    const enrolledStudentsData = [];

    for (course of courses) {
      const students = await User.find(
        {
          _id: { $in: course.enrolledStudents },
        },
        "name imageUrl"
      );

      students.forEach((student) => {
        enrolledStudentsData.push({
          courseTitle: course.courseTitle,
          student,
        });
      });

      return res.json({
        success: true,
        dashboardData: {
          totalEarnings,
          enrolledStudentsData,
          totalCourses,
        },
      });
    }
  } catch (error) {
    return res.json({ message: error.message, success: false });
  }
};

// get Enrolled Student data with purchase Data
export const getEnrolledStudentsData = async () => {
  try {
    const educator = req.auth().userId;
    const courses = await Course.find({ educator });
    const courseIds = courses.map((course) => course._id);

    const purchases = await Purchase.find({
      courseId: {
        $in: courseIds,
      },
      status: "completed",
    })
      .populate("userId", "name imageUrl")
      .populate("courseId", "courseTitle");

    const enrolledStudents = purchases.map((purchase) => ({
      student: purchase.userId,
      courseTitle: purchase.courseId.courseTitle,
      purchaseData: purchase.createdAt,
    }));

    return res.json({ success: true, enrolledStudents });

    //
  } catch (error) {
    return res.json({ message: error.message, success: false });
  }
};

import Course from "../models/Course.js";

// Get All Courses
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .select(["-courseContent", "-enrolledStudents"])
      .populate({ path: "educator" });

    return res.json({ success: true, courses });
  } catch (error) {
    return res.json({
      message: error.message,
      success: false,
    });
  }
};

// get Course By ID
export const getCourseId = async (req, res) => {
  const { id } = req.params;

  try {
    const courseData = await Course.findById(id).populate({ path: "educator" });

    // remove lectureurl if isPreviewFree is false
    courseData.courseContent.forEach((chapter) => {
      chapter.chapterContent.forEach((lecture) => {
        if (!lecture.isPreviewFree) {
          lecture.lectureUrl = "";
        }
      });
    });

    return res.json({ success: true, courseData });
  } catch (error) {
    return res.json({
      message: error.message,
      success: false,
    });
  }
};

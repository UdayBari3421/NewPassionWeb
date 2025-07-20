import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import SearchBar from "../../Components/Student/SearchBar";
import CourseCard from "../../Components/Student/CourseCard";
import Footer from "../../Components/Student/Footer";
import { useParams } from "react-router-dom";
import { assets } from "../../assets/assets";

const CoursesList = () => {
  const { navigate, allCourses } = useContext(AppContext);
  const { input } = useParams();
  const [filteredCourse, setFilteredCourse] = useState([]);

  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      const tempCourses = allCourses.slice();

      input
        ? setFilteredCourse(
            tempCourses.filter((item) =>
              item.courseTitle.toLowerCase().includes(input.toLowerCase())
            )
          )
        : setFilteredCourse(tempCourses);
    }
  }, [allCourses, input]);

  return (
    <>
      <div className="relative md:px-36 px-8 pt-20 text-left">
        <div className="flex md:flex-row flex-col gap-6 items-start justify-between w-full">
          <div>
            <h1 className="text-4xl font-semibold text-gray-800">Course List</h1>
            <p className="text-gray-500">
              <span onClick={() => navigate("/")} className="text-primary cursor-pointer">
                Home
              </span>{" "}
              / <span>Course List</span>
            </p>
          </div>
          <SearchBar data={input} />
        </div>
        {input && (
          <div className="inline-flex items-center gap-4 px-4 py-2 border my-8 text-gray-600">
            <p>{input}</p>
            <img
              onClick={() => navigate("/course-list")}
              src={assets.cross_icon}
              className="cursor-pointer"
              alt="cross"
            />
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-16 gap-3 px-2 md:p-0">
          {filteredCourse.map((course, index) => (
            <CourseCard course={course} key={index} />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CoursesList;

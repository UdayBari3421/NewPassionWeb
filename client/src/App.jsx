import React from "react";
import { Route, Routes, useMatch } from "react-router-dom";
import Home from "./pages/Student/Home";
import CoursesList from "./pages/Student/CoursesList";
import CourseDetails from "./Pages/Student/CourseDetails";
import MyEnrollments from "./pages/Student/MyEnrollments";
import Player from "./pages/Student/Player";
import Loading from "./Components/Student/Loading";
import Educator from "./pages/Educator/Educator";
import Dashboard from "./pages/Educator/Dashboard";
import AddCourse from "./pages/Educator/AddCourse";
import MyCourses from "./pages/Educator/MyCourses";
import StudentsEnrolled from "./Pages/Educator/StudentsEnrolled";
import Navbar from "./Components/Student/Navbar";

const App = () => {
  const isEducatorPage = useMatch("/educator/*");

  return (
    <div className="text-default min-h-screen bg-white">
      {!isEducatorPage && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />
        <Route
          path="/course-list"
          element={<CoursesList />}
        />
        <Route
          path="/course-list/:input"
          element={<CoursesList />}
        />
        <Route
          path="/course/:id"
          element={<CourseDetails />}
        />
        <Route
          path="/my-enrollments"
          element={<MyEnrollments />}
        />
        <Route
          path="/player/:courseId"
          element={<Player />}
        />
        <Route
          path="/loading/:path"
          element={<Loading />}
        />
        <Route
          path="/educator"
          element={<Educator />}>
          <Route
            path="/educator"
            element={<Dashboard />}
          />
          <Route
            path="add-course"
            element={<AddCourse />}
          />
          <Route
            path="my-courses"
            element={<MyCourses />}
          />
          <Route
            path="students-enrolled"
            element={<StudentsEnrolled />}
          />
        </Route>
      </Routes>
    </div>
  );
};

export default App;

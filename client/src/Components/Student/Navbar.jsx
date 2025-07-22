import React, { useContext } from "react";
import logoFull from "../../assets/passionLogo.png";

import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { AppContext } from "../../Context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

//TODO: if needs add it to the parent later border-b border-gray-500

const Navbar = () => {
  const { navigate, isEducator, backendUrl, setIsEducator, getToken } = useContext(AppContext);

  const isCourseListPage = location.pathname.includes("/course-list");

  const { openSignIn } = useClerk();
  const { user } = useUser();

  const becomeEducator = async () => {
    try {
      if (isEducator) {
        navigate("/educator");
        return;
      }
      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/educator/update-role`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setIsEducator(true);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div
      className={`flex items-center justify-between sm:px-10 md:px-14 py-4 px-4 ${
        isCourseListPage ? "bg-white" : "bg-cyan-100/70"
      }`}>
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="Logo"
        className="inline md:hidden w-12 cursor-pointer"
      />
      <img
        onClick={() => navigate("/")}
        src={logoFull}
        alt="Logo"
        className="hidden md:block w-56 cursor-pointer"
      />
      <div className="hidden md:flex items-center gap-5 text-gray-500">
        <div className="flex items-center gap-5">
          {user && (
            <>
              {/* <button onClick={() => navigate("/educator")}> */}
              <button onClick={becomeEducator}>
                {isEducator ? "Educator Dashboard" : "Become Educator"}
              </button>
              |<Link to="/my-enrollments">My Enrollments</Link>
            </>
          )}
        </div>
        {user ? (
          <UserButton />
        ) : (
          <button
            onClick={() => openSignIn()}
            className="bg-primary text-white px-5 py-2 rounded-full">
            Create Account
          </button>
        )}
      </div>
      <div className="md:hidden flex items-center gap-2 sm:gap-5 text-gray-500">
        <div className="flex items-center gap-1 sm:gap-2 max-sm:text-xs">
          {user && (
            <>
              {/* <button onClick={() => navigate("/educator")}> */}
              <button onClick={becomeEducator}>
                {isEducator ? "Educator Dashboard" : "Become Educator"}
              </button>
              |<Link to="/my-enrollments">My Enrollments</Link>
            </>
          )}
        </div>
        {user ? (
          <UserButton />
        ) : (
          <button onClick={() => openSignIn()}>
            <img
              src={assets.user_icon}
              alt=""
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;

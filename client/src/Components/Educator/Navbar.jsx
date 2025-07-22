import React from "react";
import { assets } from "../../assets/assets";
import { UserButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user } = useUser();

  return (
    <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-500 py-3">
      <Link to="/">
        <img
          src={assets.fullLogo}
          alt="logo"
          className="md:w-48 w-14"
        />
      </Link>
      <div className="flex items-center gap-5 text-gray-500 relative">
        <p>Hi! {user ? user.fullName : "Devlopers"}</p>
        {user ? (
          <UserButton />
        ) : (
          <img
            className="max-w-8"
            src={assets.profile_img}
          />
        )}
      </div>
    </div>
  );
};

export default Navbar;

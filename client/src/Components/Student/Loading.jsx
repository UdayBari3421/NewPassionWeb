import React from "react";
import { useContext } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import { useEffect } from "react";

const Loading = () => {
  const { path } = useParams();
  const { navigate } = useContext(AppContext);

  useEffect(() => {
    if (path) {
      const timer = setTimeout(() => {
        navigate(`/${path}`);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="absolute top-0 left-0 right-0 -z-0 min-h-screen flex items-center justify-center ">
      <div className="w-16 sm:w-20 aspect-square border-8 border-gray-300 border-t-8 border-t-primary rounded-full animate-spin"></div>
    </div>
  );
};

export default Loading;

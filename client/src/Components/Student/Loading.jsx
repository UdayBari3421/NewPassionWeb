import React from "react";

const Loading = () => {
  return (
    <div className="absolute top-0 left-0 right-0 -z-0 min-h-screen flex items-center justify-center ">
      <div className="w-16 sm:w-20 aspect-square border-8 border-gray-300 border-t-8 border-t-primary rounded-full animate-spin"></div>
    </div>
  );
};

export default Loading;

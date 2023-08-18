import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-50 bg-gray-200">
      <div className="animate-spin rounded-full h-96 w-96 border-t-8 border-indigo-500 border-opacity-50 "></div>
    </div>
  );
};

export default LoadingSpinner;

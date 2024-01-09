import backgroundImage from "@/images/background-call-to-action.jpg";
import Image from "next/image";
import React from "react";

const loading = () => {
  return (
    <div className="flex h-full bg-blue-50 justify-center items-center flex-col">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-400"></div>
    </div>
  );
};

export default loading;

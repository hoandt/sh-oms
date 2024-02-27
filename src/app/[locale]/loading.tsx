import backgroundImage from "@/images/background-call-to-action.jpg";
import Image from "next/image";
import React from "react";

const loading = () => {
  return (
    <div className="flex h-full  justify-center items-center flex-col sx:mt-16">
      <div className="mt-24 animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-orange-400"></div>
    </div>
  );
};

export default loading;

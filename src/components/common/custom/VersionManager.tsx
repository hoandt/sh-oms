"use client";
import { toast } from "@/components/ui/use-toast";
import { signOut } from "next-auth/react";
import React, { useEffect } from "react";
const version = "1.0.3";
const checkVersion = async (version: string) => {
  // check version in local storage, key is "sh-version"
  const localVersion = localStorage.getItem("sh-version");
  console.log("localVersion", localVersion);
  if (localVersion === version) {
    return version;
  } else {
    // if not found, update version in local storage
    toast({
      title: "Phiên làm việc đã hết hạn",
      description: "Vui lòng đăng nhập lại.",
      variant: "destructive",
    });
    localStorage.setItem("sh-version", version);
    await signOut();

    return version;
  }
};
const VersionManager = () => {
  checkVersion(version);
  useEffect(() => {
    //check version every 5 minutes
    const checkVersionTime = setInterval(() => {
      checkVersion(version);
    }, 60000 * 5);

    return () => {
      clearInterval(checkVersionTime);
    };
  }, []);
  return <div></div>;
};

export default VersionManager;

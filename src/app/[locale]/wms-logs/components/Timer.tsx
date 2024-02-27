// timer component
import React, { useEffect, useState } from "react";
const LIMIT_TIME = 5 * 60;
const Timer = ({ handleTimeOut }: { handleTimeOut: () => void }) => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);
  // limit timer to 30 minutes, then stop
  useEffect(() => {
    if (seconds >= LIMIT_TIME) {
      setIsActive(false);
      setSeconds(0);
      handleTimeOut();
    }
  }, [seconds]);
  useEffect(() => {
    let interval: any;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
      console.log("cleared");
    }
    return () => {
      clearInterval(interval);
      console.log("cleared");
    };
  }, [isActive, seconds]);

  return (
    <div className="app relative flex items-center gap-2 ">
      <div
        className="animate-pulse"
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          backgroundColor: "red",
        }}
      ></div>
      <div className="time rounded  bg-orange-100 px-2">
        {Math.floor(seconds / 3600)
          .toString()
          .padStart(2, "0")}
        :
        {Math.floor((seconds % 3600) / 60)
          .toString()
          .padStart(2, "0")}
        :{(seconds % 60).toString().padStart(2, "0")}
      </div>
    </div>
  );
};

export default Timer;

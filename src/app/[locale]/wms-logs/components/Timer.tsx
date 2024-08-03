// timer component
import React, { useEffect, useState } from "react";

const Timer = ({
  handleTimeOut,
  isTrial,
}: {
  isTrial: boolean | null;
  handleTimeOut: () => void;
}) => {
  const LIMIT_TIME = isTrial === null || !isTrial ? 15 * 60 : 15; //15 seconds for trial, 10 minutes for premium

  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);
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
    }
    return () => {
      clearInterval(interval);
    };
  }, [isActive, seconds]);

  return (
    <div className="app relative flex items-center gap-2 ">
      <div
        className=" "
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

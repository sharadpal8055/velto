import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const Timer = ({ timeleft = 60, totaltime = 60 }) => {
  const percentage =
    totaltime > 0 ? Math.max(0, Math.min(100, (timeleft / totaltime) * 100)) : 0;

  const minutes = Math.floor(timeleft / 60);
  const seconds = timeleft % 60;

  const isLowTime = timeleft <= 10;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="h-20 w-20">
        <CircularProgressbar
          value={percentage}
          text={`${minutes}:${String(seconds).padStart(2, "0")}`}
          styles={buildStyles({
            textColor: isLowTime ? "#EF4444" : "#E0E7FF",
            pathColor: isLowTime ? "#EF4444" : "#6366F1",
            trailColor: "#27272A",
            textSize: "20px",
            pathTransitionDuration: 0.5,
          })}
        />
      </div>

      <span
        className={`text-xs font-medium ${
          isLowTime ? "text-red-400" : "text-gray-400"
        }`}
      >
        {isLowTime ? "Time running out" : "Time remaining"}
      </span>
    </div>
  );
};

export default Timer;
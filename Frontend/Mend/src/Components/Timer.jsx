import React, { useEffect, useState } from "react";
import { RotateCcw, Play, Pause } from "lucide-react";

const Timer = ({ breakk, longBreak, pomodoro }) => {
  const [running, setRunning] = useState(false);
  const [timeEnded, setTimeEnded] = useState(false);
  const [second, setSecond] = useState(0);
  const [minute, setMinute] = useState(25);

  // Reset timer based on mode (Pomodoro, Break, Long Break)
  useEffect(() => {
    if (breakk) {
      setMinute(5);
      setSecond(0);
    } else if (pomodoro) {
      setMinute(25);
      setSecond(0);
    } else if (longBreak) {
      setMinute(15);
      setSecond(0);
    }
    setRunning(false); // Pause the timer when mode changes
    setTimeEnded(false); // Reset time-ended state
  }, [breakk, longBreak, pomodoro]);

  // Timer logic
  useEffect(() => {
    if (running) {
      const interval = setInterval(() => {
        setSecond((prev) => {
          if (prev === 0) {
            if (minute === 0) {
              clearInterval(interval);
              setTimeEnded(true);
              setRunning(false);
              return 0;
            }
            setMinute((prevMinute) => prevMinute - 1);
            return 59;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [running, second, minute]);

  // Reset timer
  const resetTimer = () => {
    setRunning(false);
    setTimeEnded(false);
    if (breakk) {
      setMinute(5);
    } else if (pomodoro) {
      setMinute(25);
    } else if (longBreak) {
      setMinute(15);
    }
    setSecond(0);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Timer Display */}
      <h1 className="text-9xl font-mono font-bold text-gray-800 mb-6">
        {minute.toString().padStart(2, "0")}:
        {second.toString().padStart(2, "0")}
      </h1>

      {/* Start/Stop Button */}
      <div className="flex gap-4">
        <button
          onClick={() => setRunning(!running)}
          className={`flex items-center justify-center w-14 h-14 rounded-full ${
            running
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          } text-white text-2xl font-bold shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer`}
        >
          {running ? <Pause size={25} /> : <Play size={25} />}
        </button> 

        {/* Reset Button */}
        <button
          onClick={resetTimer}
          className="flex items-center justify-center cursor-pointer w-14 h-14 rounded-full bg-gray-500 hover:bg-gray-600 text-white text-2xl font-bold shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      {/* Time Ended Message */}
      {timeEnded && (
        <div className="mt-6 text-2xl font-semibold text-gray-800 animate-pulse">
          Time's up! Take a break.
        </div>
      )}
    </div>
  );
};

export default Timer;

import React, { useState } from "react";
import Task from "../Components/Timer.jsx";

const Pomodoro = () => {
  const [pomodoro, setPomodoro] = useState(true);
  const [breakk, setBreakk] = useState(false);
  const [longBreak, setLongBreak] = useState(false);

  return (
    <div
      className="w-screen h-screen overflow-hidden flex flex-col items-center justify-cente relative"
      style={{
        backgroundImage: "url('/lone-tree.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Title */}
      <h1 className="mt-14 text-center text-white mb-6 text-5xl font-mono font-bold tracking-wide">
        P🍅modoro Timer
      </h1>

      {/* Main Flex Container */}
      <div className="flex flex-col items-center gap-6">
        {/* Timer Box */}
        <div className="w-[460px] h-[320px] bg-gray-100/45 rounded-xl shadow-lg backdrop-blur-sm border border-white/20">
          {/* Mode Switcher */}
          <div className="flex items-center justify-around bg-gray-400/70 rounded-lg m-2 shadow-sm p-1">
            {[
              { label: "Pomodoro", state: pomodoro },
              { label: "Break", state: breakk },
              { label: "Long Break", state: longBreak },
            ].map(({ label, state }, index) => (
              <h1
                key={index}
                onClick={() => {
                  setPomodoro(label === "Pomodoro");
                  setBreakk(label === "Break");
                  setLongBreak(label === "Long Break");
                }}
                className={`cursor-pointer text-lg font-serif rounded-lg px-4 py-1 my-1 transition-all ease-in-out duration-300 ${
                  state
                    ? "bg-white text-gray-800 scale-105 shadow-sm"
                    : "text-white hover:bg-white/30 hover:text-white"
                }`}
              >
                {label}
              </h1>
            ))}
          </div>

          {/* Timer Display */}
          <div className="mt-6">
            <Task pomodoro={pomodoro} breakk={breakk} longBreak={longBreak} />
          </div>
        </div>

        {/* Motivational Text */}
        <p className="text-white text-sm italic opacity-80">
          "Focus on the process, and the results will follow."
        </p>
      </div>

      {/* Spotify Embed - Tucked into Bottom Right Corner */}
      <div className="absolute opacity-90 bottom-16 left-1.5/3  w-[570px] rounded-lg overflow-hidden shadow-xl border border-white/20 backdrop-blur-md">
        <iframe
          style={{ borderRadius: "12px", width: "100%", height: "80px" }}
          src="https://open.spotify.com/embed/playlist/6zQr7gy73XLh6KrNm3OoUb?utm_source=generator"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default Pomodoro;

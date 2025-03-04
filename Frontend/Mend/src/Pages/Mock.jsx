import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SpeachReco from "../Components/SpeachReco";
const Mock = () => {
  return (
    <>
      {/* FLOATING DIVS ---*/}
      {/* <div className="w-screen h-screen">
        <motion.div
          drag
          animate={{ scale: 1.2 }}
          className="h-9 w-9 bg-gray-500"
        ></motion.div>
      </div> */}
      {/* ----- */}
      {/* SPEECH RECO -------*/}

      <div className="w-screen h-screen flex items-center justify-center">
        <SpeachReco />
        <p></p>
      </div>
    </>
  );
};

export default Mock;

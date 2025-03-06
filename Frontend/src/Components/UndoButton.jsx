import React from "react";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

const UndoButton = () => {
  const navigate = useNavigate();
  return (
    <button
      className="absolute py-1 px-3 bg-gray-400 m-5 rounded cursor-pointer  hover:bg-gray-500 transition duration-200 "
      onClick={() => navigate(-1)}
    >
      <FontAwesomeIcon icon={faArrowLeft} /> Back
    </button>
  );
};

export default UndoButton;

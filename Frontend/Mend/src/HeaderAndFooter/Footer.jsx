import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { DarkModeContext } from "../Components/DarkModeContext";

const Footer = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  return (
    <>
      <hr />
      <div
        className={`flex outline justify-around py-3  font-semibold ${
          isDarkMode ? `text-gray-100 bg-gray-400` : ``
        }`}
      >
        <Link>Help Center</Link>
        <Link>Terms of Service</Link>
        <Link>Privacy Policy</Link>
        <Link>Cookie Policy</Link>
        <Link>Accesibility</Link>
        <Link>Careers</Link>
        <Link>Marketing</Link>
        <Link>Developers</Link>
        <Link>Settings</Link>
        <Link>@2022yanliudesign</Link>
      </div>
    </>
  );
};

export default Footer;

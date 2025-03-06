import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { DarkModeContext } from "../Components/DarkModeContext";

const Footer = () => {
  const { isDarkMode } = useContext(DarkModeContext);

  return (
    <footer
      className={`border-t py-4 ${
        isDarkMode ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-700"
      }`}
    >
      <div className="container mx-auto flex flex-wrap justify-center gap-6 text-sm">
        <Link to="#" className="hover:underline">
          Help Center
        </Link>
        <Link to="#" className="hover:underline">
          Terms of Service
        </Link>
        <Link to="#" className="hover:underline">
          Privacy Policy
        </Link>
        <Link to="#" className="hover:underline">
          Cookie Policy
        </Link>
        <Link to="#" className="hover:underline">
          Accessibility
        </Link>
        <Link to="#" className="hover:underline">
          Careers
        </Link>
        <Link to="#" className="hover:underline">
          Marketing
        </Link>
        <Link to="#" className="hover:underline">
          Developers
        </Link>
        <Link to="#" className="hover:underline">
          Settings
        </Link>
      </div>

      <p className="text-center text-xs mt-4 opacity-75">
        &copy; {new Date().getFullYear()} Yan Liu Design. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;

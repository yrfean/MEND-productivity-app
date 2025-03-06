import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProfilePopup from "../Components/profilePopup";
import { DarkModeContext } from "../Components/DarkModeContext";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Header = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [values, setValues] = useState(null);
  const { isDarkMode } = useContext(DarkModeContext);

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
  };

  // FETCH Dp
  const fetchData = async () => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    try {
      const response = await axios.get(`${backendUrl}/getUser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setValues(response.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div
      className={`flex items-center justify-around p-4 shadow-md  font-bold ${
        isDarkMode ? `bg-gray-500` : `bg-gray-100`
      }`}
    >
      {/* Logo */}
      <h1
        className={`text-3xl font-bold cursor-crosshair ${
          isDarkMode ? `text-gray-100` : `text-gray-900`
        }`}
      >
        MEND
      </h1>

      {/* Navigation Links */}
      <nav className="flex items-center gap-16">
        <Link
          to="/"
          className={`transition-colors ${
            isDarkMode
              ? "text-gray-100 hover:opacity-80"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          Home
        </Link>
        <Link
          to="/pomodoro"
          className={`transition-colors ${
            isDarkMode
              ? "text-gray-100 hover:opacity-80"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          P🍅modoro
        </Link>
        <Link
          to="/login"
          onClick={handleLogout}
          className={`transition-colors ${
            isDarkMode
              ? "text-gray-100 hover:opacity-80"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          Logout
        </Link>

        {/* Profile Picture + Popup */}
        <div
          className="relative rounded-full shadow-sm" 
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className="w-8 h-8 cursor-pointer rounded-full overflow-hidden"
            onClick={() => navigate("/profile")}
          >
            <img
              className="object-cover w-full h-full"
              src={
                values?.image
                  ? values.image
                  : "https://imgs.search.brave.com/v2Gb7I7OqiHRVTwH6nfcmHY_Ow-ot6gkoWSYNsQAuMo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzlmLzE2/LzcyLzlmMTY3Mjcx/MGNiYTZiY2IwZGZk/OTMyMDFjNmQ0YzAw/LmpwZw"
              }
              alt="Profile"
            />
          </div>

          {isHovered && (
            <div
              className={`absolute top-12 right-0 shadow-lg border rounded-md p-3 z-50 ${
                isDarkMode ? `bg-gray-300` : `bg-white`
              }`}
            >
              <ProfilePopup />
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Header;

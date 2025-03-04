import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import ProfilePopup from "../Components/profilePopup";
import axios from "axios";
import { DarkModeContext } from "../Components/DarkModeContext";

const Header = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [values, setValues] = useState(null);
  const { isDarkMode } = useContext(DarkModeContext);

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
  };

  // FETCH
  const fetchData = async () => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:3000/getUser", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(response.data);
      const image = response.data.data;
      setValues(image);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div
        className={`flex items-center justify-around p-4 shadow-md font-bold ${
          isDarkMode ? `bg-gray-500` : `bg-gray-100 `
        }`}
      >
        <div>
          <h1
            className={`text-3xl font-bold cursor-crosshair ${
              isDarkMode ? `text-gray-100` : ``
            }`}
          >
            MEND
          </h1>
        </div>
        <nav className="flex items-center gap-19">
          <Link
            to="/"
            className={
              isDarkMode
                ? "text-gray-100 hover:opacity-80"
                : "text-gray-500 hover:text-gray-800"
            }
          >
            Home
          </Link>
          <Link
            to="/about"
            className={
              isDarkMode
                ? "text-gray-100 hover:opacity-80"
                : "text-gray-500 hover:text-gray-800"
            }
          >
            About
          </Link>

          <Link
            to="/login"
            onClick={() => handleLogout()}
            className={
              isDarkMode
                ? "text-gray-100 hover:opacity-80"
                : "text-gray-500 hover:text-gray-800"
            }
          >
            Logout
          </Link>
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div
              className="relative flex flex-col items-center w-7 h-7 cursor-pointer rounded-full "
              onClick={() => navigate("/profile")}
            >
              <img
                className="object-cover w-full h-full rounded-full"
                src={
                  values?.image
                    ? values.image
                    : "https://imgs.search.brave.com/v2Gb7I7OqiHRVTwH6nfcmHY_Ow-ot6gkoWSYNsQAuMo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzlmLzE2/LzcyLzlmMTY3Mjcx/MGNiYTZiY2IwZGZk/OTMyMDFjNmQ0YzAw/LmpwZw"
                }
                alt=""
              />

              {isHovered && (
                <div
                  className={`absolute top-10 right-0 shadow-lg border rounded-md p-3 z-50 ${
                    isDarkMode ? `bg-gray-300` : `bg-white`
                  }`}
                >
                  <ProfilePopup />
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Header;

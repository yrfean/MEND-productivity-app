import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { DarkModeContext } from "./DarkModeContext";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const ProfilePopup = () => {
  const [values, setValues] = useState(null);
  const { isDarkMode } = useContext(DarkModeContext);

  // Fetch user data
  const fetchData = async () => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    try {
      const response = await axios.get(`${backendUrl}/getUser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const user = response.data.data;
      setValues(user); // Set user data to state
    } catch (err) {
      console.error(err);
      console.log(err.response?.data);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data on component mount
  }, []);

  return (
    <div
      className={`flex flex-col items-center p-4 w-[350px] rounded-lg shadow-lg border ${
        isDarkMode ? `bg-gray-500` : `bg-white border-gray-200`
      }`}
    >
      {/* Profile Picture */}
      <img
        className="w-[150px] h-[150px] rounded-full object-cover border-4 border-gray-300 mb-4"
        src={
          values?.image ||
          "https://imgs.search.brave.com/v2Gb7I7OqiHRVTwH6nfcmHY_Ow-ot6gkoWSYNsQAuMo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzlmLzE2/LzcyLzlmMTY3Mjcx/MGNiYTZiY2IwZGZk/OTMyMDFjNmQ0YzAw/LmpwZw"
        }
        alt="Profile"
      />

      {/* Username */}
      <h1
        className={`text-xl font-semibold  ${
          isDarkMode ? `text-gray-100` : `text-gray-800`
        }`}
      >
        {values?.userName || "Loading..."}
      </h1>

      {/* Email */}
      <h3
        className={`font-light mt-1 ${
          isDarkMode ? `text-gray-300` : `text-gray-500 `
        }`}
      >
        {values?.email || "Email not available"}
      </h3>

      {/* additional info */}
      <h1 className="mt-4 text-center font-medium">
        press instead of hovering to edit profile
      </h1>
    </div>
  );
};

export default ProfilePopup;

import axios from "axios";
import React, { useEffect, useState, useRef, useContext } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import CustomInput from "../Components/Input";
import { faUserPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DarkModeContext } from "../Components/DarkModeContext";
import UndoButton from "../Components/UndoButton";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const validationSchema = yup.object({
  email: yup.string().email().required("user need to confirm his email"),
  userName: yup.string().required("user must enter a username"),
  password: yup
    .string()
    .required("user also must have a password")
    .min(6, "min 6 or go home!")
    .matches(/[A-Z]/, "min one caps or go home!")
    .matches(/[a-z]/, "min one smalls or go home!")
    .matches(/[0-9]/, "min one numbers or go home!"),
});

const Profile = () => {
  const [user, setUser] = useState(null);
  const inputRef = useRef(null);
  const formData = new FormData();
  const [newDp, setNewDp] = useState(null);
  const { isDarkMode } = useContext(DarkModeContext);

  const formik = useFormik({
    initialValues: {
      email: "",
      userName: "",
      password: "",
    },
    validationSchema,
    onSubmit: (values) => {
      updateProfile(values);
    },
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    // const imageExtensions = ["image/jpg", "image/gif", "image/png"];
    // if (!imageExtensions.includes(selectedFile.type)) {
    //   alert("select proper image");
    // }

    if (selectedFile.size > 10 * 1024 * 1024) {
      alert("must be less thn 5mb");
    }
    sendImage(selectedFile);
  };

  // UPLOADING IMAGE

  const sendImage = async (selectedFile) => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    formData.delete("image");
    formData.append("image", selectedFile);
    try {
      const response = await axios.post(`${backendUrl}/updateImage`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("image upload successful:", response.data);
      setNewDp(response.data.user.image);
    } catch (error) {
      console.error("Error uploading image:", error);
      console.log(error.response?.data);
    }
  };

  // UPDATING PROFILE

  const updateProfile = async (values) => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    try {
      const response = await axios.put(`${backendUrl}/updateProfile`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error uploading profile:", error);
      console.log(error.response?.data);
    }
  };

  // fetch
  const fetchData = async () => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    try {
      const response = await axios.get(`${backendUrl}/getUser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userData = response.data.data;
      setUser(userData);
      setNewDp(userData.image);
      // setNewDp(`http://localhost:3000${userData.image}`);
      formik.setValues({
        email: userData.email,
        userName: userData.userName,
        password: "",
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500 text-xl">
        Loading profile editing page...
      </div>
    );
  }

  return (
    <>
      <UndoButton />
      <div
        className={`h-screen flex items-center justify-center ${
          isDarkMode ? `bg-gray-300` : ` bg-gray-100`
        }`}
      >
        <div
          className={`shadow-lg rounded-lg p-8 pt-5 flex flex-col items-center w-[460px] ${
            isDarkMode ? `bg-gray-400 text-white` : `bg-white`
          }`}
        >
          <h1 className="text-2xl mb-4 font-semibold font-sans">
            EDIT YOUR PROFILE
          </h1>

          {/* UPLOAD PROFILE PICTURE */}

          <div
            className="w-53 h-52 rounded-full overflow-hidden relative border-4 border-gray-500 cursor-pointer group"
            onClick={() => inputRef.current.click()}
          >
            <img
              className="w-full h-full object-cover"
              src={
                newDp
                  ? newDp
                  : "https://imgs.search.brave.com/v2Gb7I7OqiHRVTwH6nfcmHY_Ow-ot6gkoWSYNsQAuMo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzlmLzE2/LzcyLzlmMTY3Mjcx/MGNiYTZiY2IwZGZk/OTMyMDFjNmQ0YzAw/LmpwZw"
              }
              alt="Profile"
            />

            {/* overlay div */}

            <div className="opacity-0 bg-black absolute inset-0 flex items-center justify-center group-hover:opacity-30 transition duration-300">
              <FontAwesomeIcon
                icon={faUserPen}
                className="text-3xl text-white opacity-100"
              />
            </div>
          </div>
          <h1 className="mb-6 opacity-30">press the dp to change it</h1>

          {/* HIDDEN INPUT WITH REFERENCE */}
          <input
            type="file"
            accept="image/*"
            ref={inputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          {/* User Details */}
          <h1 className="mb-2 font-semibold">
            Change your username and password
          </h1>
          <form
            className="w-full"
            onSubmit={(event) => {
              event.preventDefault();
              formik.handleSubmit();
            }}
          >
            <CustomInput
              name="email"
              formik={formik}
              holder={"enter your current email..."}
            />
            <CustomInput
              name="userName"
              formik={formik}
              holder={"new username..."}
            />
            <CustomInput
              name="password"
              formik={formik}
              holder={"new password..."}
              type={"password"}
            />
            <button className="w-full outline rounded h-10 mt-3 text-white font-semibold bg-gray-500 hover:bg-gray-800 cursor-pointer">
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Profile;

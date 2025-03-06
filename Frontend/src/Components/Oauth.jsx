import React, { useEffect, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
const backendUrl = import.meta.env.VITE_BACKEND_URL;


const Oauth = ({ rememberMeChecked }) => {
  const [values, setValues] = useState({ email: "", name: "" });
  const navigate = useNavigate();

  const passValues = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/googleSignin`,
        values
      );
      console.log("Login Succesfull", response.data);
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      if (rememberMeChecked) {
        localStorage.setItem("token", response.data.token); // Store tokEn in localStorage
      } else {
        sessionStorage.setItem("token", response.data.token); // Store token IN sessionStorage
      }
      navigate("/");
      //   console.log(sessionStorage.getItem("token"));
    } catch (error) {
      console.error(
        "Error during Google Sign-In:",
        error.response?.data || error.message
      );
      if (error.response?.status === 400) {
        alert("Im sorry bro admin doesnt like you");
      }
    }
  };
  useEffect(() => {
    if (values.email && values.name) {
      passValues();
    }
  }, [values]);
  return (
    <>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          const credentialResponseDecoded = jwtDecode(
            credentialResponse.credential
          );
          // console.log(credentialResponseDecoded);
          const { email, name } = credentialResponseDecoded;
          setValues({ email, name });
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
    </>
  );
};

export default Oauth;

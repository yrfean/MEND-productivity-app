import React, { useEffect, useState } from "react";
import CustomInput from "../Components/Input";
import { useFormik } from "formik";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Oauth from "../Components/Oauth";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const validationSchema = yup.object({
  email: yup
    .string()
    .email("email must be email😤")
    .required("no email no entry!!😤🔫"),
  password: yup
    .string()
    .min(6, "min 6 or go home!😤🔫")
    .matches(/[A-Z]/, "min one caps or go home!😤🔫")
    .matches(/[a-z]/, "min one smalls or go home!😤🔫")
    .matches(/[0-9]/, "min one numbers or go home!😤🔫")
    .required("if u dont have pass,how will u login?"),
});

const Login = () => {
  const navigate = useNavigate();
  const [rememberMeChecked, setRememberMeChecked] = useState(false);
  const [quote, setQuote] = useState([]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post(`${backendUrl}/login`, values);
        // console.log("Login Succesfull", response.data);
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        if (rememberMeChecked) {
          localStorage.setItem("token", response.data.token); // Store tokEn in localStorage
        } else {
          sessionStorage.setItem("token", response.data.token); // Store token IN sessionStorage
        }
        if (response.data.role === "admin") {
          navigate("/adminHome");
        }
        if (response.data.role === "user") {
          navigate("/");
        }
      } catch (error) {
        console.log("Login Failed", error.message);
        alert("user not found");
      }
    },
  });

  const fetchedQuotes = async () => {
    const response = await axios.get(`${backendUrl}/fetchQuotes`);
    // console.log(response.data.length);
    const index = Math.floor(Math.random() * response.data.length);
    // console.log(index);
    setQuote(response.data[index]);
  };
  // console.log(quote);

  useEffect(() => {
    fetchedQuotes();
  }, []);

  return (
    <>
      <div className="flex gap-16 items-center justify-center h-screen w-screen bg-center bg-cover bg-[url('https://img.freepik.com/free-vector/gradient-white-background-wavy-lines_79603-2167.jpg?t=st=1739369300~exp=1739372900~hmac=2aa5bdfc5be9c1e65a3600cb8ab5b4fa84e7cea21c85e06508102ba29f609fca&w=1380')]">
        <div className="w-lg max-w-[510px] pr-6 flex flex-col justify-cente mb-10 text-white p-8">
          <div className="mb-9 flex items-center space-x-1">
            <h2
              className="text-6xl font-bold tracking-widest  opacity-100"
              style={{ textShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)" }}
            >
              MEND
            </h2>
            <div className="w-60 h-[3px] bg-gray-600 mt-4"></div>
          </div>

          {/* Quote */}
          <h1 className="text-3xl text-gray-600 font-semibold tracking-tight leading-snug">
            “{quote.q ? quote.q : "Your insparation for today incoming"}”
            <span className="block text-gray-400 text-lg mt- text-right">
              — {quote.a ? quote.a : "yrfeaan"}
            </span>
          </h1>
        </div>

        <div className="w-[490px] shadow">
          <form
            className="w-full bg-white p-6 rounded "
            onSubmit={formik.handleSubmit}
          >
            <div className="mb-9 ">
              <h1 className="text-4xl font-semibold font-sans mb-2">Login</h1>
              <p className="opacity-55">
                Welcome back! please login to your account:)
              </p>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="opacity-65">
                Enter your email{" "}
              </label>
              <CustomInput name="email" formik={formik} type={"email"} />
            </div>
            {/* Password */}
            <div>
              <label htmlFor="password" className="opacity-65">
                Enter your password
              </label>

              <CustomInput
                tip="login"
                name="password"
                type={"password"}
                formik={formik}
              />
            </div>
            <div className="flex justify-between mb-3">
              <label className="flex items-center gap-2 w-fit cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMeChecked}
                  onChange={() => setRememberMeChecked(!rememberMeChecked)}
                  className="accent-gray-400 mt-1  cursor-pointer"
                />
                Remember me
              </label>
              <div>
                <Link className="text-gray-600 underline" to="/forgotPassword">
                  Forgot Password?
                </Link>
              </div>
            </div>
            <div className="w-full flex items-center justify-center">
              <button className="bg-gray-400 w-full py-2 rounded cursor-pointer">
                Log-in
              </button>
            </div>

            <div className="w-full gap-4 mt-4 flex items-center justify-center">
              <p className="opacity-60">Or continue with</p>
              <Oauth rememberMeChecked={rememberMeChecked} />
            </div>

            <div className="flex gap-2 mt-6">
              <p>New user?</p>
              <Link className="text-gray-600 underline" to="/signup">
                Create Acount
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;

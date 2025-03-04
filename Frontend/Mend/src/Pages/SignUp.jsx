import { useFormik } from "formik";
import React, { useState } from "react";
import * as yup from "yup";
import CustomInput from "../Components/Input";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const validationSchema = yup.object({
  userName: yup
    .string()
    .min(3, "wat kind of name is that!")
    .max(20, "wat kind of name is that!")
    .required("a person without name?"),
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
  confirmPassword: yup
    .string()
    .oneOf(
      [yup.ref("password"), null],
      "uxcpect to go without matching pass?🔫"
    )
    .required("confirming is also must🤨"),
});

const SignUp = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: {
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          "http://localhost:3000/signup",
          values
        );
        console.log(response.data);
        localStorage.setItem("token", response.data.token);
        // localStorage.setItem("_id");
        navigate("/");
      } catch (error) {
        if (error.response) {
          setError(error.response.data.message || "something else");
        } else {
          setError("internal server error");
        }
      }
    },
  });

  return (
    <>
      <div className="h-screen flex items-center justify-center bg-gray-100 relative">
        {error && (
          <div className="absolute top-20 bg-white shadow-lg border-l-4 border-red-500 rounded-lg px-4 py-3 flex flex-col items-center w-[90%] max-w-sm transition-opacity duration-300">
            <h1 className="text-lg font-semibold text-red-600 mb-2">
              ⚠️ {error}
            </h1>
            <button
              className="text-white bg-red-500 hover:bg-red-600 transition duration-200 px-4 py-1 rounded-md"
              onClick={() => setError("")}
            >
              Okay
            </button>
          </div>
        )}

        <form
          onSubmit={formik.handleSubmit}
          className=" shadow rounded px-8 py-4 mx-64 w-dvw flex flex-col bg-center bg-cover bg-[url('https://img.freepik.com/free-vector/gradient-white-background-wavy-lines_79603-2167.jpg?t=st=1739369300~exp=1739372900~hmac=2aa5bdfc5be9c1e65a3600cb8ab5b4fa84e7cea21c85e06508102ba29f609fca&w=1380')]"
        >
          <h1 className="text-center text-4xl font-serife m-3 tracking-wide">
            Create an account
          </h1>
          <div className="w-full flex items-center justify-center mb-8">
            <span>Already have an account?</span>{" "}
            <Link className="text-gray-500" to="/login">
              Log-in
            </Link>
          </div>

          {/* Username */}

          <div>
            <label htmlFor="Userame" className=" font-light opacity-65 p-1">
              What should we call you?
            </label>
            <CustomInput name="userName" type="text" formik={formik} />
          </div>

          {/* Email */}

          <div>
            <label htmlFor="email" className=" font-light opacity-65 p-1">
              What is your email?
            </label>
            <CustomInput name="email" type="emai l" formik={formik} />
          </div>

          {/* Password */}

          <div>
            <label htmlFor="password" className=" font-light opacity-65 p-1">
              Create a password
            </label>
            <CustomInput
              name="password"
              tip={"signup"}
              type="password"
              formik={formik}
            />
          </div>

          {/* Confirm Password */}

          <div>
            <label
              htmlFor="confirmPassword"
              className=" font-light opacity-85 p-1"
            >
              Confirm that password
            </label>
            <CustomInput
              name="confirmPassword"
              type="password"
              formik={formik}
            />
          </div>

          <div className="w-full flex flex-col justify-center mt-8 gap-2">
            <p>
              By creating an account,you agree to our{" "}
              <span className="underline text-gray-500">Terms of use </span>
              and{" "}
              <span className="underline text-gray-500">Privacy Policy</span>
            </p>
            <button
              type="submit"
              className="bg-gray-500 text-white px-4 py-2 rounded w-full cursor-pointer"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default SignUp;

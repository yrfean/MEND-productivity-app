import React from "react";
import CustomInput from "../Components/Input";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
  confirmPassword: yup
    .string()
    .oneOf(
      [yup.ref("password"), null],
      "uxcpect to go without matching pass?🔫"
    )
    .required("confirming is also must🤨"),
});

const ForgotPassword = () => {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          "http://localhost:3000/forgotPassword",
          values
        );
        console.log(response.data);
        // localStorage.setItem("token", response.data.token);
        // localStorage.setItem("_id");
        navigate("/");
      } catch (error) {
        if (error.response) {
          if (error.response.status === 404) {
            alert("No such user found! 😤🔫");
          }
        } else {
          console.log("internal server error");
        }
      }
    },
  });

  return (
    <>
      <div className="w-screen h-screen flex items-center justify-center">
        <form
          onSubmit={formik.handleSubmit}
          className="w-[400px] px-9 py-4 bg-gray-400 rounded"
        >
          <h1 className="text-2xl text-center mb-5">Change your password</h1>
          <CustomInput
            formik={formik}
            name={"email"}
            type={"email"}
            holder={"Email"}
          />
          <CustomInput
            formik={formik}
            name={"password"}
            type={"password"}
            holder={"New Password"}
          />
          <CustomInput
            formik={formik}
            name={"confirmPassword"}
            type={"password"}
            holder={"Confirm Password"}
          />
          <button
            type="submit"
            className="w-full py-2 rounded cursor-pointer hover:opacity-80 bg-white my-2"
          >
            Change
          </button>
        </form>
      </div>
    </>
  );
};

export default ForgotPassword;

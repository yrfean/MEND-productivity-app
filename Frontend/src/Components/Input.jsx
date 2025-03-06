import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";


const CustomInput = ({ name, type, formik, tip, holder }) => {
  // console.log();
  const [showPass, setShowPass] = useState(false);
  const isTypePass = type === "password";
  const isTipSingup = tip === "signup";
  const isTipLogin = tip === "login";
  const hasError = formik.touched[name] && formik.errors[name];
  return (
    <>
      <div className="mb-1 mt-1">
        <div className="relative">
          <input
            name={name}
            className={`outline-dashed outline-1 rounded w-full py-1 px-1 ${
              hasError ? "outline-red-800" : ""
            }`}
            type={isTypePass ? (showPass ? "text" : "password") : type}
            placeholder={
              isTipLogin
                ? "must be caps,smalls and numbers"
                : isTipSingup
                ? "password must contain a number,capitals and small letters"
                : holder
            }
            value={formik.values[name]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {isTypePass && (
            <button
              type="button"
              onClick={() => {
                if (!formik.values[name]) {
                  formik.setFieldTouched(name, true, false);
                  formik.setFieldError(name, "bro type some pass Firrst🥲");
                } else {
                  setShowPass((prev) => !prev);
                }
              }}
              className="absolute top-1 right-1 cursor-pointer"
            >
              {showPass ? "🙈" : "👁️"}
            </button>
          )}
        </div>
        <div className="h-4 p-1 text-red-500 text-sm flex items-center">
          {hasError ? formik.errors[name] : ""}
        </div>
      </div>
    </>
  );
};

export default CustomInput;

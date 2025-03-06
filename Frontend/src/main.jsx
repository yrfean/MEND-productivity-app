import "regenerator-runtime/runtime";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { Outlet, RouterProvider } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="254062853058-5t82c9dka8e04jd7fdsbke1i70c470hd.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);

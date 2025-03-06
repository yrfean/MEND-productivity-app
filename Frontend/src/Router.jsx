import { createBrowserRouter, Outlet } from "react-router-dom";
import Body from "./Pages/Body";
import Header from "./HeaderAndFooter/Header";
import Footer from "./HeaderAndFooter/Footer";
import Error from "./HeaderAndFooter/Error";
import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";
import Profile from "./Pages/profile";
import ProtectedRoute from "./Components/protectedRoute";
import { useEffect, useState } from "react";
import Mock from "./Pages/Mock";
import ForgotPassword from "./Pages/ForgotPassword";
import AdminHome from "./Pages/AdminHome";
import Pomodoro from "./Pages/Pomodoro";

const AppLayout = () => {
  return (
    <>
      <div className="flex flex-col w-screen overflow-x-hidden min-h-screen">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
};

const Router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    errorElement: <Error />,
    children: [{ path: "/", element: <Body /> }],
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forgotPassword",
    element: <ForgotPassword />,
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/mock",
    element: <Mock />,
  },
  {
    path: "/adminHome",
    element: <AdminHome />,
  },
  {
    path: "/pomodoro",
    element: <Pomodoro />,
  },
]);
export { Router };

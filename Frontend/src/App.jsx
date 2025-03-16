import { useState } from "react";
import { RouterProvider } from "react-router-dom";
import { Router } from "./Router";
import DarkModeProvider from "./Components/DarkModeContext";

function App() {
  

  return (
    <>
      <DarkModeProvider>
        <RouterProvider router={Router} />
      </DarkModeProvider>
    </>
  );
}

export default App;

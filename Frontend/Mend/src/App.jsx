import { useState } from "react";
import { RouterProvider } from "react-router-dom";
import { Router } from "./Router";
import DarkModeProvider from "./Components/DarkModeContext";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <DarkModeProvider>
        <RouterProvider router={Router} />
      </DarkModeProvider>
    </>
  );
}

export default App;

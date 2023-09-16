import React from "react";
import Chat from "./view/Chat";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./view/Home";
import "./App.css";
import { AlertContextProvider } from "./context/AlertContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/chat",
    element: <Chat />,
  },
]);

export default function App() {
  return (
    <div className="App">
      <AlertContextProvider>
        <RouterProvider router={router} />
      </AlertContextProvider>
    </div>
  );
}

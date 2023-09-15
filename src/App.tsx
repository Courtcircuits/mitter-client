import React from "react";  
import Chat from "./view/Chat";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./view/Home";
import "./App.css"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>
  },
  {
    path: "/chat",
    element: <Chat/>
  }
])

export default function App() {
  return (
    <div className="App">
      <RouterProvider router={router}/>
    </div>
  );
}

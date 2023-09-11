import React from "react";
import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./view/Home";
import { AlertContextProvider } from "./context/AlertContext";
import Alert from "./component/Alert";
import Chat from "./view/Chat";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/chat",
    element: <Chat />,
  }
]);

function App() {
  return (
    <div className="App">
      <AlertContextProvider>
        <Alert />
        <React.StrictMode>
          <RouterProvider router={router} />
        </React.StrictMode>
      </AlertContextProvider>
    </div>
  );
}

export default App;

import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/signin-page";
import Register from "./pages/signup-page";
import Dashboard from "./pages/dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/signup",
    element: <Register />
  },
  {
    path: "/dashboard",
    element: <Dashboard />
  }
]);

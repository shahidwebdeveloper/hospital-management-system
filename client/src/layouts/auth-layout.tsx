import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div>
        <h1>Hospital Management System</h1>

        <Outlet />
      </div>
    </div>
  );
}

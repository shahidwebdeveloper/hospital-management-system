import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div>
      <header
        style={{
          padding: "20px",
          background: "#2563eb",
          color: "white"
        }}
      >
        <h2>Hospital Management System</h2>
      </header>

      <main
        style={{
          padding: "20px"
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}

import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@hms/contracts": path.resolve(__dirname, "../contracts/src")
    }
  },
  server: {
    port: 5173
  }
});

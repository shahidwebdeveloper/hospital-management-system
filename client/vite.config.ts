import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

const authBase = process.env.VITE_AUTH_BASE_URL || "http://localhost:5000";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@hms/contracts": path.resolve(__dirname, "../contracts/dist/index.js")
    }
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: authBase,
        changeOrigin: true,
        secure: false
      }
    }
  }
});

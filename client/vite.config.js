import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // proxy API calls to Express during development so we don't hit CORS issues
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
});

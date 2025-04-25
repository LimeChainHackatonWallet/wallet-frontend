import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "/manifest.json": path.resolve(__dirname, "./public/manifest.json"),
      "/payment-manifest.json": path.resolve(__dirname, "./public/payment-manifest.json"),
      "/sw.js": path.resolve(__dirname, "./public/sw.js"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    headers: {
      "Link": "<http://localhost:5173/payment-manifest.json>; rel=payment-method-manifest"
    }
  }
});

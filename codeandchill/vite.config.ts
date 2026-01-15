import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    watch: {
      // Ignore sibling backend folders and temporary upload folders which can
      // be written by the backend process. Prevents Vite from picking up those
      // file changes and triggering HMR/full page reloads.
      ignored: [
        "../Backend/**",
        "../Backend/**/temp/**",
        "../Backend/**/uploads/**",
      ],
    },
  },
});

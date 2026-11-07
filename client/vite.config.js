import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Сервер Apple не дозволяє запити з іншого джерела (CORS), тому під час розробки запити на /charts-api пересилаються через локальний сервер Vite.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/charts-api": {
        target: "https://rss.marketingtools.apple.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/charts-api/, ""),
      },
    },
  },
});
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Проєкт запускається через сервер (папка server): він же рендерить React на стороні сервера.
export default defineConfig({
  plugins: [react()],
});

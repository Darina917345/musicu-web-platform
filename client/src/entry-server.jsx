import { renderToString } from "react-dom/server";
import Root from "./Root.jsx";

// Викликається сервером: повертає готовий HTML сторінки
export function render(state) {
  return renderToString(<Root {...state} />);
}

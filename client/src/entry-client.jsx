import { hydrateRoot } from "react-dom/client";
import Root from "./Root.jsx";

// Браузер «оживляє» HTML, який уже згенерував сервер, тими самими даними
hydrateRoot(document.getElementById("root"), <Root {...window.__DATA__} />);

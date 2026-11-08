// Express-сервер MusicU: рендерить React-сторінки на сервері (SSR),
// обробляє форми (POST), віддає дані зі сторінок (GET) і проксує запити до музичного API.
import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer as createViteServer } from "vite";
import { initStorage, loadComments, saveComments } from "./lib/storage.js";
import { registerUser, checkCredentials, createSession, destroySession, getUser, parseCookies } from "./lib/auth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDir = path.join(__dirname, "..", "client");
const PORT = process.env.PORT || 3000;
const CHARTS_TARGET = process.env.CHARTS_TARGET || "https://rss.marketingtools.apple.com";
const PAGE_SIZE = 3;

initStorage();

// Тексти повідомлень за кодами, які передаються у GET-параметрах
const MESSAGES = {
  registered: { type: "success", text: "Реєстрацію завершено. Тепер увійдіть." },
  bad_login: { type: "error", text: "Логін: 3–20 символів, лише латиниця, цифри та _." },
  short_password: { type: "error", text: "Пароль має містити щонайменше 6 символів." },
  login_taken: { type: "error", text: "Такий логін уже зайнятий." },
  bad_credentials: { type: "error", text: "Невірний логін або пароль." },
  login_required: { type: "error", text: "Щоб залишити коментар, потрібно увійти." },
  bad_comment: { type: "error", text: "Введіть коментар (до 500 символів) та оцінку 1–10." },
  comment_added: { type: "success", text: "Коментар додано." },
};
const notice = (code) => MESSAGES[code] || null;

const app = express();
app.use(express.urlencoded({ extended: false }));

// Проксі до зовнішнього музичного API (браузер не може звертатися до нього напряму через CORS)
app.get("/charts-api/*", async (req, res) => {
  try {
    const upstream = await fetch(CHARTS_TARGET + req.originalUrl.replace("/charts-api", ""));
    res.status(upstream.status).type("application/json").send(await upstream.text());
  } catch {
    res.status(502).json({ error: "upstream unavailable" });
  }
});

const vite = await createViteServer({
  root: clientDir,
  configFile: path.join(clientDir, "vite.config.js"),
  server: { middlewareMode: true },
  appType: "custom",
});
app.use(vite.middlewares);

// Тема оформлення залежить від зовнішніх чинників: ?theme= у запиті, cookie, час доби
function resolveTheme(req, res) {
  const asked = req.query.theme;
  if (asked === "dark" || asked === "light") {
    res.append("Set-Cookie", `theme=${asked}; Path=/; Max-Age=31536000`);
    return asked;
  }
  const saved = parseCookies(req.headers.cookie).theme;
  if (saved === "dark" || saved === "light") return saved;
  const hour = new Date().getHours();
  return hour >= 20 || hour < 7 ? "dark" : "light";
}

const serialize = (obj) => JSON.stringify(obj).replace(/</g, "\\u003c");

async function renderPage(req, res, state, title, status = 200) {
  const theme = resolveTheme(req, res);
  let template = fs.readFileSync(path.join(clientDir, "index.html"), "utf-8");
  template = await vite.transformIndexHtml(req.originalUrl, template);
  const { render } = await vite.ssrLoadModule("/src/entry-server.jsx");
  const html = template
    .replace("<!--app-title-->", () => title)
    .replace("<!--body-class-->", () => `theme-${theme}`)
    .replace("<!--ssr-outlet-->", () => render(state))
    .replace("<!--ssr-data-->", () => serialize(state));
  res.status(status).set("Content-Type", "text/html").send(html);
}

const formatDate = (iso) =>
  new Date(iso).toLocaleString("uk-UA", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Kyiv" });

// ---------- Сторінки ----------
app.get("/", (req, res, next) =>
  renderPage(req, res, { page: "charts", user: getUser(req), notice: null, data: {} }, "Топ-чарти").catch(next)
);

app.get("/album", (req, res, next) => {
  const all = loadComments().sort((a, b) => b.id - a.id);
  const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
  const requested = parseInt(req.query.page, 10) || 1;       // номер сторінки приходить у GET-запиті
  const page = Math.min(Math.max(requested, 1), totalPages);
  const comments = all
    .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    .map((c) => ({ ...c, date: formatDate(c.createdAt) }));
  const state = {
    page: "album",
    user: getUser(req),
    notice: notice(req.query.msg),
    data: { comments, page, totalPages },
  };
  renderPage(req, res, state, "Нічне місто").catch(next);
});

app.get("/auth", (req, res, next) =>
  renderPage(req, res, { page: "auth", user: getUser(req), notice: notice(req.query.msg), data: {} }, "Вхід").catch(next)
);

// ---------- Обробка форм (POST) ----------
app.post("/register", (req, res) => {
  const result = registerUser((req.body.login || "").trim(), req.body.password);
  res.redirect(`/auth?msg=${result.ok ? "registered" : result.error}`);
});

app.post("/login", (req, res) => {
  const login = checkCredentials((req.body.login || "").trim(), req.body.password);
  if (!login) return res.redirect("/auth?msg=bad_credentials");
  createSession(res, login);
  res.redirect("/album");
});

app.post("/logout", (req, res) => {
  destroySession(req, res);
  res.redirect("/");
});

app.post("/album/comments", (req, res) => {
  const user = getUser(req);
  if (!user) return res.redirect("/auth?msg=login_required");

  const text = (req.body.text || "").trim();
  const rating = parseInt(req.body.rating, 10);
  if (!text || text.length > 500 || !(rating >= 1 && rating <= 10)) {
    return res.redirect("/album?msg=bad_comment#comments");
  }

  const comments = loadComments();
  const id = comments.reduce((max, c) => Math.max(max, c.id), 0) + 1;
  comments.push({ id, login: user.login, rating, text, createdAt: new Date().toISOString() });
  saveComments(comments);
  res.redirect("/album?page=1&msg=comment_added#comments");
});

// ---------- 404 та помилки ----------
app.use((req, res, next) =>
  renderPage(req, res, { page: "notfound", user: getUser(req), notice: null, data: {} }, "Не знайдено", 404).catch(next)
);
app.use((err, req, res, next) => {
  vite.ssrFixStacktrace(err);
  console.error(err);
  res.status(500).send("Внутрішня помилка сервера");
});

app.listen(PORT, () => console.log(`MusicU: http://localhost:${PORT}`));

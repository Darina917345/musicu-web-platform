// Реєстрація та авторизація: хешування паролів (вбудований crypto) і сесії через cookie
import crypto from "node:crypto";
import { loadUsers, saveUsers } from "./storage.js";

const sessions = new Map(); // token -> login

export function parseCookies(header = "") {
  const out = {};
  header.split(";").forEach((part) => {
    const i = part.indexOf("=");
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  });
  return out;
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(":");
  const test = crypto.scryptSync(password, salt, 64);
  return crypto.timingSafeEqual(test, Buffer.from(hash, "hex"));
}

const LOGIN_RE = /^[A-Za-z0-9_]{3,20}$/;

// Повертає { ok: true } або { ok: false, error: "код помилки" }
export function registerUser(login, password) {
  if (!LOGIN_RE.test(login || "")) return { ok: false, error: "bad_login" };
  if (!password || password.length < 6) return { ok: false, error: "short_password" };
  const users = loadUsers();
  if (users.some((u) => u.login.toLowerCase() === login.toLowerCase())) {
    return { ok: false, error: "login_taken" };
  }
  users.push({ login, passwordHash: hashPassword(password), createdAt: new Date().toISOString() });
  saveUsers(users);
  return { ok: true };
}

export function checkCredentials(login, password) {
  const user = loadUsers().find((u) => u.login.toLowerCase() === (login || "").toLowerCase());
  return !!user && verifyPassword(password || "", user.passwordHash) ? user.login : null;
}

export function createSession(res, login) {
  const token = crypto.randomBytes(24).toString("hex");
  sessions.set(token, login);
  res.append("Set-Cookie", `sid=${token}; HttpOnly; Path=/; SameSite=Lax`);
}

export function destroySession(req, res) {
  const token = parseCookies(req.headers.cookie).sid;
  if (token) sessions.delete(token);
  res.append("Set-Cookie", "sid=; HttpOnly; Path=/; Max-Age=0");
}

export function getUser(req) {
  const token = parseCookies(req.headers.cookie).sid;
  const login = token && sessions.get(token);
  return login ? { login } : null;
}

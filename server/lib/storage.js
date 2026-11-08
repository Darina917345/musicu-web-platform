// Зберігання даних у JSON-файлах на сервері (файлова система)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dataDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "data");

function readJson(name, fallback) {
  try {
    return JSON.parse(fs.readFileSync(path.join(dataDir, name), "utf-8"));
  } catch {
    return fallback;
  }
}

function writeJson(name, value) {
  fs.writeFileSync(path.join(dataDir, name), JSON.stringify(value, null, 2), "utf-8");
}

// Перший запуск: коментарі беремо з comments.seed.json
export function initStorage() {
  if (!fs.existsSync(path.join(dataDir, "comments.json"))) {
    writeJson("comments.json", readJson("comments.seed.json", []));
  }
  if (!fs.existsSync(path.join(dataDir, "users.json"))) {
    writeJson("users.json", []);
  }
}

export const loadUsers = () => readJson("users.json", []);
export const saveUsers = (users) => writeJson("users.json", users);
export const loadComments = () => readJson("comments.json", []);
export const saveComments = (comments) => writeJson("comments.json", comments);

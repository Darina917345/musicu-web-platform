// Запит до зовнішнього музичного API (Apple Music RSS, JSON, без ключа) через проксі Vite (див. vite.config.js).
// Повертає масив альбомів або кидає ApiError з зрозумілим повідомленням.

const BASE_URL = "/charts-api/api/v2";
const TIMEOUT_MS = 10000;

export class ApiError extends Error {}
export class CancelledError extends Error {}

export async function fetchTopAlbums(limit, signal) {
  const url = `${BASE_URL}/us/music/most-played/${limit}/albums.json`;

  // Власний контролер: скасовує запит за таймаутом або коли скасовано зовнішній signal
  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, TIMEOUT_MS);
  if (signal) signal.addEventListener("abort", () => controller.abort());

  let response;
  try {
    response = await fetch(url, { signal: controller.signal });
  } catch (err) {
    if (err.name === "AbortError") {
      if (timedOut) throw new ApiError("Сервер не відповів вчасно. Спробуйте пізніше.");
      throw new CancelledError();
    }
    throw new ApiError("Не вдалося зʼєднатися з сервером. Перевірте інтернет.");
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    throw new ApiError(`Сервер повернув помилку (код ${response.status}).`);
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new ApiError("Отримано некоректну відповідь від сервера.");
  }

  const results = data && data.feed && data.feed.results;
  if (!Array.isArray(results)) {
    throw new ApiError("Отримано некоректні дані від сервера.");
  }

  return results.map((item) => ({
    id: item.id,
    name: item.name,
    artist: item.artistName,
    genre: item.genres && item.genres[0] ? item.genres[0].name : "",
    cover: item.artworkUrl100,
    url: item.url,
  }));
}

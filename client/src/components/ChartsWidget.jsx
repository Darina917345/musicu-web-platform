import { useCallback, useEffect, useRef, useState } from "react";
import { fetchTopAlbums, CancelledError } from "../api/charts.js";
import AlbumCard from "./AlbumCard.jsx";
import Loader from "./Loader.jsx";
import ErrorMessage from "./ErrorMessage.jsx";

// status: "loading" | "success" | "error"
export default function ChartsWidget({ limit }) {
  const [status, setStatus] = useState("loading");
  const [albums, setAlbums] = useState([]);
  const [error, setError] = useState("");

  const busy = useRef(false);        // захист від кількох одночасних запитів
  const controller = useRef(null);

  const load = useCallback(async () => {
    if (busy.current) return;        // запит уже виконується — ігноруємо
    busy.current = true;
    setStatus("loading");

    controller.current = new AbortController();
    try {
      const data = await fetchTopAlbums(limit, controller.current.signal);
      setAlbums(data);
      setStatus("success");
    } catch (err) {
      if (err instanceof CancelledError) return;   // компонент демонтовано
      setError(err.message || "Сталася невідома помилка.");
      setStatus("error");
    } finally {
      busy.current = false;
    }
  }, [limit]);

  useEffect(() => {
    load();
    return () => {
      if (controller.current) controller.current.abort();
      busy.current = false;
    };
  }, [load]);

  const loading = status === "loading";

  return (
    <section>
      <div className="widget-toolbar">
        <button type="button" className="button" onClick={load} disabled={loading}>
          {loading ? "Завантаження…" : "Оновити"}
        </button>
      </div>

      {loading && <Loader count={limit} />}
      {status === "error" && <ErrorMessage message={error} onRetry={load} />}
      {status === "success" && (
        <ul className="cards">
          {albums.map((album, i) => (
            <AlbumCard key={album.id} album={album} rank={i + 1} />
          ))}
        </ul>
      )}
    </section>
  );
}

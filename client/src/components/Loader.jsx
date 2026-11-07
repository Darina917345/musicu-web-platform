// Заглушки-картки, які показуються, поки йде запит
export default function Loader({ count }) {
  const items = Array.from({ length: count });
  return (
    <>
      <p className="widget-status">Завантаження даних…</p>
      <ul className="cards">
        {items.map((_, i) => (
          <li key={i} className="card card--placeholder">
            <div className="placeholder-image" />
            <div className="placeholder-line" />
            <div className="placeholder-line" />
          </li>
        ))}
      </ul>
    </>
  );
}

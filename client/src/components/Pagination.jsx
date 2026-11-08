// Посторінкова навігація: кожне посилання — GET-запит з номером сторінки
export default function Pagination({ page, totalPages, basePath }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <nav className="pagination">
      {page > 1 && <a href={`${basePath}?page=${page - 1}#comments`}>← Назад</a>}
      {pages.map((n) =>
        n === page ? (
          <span key={n} className="pagination__current">{n}</span>
        ) : (
          <a key={n} href={`${basePath}?page=${n}#comments`}>{n}</a>
        )
      )}
      {page < totalPages && <a href={`${basePath}?page=${page + 1}#comments`}>Далі →</a>}
    </nav>
  );
}

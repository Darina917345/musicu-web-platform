// Повідомлення, яке сервер передає після дії (помилка / успіх)
export default function Notice({ notice }) {
  if (!notice) return null;
  return <p className={`message message--${notice.type}`}>{notice.text}</p>;
}

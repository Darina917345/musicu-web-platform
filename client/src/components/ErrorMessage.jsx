export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-box">
      <p>{message}</p>
      <button type="button" className="button button--small" onClick={onRetry}>
        Спробувати ще раз
      </button>
    </div>
  );
}

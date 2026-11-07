export default function Header() {
  return (
    <header className="site-header">
      <div className="container">
        <a href="/">
          <svg className="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 36" width="140" height="36">
            <circle cx="18" cy="18" r="14" fill="#6366F1" />
            <circle cx="18" cy="18" r="5" fill="#fff" />
            <text x="40" y="25" fontFamily="sans-serif" fontSize="22" fontWeight="bold" fill="#212529">MusicU</text>
          </svg>
        </a>
        <nav>
          <ul>
            <li><a href="/" className="active">Чарти</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

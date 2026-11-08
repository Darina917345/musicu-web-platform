export default function Header({ user, page }) {
  const cls = (name) => (page === name ? "active" : undefined);
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
            <li><a href="/" className={cls("charts")}>Чарти</a></li>
            <li><a href="/album" className={cls("album")}>Альбом</a></li>
            {user ? (
              <>
                <li><span className="header-user">Привіт, {user.login}</span></li>
                <li>
                  <form className="logout-form" method="post" action="/logout">
                    <button type="submit" className="button button--small">Вийти</button>
                  </form>
                </li>
              </>
            ) : (
              <li><a href="/auth" className={cls("auth")}>Увійти / Реєстрація</a></li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

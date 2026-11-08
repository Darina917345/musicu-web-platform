import Notice from "../components/Notice.jsx";
import Pagination from "../components/Pagination.jsx";

// data = { comments, page, totalPages } — коментарі сервер бере з файлу comments.json
export default function AlbumPage({ user, notice, data }) {
  const { comments, page, totalPages } = data;
  return (
    <>
      <h1>Нічне місто — Lumen Fox</h1>

      <div className="clearfix">
        <figure className="album-cover">
          <img src="/img/cover1.svg" alt="Обкладинка альбому «Нічне місто»" width="400" height="400" />
          <figcaption>Обкладинка альбому</figcaption>
        </figure>
        <article className="review">
          <h2>Рецензія</h2>
          <p>
            Третій альбом дуету — найцілісніша їхня робота. Холодні синтезатори поєднуються з теплими вокальними
            фрагментами, а структура платівки нагадує нічну прогулянку містом від першого до останнього треку.
          </p>
          <p><strong>Оцінка редакції: 8/10.</strong></p>
        </article>
      </div>

      <h2>Треклист</h2>
      <table className="tracklist">
        <thead>
          <tr><th>№</th><th>Назва</th><th>Тривалість</th></tr>
        </thead>
        <tbody>
          <tr><td>1</td><td>Неон</td><td>3:42</td></tr>
          <tr><td>2</td><td>Остання лінія метро</td><td>4:15</td></tr>
          <tr><td>3</td><td>Дощ на склі</td><td>3:58</td></tr>
          <tr><td>4</td><td>Порожні проспекти</td><td>4:20</td></tr>
          <tr><td>5</td><td>Світанок над Дніпром</td><td>5:01</td></tr>
        </tbody>
      </table>

      <section className="comments" id="comments">
        <h2>Коментарі</h2>
        <Notice notice={notice} />
        {comments.length === 0 && <p>Коментарів ще немає.</p>}
        {comments.map((c) => (
          <article className="comment" key={c.id}>
            <h3>
              {c.login} <span className="rating">{c.rating}/10</span>
            </h3>
            <p>{c.text}</p>
            <p className="comment__date">{c.date}</p>
          </article>
        ))}
        <Pagination page={page} totalPages={totalPages} basePath="/album" />

        <h3>Залишити коментар</h3>
        {user ? (
          <form className="form" method="post" action="/album/comments">
            <p>Ви пишете як <strong>{user.login}</strong>.</p>
            <label htmlFor="c-rating">Оцінка</label>
            <select id="c-rating" name="rating" defaultValue="10">
              {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <label htmlFor="c-text">Коментар</label>
            <textarea id="c-text" name="text" rows="4" maxLength="500" required />
            <button className="button" type="submit">Надіслати</button>
          </form>
        ) : (
          <p>Щоб залишити коментар, <a href="/auth">увійдіть або зареєструйтесь</a>.</p>
        )}
      </section>
    </>
  );
}

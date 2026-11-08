import Notice from "../components/Notice.jsx";

export default function AuthPage({ user, notice }) {
  if (user) {
    return (
      <>
        <h1>Профіль</h1>
        <p>Ви увійшли як <strong>{user.login}</strong>.</p>
      </>
    );
  }
  return (
    <>
      <h1>Вхід і реєстрація</h1>
      <Notice notice={notice} />

      <h2>Вхід</h2>
      <form className="form" method="post" action="/login">
        <label htmlFor="login-login">Логін</label>
        <input type="text" id="login-login" name="login" required />
        <label htmlFor="login-password">Пароль</label>
        <input type="password" id="login-password" name="password" required />
        <button className="button" type="submit">Увійти</button>
      </form>

      <h2>Реєстрація</h2>
      <form className="form" method="post" action="/register">
        <label htmlFor="reg-login">Логін</label>
        <input type="text" id="reg-login" name="login" placeholder="3–20 символів: латиниця, цифри, _" required />
        <label htmlFor="reg-password">Пароль</label>
        <input type="password" id="reg-password" name="password" placeholder="не менше 6 символів" required />
        <button className="button" type="submit">Зареєструватися</button>
      </form>
    </>
  );
}

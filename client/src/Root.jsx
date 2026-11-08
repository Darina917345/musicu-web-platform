import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import ChartsPage from "./pages/ChartsPage.jsx";
import AlbumPage from "./pages/AlbumPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

const PAGES = {
  charts: ChartsPage,
  album: AlbumPage,
  auth: AuthPage,
  notfound: NotFoundPage,
};

// state = { page, user, notice, data } — формується на сервері
export default function Root({ page, user, notice, data }) {
  const Page = PAGES[page] || NotFoundPage;
  return (
    <>
      <Header user={user} page={page} />
      <main id="main" className="container">
        <Page user={user} notice={notice} data={data} />
      </main>
      <Footer />
    </>
  );
}

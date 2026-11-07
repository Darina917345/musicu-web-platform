import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import ChartsWidget from "./components/ChartsWidget.jsx";

export default function App() {
  return (
    <>
      <Header />
      <main id="main" className="container">
        <h1>Топ-чарти</h1>
        <p>Найпопулярніші альбоми зараз — дані отримуємо із зовнішнього музичного API.</p>
        <ChartsWidget limit={8} />
      </main>
      <Footer />
    </>
  );
}

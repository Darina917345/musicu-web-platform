import ChartsWidget from "../components/ChartsWidget.jsx";

export default function ChartsPage() {
  return (
    <>
      <h1>Топ-чарти</h1>
      <p>Найпопулярніші альбоми зараз — дані отримуємо із зовнішнього музичного API.</p>
      <ChartsWidget limit={8} />
    </>
  );
}

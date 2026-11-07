export default function AlbumCard({ album, rank }) {
  // Для якіснішої обкладинки просимо більший розмір; якщо не вийшло — показуємо оригінал
  const bigCover = album.cover ? album.cover.replace(/\d+x\d+bb/, "400x400bb") : "";

  return (
    <li className="card">
      <span className="card__badge">#{rank}</span>
      <a href={album.url} target="_blank" rel="noopener noreferrer">
        <img
          src={bigCover}
          alt={`Обкладинка альбому «${album.name}»`}
          onError={(e) => {
            if (e.currentTarget.src !== album.cover) e.currentTarget.src = album.cover;
          }}
        />
      </a>
      <h3>{album.name}</h3>
      <p>{album.artist}</p>
      {album.genre && <p className="card__genre">{album.genre}</p>}
    </li>
  );
}

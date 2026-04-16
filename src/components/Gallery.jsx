function Gallery({ memes, onDelete, onDownload, onShare }) {
  if (!memes.length) {
    return (
      <div className="gallery-empty">
        <strong>La galerie est vide</strong>
        <p>Sauvegarde un premier mème pour le retrouver ici, même après un rechargement de page.</p>
      </div>
    );
  }

  return (
    <div className="gallery-grid">
      {memes.map((meme) => (
        <article className="gallery-card" key={meme.id}>
          <img src={meme.dataUrl} alt={meme.title} className="gallery-image" />

          <div className="gallery-card-body">
            <div>
              <h3>{meme.title}</h3>
              <p>{new Date(meme.createdAt).toLocaleString('fr-FR')}</p>
            </div>

            <div className="gallery-actions">
              <button type="button" className="button button-secondary" onClick={() => onDownload(meme)}>
                Télécharger
              </button>
              <button type="button" className="button button-secondary" onClick={() => onShare(meme)}>
                Partager
              </button>
              <button type="button" className="button button-danger" onClick={() => onDelete(meme.id)}>
                Supprimer
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export default Gallery;

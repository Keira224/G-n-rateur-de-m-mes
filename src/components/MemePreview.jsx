function MemePreview({
  previewRef,
  imageSrc,
  topText,
  bottomText,
  textColor,
  fontSize,
  fontFamily,
}) {
  const textStyle = {
    color: textColor,
    fontSize: `${fontSize}px`,
    fontFamily,
  };

  if (!imageSrc) {
    return (
      <div className="preview-empty">
        <strong>Aucun mème à afficher pour le moment</strong>
        <p>Commence par importer une image. L’aperçu se mettra à jour automatiquement.</p>
      </div>
    );
  }

  return (
    <div className="preview-stage" ref={previewRef}>
      <img src={imageSrc} alt="Mème en cours de création" className="preview-image" />
      <p className="meme-text meme-text-top" style={textStyle}>
        {topText}
      </p>
      <p className="meme-text meme-text-bottom" style={textStyle}>
        {bottomText}
      </p>
    </div>
  );
}

export default MemePreview;

function MemePreview({
  previewRef,
  imageSrc,
  textMode,
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

  const previewModeClass = textMode === 'outside' ? 'preview-frame-outside' : 'preview-frame-inside';

  if (!imageSrc) {
    return (
      <div className="preview-empty">
        <strong>Aucun mème à afficher pour le moment</strong>
        <p>Commence par importer une image. L’aperçu se mettra à jour automatiquement.</p>
      </div>
    );
  }

  return (
    <div className={`preview-frame ${previewModeClass}`} ref={previewRef}>
      {textMode === 'outside' ? (
        <p className="preview-caption preview-caption-top" style={textStyle}>
          {topText || '\u00A0'}
        </p>
      ) : null}

      <div className="preview-stage">
        <img src={imageSrc} alt="Mème en cours de création" className="preview-image" />

        {textMode === 'inside' ? (
          <>
            <p className="meme-text meme-text-top" style={textStyle}>
              {topText}
            </p>
            <p className="meme-text meme-text-bottom" style={textStyle}>
              {bottomText}
            </p>
          </>
        ) : null}
      </div>

      {textMode === 'outside' ? (
        <p className="preview-caption preview-caption-bottom" style={textStyle}>
          {bottomText || '\u00A0'}
        </p>
      ) : null}
    </div>
  );
}

export default MemePreview;

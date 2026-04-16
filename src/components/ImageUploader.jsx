function ImageUploader({ imageName, hasImage, onError, onImageSelected }) {
  const handleChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      onError('Merci de choisir un fichier image valide.');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onImageSelected({
        dataUrl: reader.result,
        fileName: file.name,
      });
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  return (
    <div className="uploader-card">
      <label className="uploader-dropzone" htmlFor="image-upload">
        <span className="uploader-badge">{hasImage ? 'Image prête' : 'Upload'}</span>
        <strong>Choisir une image depuis l’ordinateur</strong>
        <span>
          Formats acceptés : PNG, JPG, WEBP. L’image est lue localement et n’est pas envoyée à un serveur.
        </span>
        <span className="uploader-action">Parcourir les fichiers</span>
      </label>

      <input
        id="image-upload"
        className="uploader-input"
        type="file"
        accept="image/*"
        onChange={handleChange}
      />

      <div className="uploader-meta">
        <span className="meta-label">Fichier actuel</span>
        <strong>{imageName || 'Aucune image sélectionnée'}</strong>
      </div>
    </div>
  );
}

export default ImageUploader;

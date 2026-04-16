const FONT_OPTIONS = [
  {
    label: 'Impact classique',
    value: 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif',
  },
  {
    label: 'Anton',
    value: '"Anton", Impact, sans-serif',
  },
  {
    label: 'Bangers',
    value: '"Bangers", Impact, sans-serif',
  },
];

function MemeEditor({
  form,
  hasImage,
  isBusy,
  onFieldChange,
  onDownload,
  onSave,
  onReset,
  onShare,
}) {
  return (
    <div className="editor-stack">
      <div className="field-group">
        <label htmlFor="top-text">Texte du haut</label>
        <input
          id="top-text"
          type="text"
          value={form.topText}
          placeholder="Exemple : Quand le build passe enfin"
          onChange={(event) => onFieldChange('topText', event.target.value)}
        />
      </div>

      <div className="field-group">
        <label htmlFor="bottom-text">Texte du bas</label>
        <input
          id="bottom-text"
          type="text"
          value={form.bottomText}
          placeholder="Exemple : après 14 erreurs de syntaxe"
          onChange={(event) => onFieldChange('bottomText', event.target.value)}
        />
      </div>

      <div className="editor-grid">
        <div className="field-group">
          <label htmlFor="text-color">Couleur</label>
          <div className="color-row">
            <input
              id="text-color"
              type="color"
              value={form.textColor}
              onChange={(event) => onFieldChange('textColor', event.target.value)}
            />
            <span>{form.textColor}</span>
          </div>
        </div>

        <div className="field-group">
          <label htmlFor="font-size">Taille du texte</label>
          <div className="range-row">
            <input
              id="font-size"
              type="range"
              min="24"
              max="72"
              step="2"
              value={form.fontSize}
              onChange={(event) => onFieldChange('fontSize', Number(event.target.value))}
            />
            <span>{form.fontSize}px</span>
          </div>
        </div>
      </div>

      <div className="field-group">
        <label htmlFor="font-family">Police</label>
        <select
          id="font-family"
          value={form.fontFamily}
          onChange={(event) => onFieldChange('fontFamily', event.target.value)}
        >
          {FONT_OPTIONS.map((font) => (
            <option key={font.value} value={font.value}>
              {font.label}
            </option>
          ))}
        </select>
      </div>

      <div className="actions-row">
        <button type="button" className="button button-primary" disabled={!hasImage || isBusy} onClick={onDownload}>
          Télécharger
        </button>
        <button type="button" className="button button-secondary" disabled={!hasImage || isBusy} onClick={onSave}>
          Sauvegarder
        </button>
        <button type="button" className="button button-secondary" disabled={!hasImage || isBusy} onClick={onShare}>
          Partager
        </button>
        <button type="button" className="button button-ghost" disabled={isBusy} onClick={onReset}>
          Réinitialiser
        </button>
      </div>
    </div>
  );
}

export default MemeEditor;

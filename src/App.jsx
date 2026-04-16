import { useEffect, useRef, useState } from 'react';
import Gallery from './components/Gallery';
import ImageUploader from './components/ImageUploader';
import MemeEditor from './components/MemeEditor';
import MemePreview from './components/MemePreview';
import { captureElementAsPng, downloadDataUrl, shareDataUrl } from './utils/meme';
import { loadMemes, saveMemes } from './utils/storage';

const DEFAULT_FORM = {
  textMode: 'inside',
  topText: 'Ton idée brillante',
  bottomText: 'quand elle devient un mème',
  textColor: '#ffffff',
  fontSize: 42,
  fontFamily: 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif',
};

function App() {
  const previewRef = useRef(null);
  const [imageSrc, setImageSrc] = useState('');
  const [imageName, setImageName] = useState('');
  const [form, setForm] = useState(DEFAULT_FORM);
  const [gallery, setGallery] = useState(() => loadMemes());
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    if (!feedback.message) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setFeedback({ type: '', message: '' });
    }, 4000);

    return () => window.clearTimeout(timeoutId);
  }, [feedback]);

  const hasImage = Boolean(imageSrc);
  const galleryCount = gallery.length;

  const updateForm = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleImageSelected = ({ dataUrl, fileName }) => {
    setImageSrc(dataUrl);
    setImageName(fileName);
    setFeedback({ type: 'success', message: 'Image chargée. Tu peux maintenant personnaliser le mème.' });
  };

  const handleImageError = (message) => {
    setFeedback({ type: 'error', message });
  };

  const handleReset = () => {
    setImageSrc('');
    setImageName('');
    setForm(DEFAULT_FORM);
    setFeedback({ type: 'info', message: 'L’éditeur a été réinitialisé.' });
  };

  const captureCurrentMeme = async () => {
    if (!previewRef.current || !hasImage) {
      throw new Error('Ajoute d’abord une image avant de générer un mème.');
    }

    return captureElementAsPng(previewRef.current);
  };

  const handleDownload = async () => {
    try {
      setIsBusy(true);
      const dataUrl = await captureCurrentMeme();
      const safeName = (imageName || 'meme').replace(/\.[^.]+$/, '');
      downloadDataUrl(dataUrl, `${safeName}-meme.png`);
      setFeedback({ type: 'success', message: 'Le mème a été téléchargé en PNG.' });
    } catch (error) {
      setFeedback({ type: 'error', message: error.message });
    } finally {
      setIsBusy(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsBusy(true);
      const dataUrl = await captureCurrentMeme();
      const meme = {
        id: crypto.randomUUID(),
        title: form.topText || form.bottomText || imageName || 'Mème sans titre',
        imageName: imageName || 'meme',
        createdAt: new Date().toISOString(),
        dataUrl,
      };

      // On limite la galerie locale pour rester simple et éviter de saturer localStorage.
      const nextGallery = [meme, ...gallery].slice(0, 12);
      setGallery(nextGallery);
      saveMemes(nextGallery);
      setFeedback({ type: 'success', message: 'Le mème a été sauvegardé dans la galerie locale.' });
    } catch (error) {
      setFeedback({ type: 'error', message: error.message });
    } finally {
      setIsBusy(false);
    }
  };

  const handleShareCurrent = async () => {
    try {
      setIsBusy(true);
      const dataUrl = await captureCurrentMeme();
      await shareDataUrl(dataUrl, `${imageName || 'meme'}-share.png`);
      setFeedback({ type: 'success', message: 'Partage lancé depuis le navigateur.' });
    } catch (error) {
      if (error.name === 'AbortError') {
        return;
      }

      setFeedback({
        type: 'error',
        message: error.message || 'Le partage n’est pas disponible sur ce navigateur.',
      });
    } finally {
      setIsBusy(false);
    }
  };

  const handleDeleteMeme = (memeId) => {
    const nextGallery = gallery.filter((meme) => meme.id !== memeId);
    setGallery(nextGallery);
    saveMemes(nextGallery);
    setFeedback({ type: 'info', message: 'Le mème a été supprimé de la galerie.' });
  };

  const handleDownloadSaved = (meme) => {
    downloadDataUrl(meme.dataUrl, `${meme.imageName || 'meme'}-saved.png`);
  };

  const handleShareSaved = async (meme) => {
    try {
      await shareDataUrl(meme.dataUrl, `${meme.imageName || 'meme'}-saved.png`);
      setFeedback({ type: 'success', message: 'Partage lancé depuis la galerie.' });
    } catch (error) {
      if (error.name === 'AbortError') {
        return;
      }

      setFeedback({
        type: 'error',
        message: error.message || 'Le partage n’est pas disponible sur ce navigateur.',
      });
    }
  };

  return (
    <div className="app-shell">
      <div className="background-orb background-orb-left" />
      <div className="background-orb background-orb-right" />

      <header className="site-header">
        <div className="brand-lockup">
          <div className="brand-mark">SM</div>
          <div>
            <strong>Studio Meme Maker</strong>
            <p>Création et gestion de mèmes</p>
          </div>
        </div>

        <nav className="site-nav" aria-label="Navigation principale">
          <a href="#editor">Éditeur</a>
          <a href="#preview">Aperçu</a>
          <a href="#gallery">Galerie</a>
        </nav>

        <div className="site-header-badge">Création rapide</div>
      </header>

      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">Application web</p>
          <h1>Créez et téléchargez vos mèmes simplement.</h1>
          <p className="hero-copy">
            Importez une image, ajoutez votre texte, visualisez le résultat en temps réel,
            puis enregistrez vos créations dans une galerie locale directement depuis le navigateur.
          </p>

          <div className="hero-actions">
            <a className="button button-primary" href="#editor">
              Commencer la création
            </a>
            <a className="button button-ghost hero-link" href="#gallery">
              Voir la galerie
            </a>
          </div>

          <div className="hero-metrics">
            <article className="metric-card">
              <span>Statut</span>
              <strong>{hasImage ? 'Image en cours d’édition' : 'Aucune image chargée'}</strong>
            </article>
            <article className="metric-card">
              <span>Galerie</span>
              <strong>{galleryCount}</strong>
            </article>
            <article className="metric-card">
              <span>Téléchargement</span>
              <strong>Export PNG</strong>
            </article>
          </div>
        </div>

        <div className="hero-showcase">
          <div className="showcase-card showcase-card-primary">
            <span className="showcase-kicker">Fonctionnalités</span>
            <h2>Import, personnalisation et téléchargement</h2>
            <p>Une interface unique pour créer rapidement un mème à partir d’une image locale.</p>
          </div>

          <div className="showcase-grid">
            <div className="showcase-card">
              <span className="showcase-value">Aperçu</span>
              <p>Mise à jour immédiate du rendu pendant la saisie.</p>
            </div>
            <div className="showcase-card">
              <span className="showcase-value">Galerie</span>
              <p>Conservation des mèmes créés dans le navigateur.</p>
            </div>
          </div>
        </div>
      </section>

      {feedback.message ? (
        <div className={`feedback feedback-${feedback.type}`}>{feedback.message}</div>
      ) : null}

      <main className="site-main">
        <section className="section-block" id="editor">
          <div className="section-heading">
            <span className="section-tag">Éditeur</span>
            <h2>Personnalisez votre image</h2>
            <p>
              Utilisez les options à gauche pour modifier le texte et le style, puis
              vérifiez le résultat dans l’aperçu affiché à droite.
            </p>
          </div>

          <div className="workspace">
            <section className="panel panel-controls">
              <div className="panel-header">
                <h2>1. Préparer le mème</h2>
                <p>Charge une image puis modifie les textes et le style.</p>
              </div>

              <ImageUploader
                imageName={imageName}
                hasImage={hasImage}
                onError={handleImageError}
                onImageSelected={handleImageSelected}
              />

              <MemeEditor
                form={form}
                hasImage={hasImage}
                isBusy={isBusy}
                onFieldChange={updateForm}
                onDownload={handleDownload}
                onSave={handleSave}
                onReset={handleReset}
                onShare={handleShareCurrent}
              />
            </section>

            <section className="panel panel-preview" id="preview">
              <div className="panel-header panel-header-inline">
                <div>
                  <h2>2. Aperçu en temps réel</h2>
                  <p>Le texte est appliqué directement sur l’image pour visualiser le rendu final.</p>
                </div>
                <div className="preview-chip">{hasImage ? 'Aperçu disponible' : 'Aucun aperçu'}</div>
              </div>

              <MemePreview
                previewRef={previewRef}
                imageSrc={imageSrc}
                textMode={form.textMode}
                topText={form.topText}
                bottomText={form.bottomText}
                textColor={form.textColor}
                fontSize={form.fontSize}
                fontFamily={form.fontFamily}
              />
            </section>
          </div>
        </section>

        <section className="panel gallery-panel section-block" id="gallery">
          <div className="panel-header panel-header-inline">
            <div>
              <span className="section-tag">Galerie</span>
              <h2>Galerie des créations</h2>
              <p>Les mèmes enregistrés restent disponibles localement pour être consultés ou téléchargés à nouveau.</p>
            </div>
            <div className="gallery-count">{galleryCount} mème{galleryCount > 1 ? 's' : ''}</div>
          </div>

          <Gallery
            memes={gallery}
            onDelete={handleDeleteMeme}
            onDownload={handleDownloadSaved}
            onShare={handleShareSaved}
          />
        </section>
      </main>

      <footer className="site-footer">
        <p>Studio Meme Maker</p>
        <span>Outil de création de mèmes</span>
      </footer>
    </div>
  );
}

export default App;

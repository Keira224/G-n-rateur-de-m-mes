const STORAGE_KEY = 'studio-meme-maker-gallery';

export function loadMemes() {
  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);
    return rawValue ? JSON.parse(rawValue) : [];
  } catch (error) {
    console.error('Impossible de lire localStorage :', error);
    return [];
  }
}

export function saveMemes(memes) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(memes));
  } catch (error) {
    console.error('Impossible de sauvegarder la galerie :', error);
  }
}

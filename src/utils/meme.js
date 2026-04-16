import html2canvas from 'html2canvas';

export async function captureElementAsPng(element) {
  const canvas = await html2canvas(element, {
    backgroundColor: null,
    scale: 2,
    useCORS: true,
  });

  return canvas.toDataURL('image/png');
}

export function downloadDataUrl(dataUrl, fileName) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = fileName;
  link.click();
}

async function dataUrlToFile(dataUrl, fileName) {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  return new File([blob], fileName, { type: blob.type || 'image/png' });
}

export async function shareDataUrl(dataUrl, fileName) {
  const file = await dataUrlToFile(dataUrl, fileName);

  if (!navigator.share || !navigator.canShare?.({ files: [file] })) {
    throw new Error('Le partage natif n’est pas disponible sur cet appareil.');
  }

  await navigator.share({
    title: 'Mème créé avec Studio Meme Maker',
    text: 'Voici mon mème généré dans l’application.',
    files: [file],
  });
}

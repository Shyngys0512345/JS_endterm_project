/* eslint-disable no-restricted-globals, no-undef */

// Веб-воркер для ресайза изображений перед загрузкой
self.onmessage = async (e) => {
  const file = e.data; // файл, присланный из main thread

  try {
    const bitmap = await createImageBitmap(file);

    // Максимальный размер картинки
    const maxDim = 800;
    let width = bitmap.width;
    let height = bitmap.height;

    if (width > height) {
      if (width > maxDim) {
        height = Math.round((height * maxDim) / width);
        width = maxDim;
      }
    } else {
      if (height > maxDim) {
        width = Math.round((width * maxDim) / height);
        height = maxDim;
      }
    }

    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bitmap, 0, 0, width, height);

    const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.75 });

    self.postMessage(blob); // возвращаем готовый файл обратно
  } catch (err) {
    console.error("Image processing failed in worker", err);
    self.postMessage(file); // fallback: возвращаем оригинальный файл
  }
};
// src/utils/compressImage.js
export const compressFileWithWorker = (file) => {
  return new Promise((resolve) => {
    try {
      const worker = new Worker(new URL("../workers/imageWorker.js", import.meta.url));
      worker.postMessage(file);
      worker.onmessage = (ev) => {
        resolve(ev.data);
        worker.terminate();
      };
      worker.onerror = () => {
        resolve(file);
        worker.terminate();
      };
    } catch (err) {
      // if Worker not supported, fallback to original file
      resolve(file);
    }
  });
};
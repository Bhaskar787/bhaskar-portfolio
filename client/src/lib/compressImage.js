/**
 * Compresses an image file in the browser before upload to prevent payload size errors.
 * Fits images within max dimensions (default 1920x1920) and compresses JPEG quality to 80%.
 *
 * @param {File} file - Original file selected by user
 * @param {Object} options - Custom options (maxWidth, maxHeight, quality, maxSizeBytes)
 * @returns {Promise<File>} - Compressed File object
 */
export async function compressImage(file, options = {}) {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.8,
    maxSizeBytes = 1 * 1024 * 1024, // 1MB threshold before compressing
  } = options;

  if (!file || typeof window === "undefined") return file;

  // Don't compress non-image files or SVGs
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
    return file;
  }

  // If already under 1MB, original is already lightweight
  if (file.size <= maxSizeBytes) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }

            const fileName = file.name.replace(/\.[^/.]+$/, "") + ".jpg";
            const compressedFile = new File([blob], fileName, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });

            // Return compressed file if it reduced size, else original
            resolve(compressedFile.size < file.size ? compressedFile : file);
          },
          "image/jpeg",
          quality
        );
      };

      img.onerror = () => resolve(file);
    };

    reader.onerror = () => resolve(file);
  });
}

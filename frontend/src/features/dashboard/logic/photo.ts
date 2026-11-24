/** Read an image file and turn it into a 200x200 JPEG data URL (centre-cropped), for employee photos. */
export function resizePhoto(file: File, done: (dataUrl: string) => void, fail: (message: string) => void): void {
  const reader = new FileReader();
  reader.onerror = () => fail('Could not read that image.');
  reader.onload = () => {
    const img = new Image();
    img.onerror = () => fail('That file is not a valid image.');
    img.onload = () => {
      const size = 200;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) return fail('Could not process that image.');
      const side = Math.min(img.width, img.height);
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
      done(canvas.toDataURL('image/jpeg', 0.82));
    };
    img.src = String(reader.result);
  };
  reader.readAsDataURL(file);
}

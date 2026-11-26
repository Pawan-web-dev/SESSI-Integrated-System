/** URL of a file that scripts/prepare-ocr-assets.mjs copied into public/ocr (served from this site, never the internet). */
export const ocrAsset = (path: string) => import.meta.env.BASE_URL + 'ocr/' + path;
export const faceModelUrl = () => import.meta.env.BASE_URL + 'models/blaze_face_short_range.tflite';

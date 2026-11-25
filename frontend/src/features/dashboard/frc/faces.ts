/** Offline face detection (MediaPipe BlazeFace). The runtime and the 230 KB model are served from this site. */
import { FaceDetector, FilesetResolver } from '@mediapipe/tasks-vision';
import { faceModelUrl, ocrAsset } from './assets';

export interface FaceBox {
  x: number;
  y: number;
  w: number;
  h: number;
  score: number;
}

let detector: Promise<FaceDetector> | null = null;

function getDetector(): Promise<FaceDetector> {
  detector ??= FilesetResolver.forVisionTasks(ocrAsset('mediapipe')).then((files) =>
    FaceDetector.createFromOptions(files, { baseOptions: { modelAssetPath: faceModelUrl(), delegate: 'CPU' }, runningMode: 'IMAGE', minDetectionConfidence: 0.4 }),
  );
  detector.catch(() => (detector = null));
  return detector;
}

/** Faces found in an image, in its own pixel coordinates. */
export async function detectFaces(image: HTMLCanvasElement): Promise<FaceBox[]> {
  const d = await getDetector();
  return d.detect(image).detections.flatMap((det) => (det.boundingBox ? [{ x: det.boundingBox.originX, y: det.boundingBox.originY, w: det.boundingBox.width, h: det.boundingBox.height, score: det.categories[0]?.score ?? 0 }] : []));
}

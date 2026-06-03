export type Point = {
  x: number;
  y: number;
};

export type CameraAim = {
  yaw: number;
  pitch: number;
};

export type AngularTarget = {
  yaw: number;
  pitch: number;
};

const VERTICAL_FOV_RAD = toRadians(73);

export const DEFAULT_CAMERA_AIM: CameraAim = {
  yaw: 0,
  pitch: 0,
};

function toRadians(degrees: number) {
  return degrees * (Math.PI / 180);
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function getViewportCenter(width: number, height: number): Point {
  return {
    x: width / 2,
    y: height / 2,
  };
}

export function randomInRange(min: number, max: number) {
  if (max <= min) {
    return min;
  }

  return min + Math.random() * (max - min);
}

export function getFocalLength(height: number) {
  return height / 2 / Math.tan(VERTICAL_FOV_RAD / 2);
}

export function projectAngularTarget(
  target: AngularTarget,
  camera: CameraAim,
  width: number,
  height: number,
): Point {
  const focalLength = getFocalLength(height);
  const center = getViewportCenter(width, height);
  const relativeYaw = target.yaw - camera.yaw;
  const relativePitch = target.pitch - camera.pitch;

  return {
    x: center.x + Math.tan(relativeYaw) * focalLength,
    y: center.y - Math.tan(relativePitch) * focalLength,
  };
}

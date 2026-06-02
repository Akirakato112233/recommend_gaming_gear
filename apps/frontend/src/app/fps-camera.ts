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
const MAX_PITCH_RAD = toRadians(88);

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

export function getViewportCenter(width: number, height: number): Point {
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

export function applyMouseMovementToCamera(
  camera: CameraAim,
  movementX: number,
  movementY: number,
  radiansPerMouseCount: number,
) {
  camera.yaw += movementX * radiansPerMouseCount;
  camera.pitch = clamp(
    camera.pitch - movementY * radiansPerMouseCount,
    -MAX_PITCH_RAD,
    MAX_PITCH_RAD,
  );
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

export function getCameraScreenOffset(
  camera: CameraAim,
  width: number,
  height: number,
): Point {
  const focalLength = getFocalLength(height);

  return {
    x: Math.tan(camera.yaw) * focalLength,
    y: Math.tan(camera.pitch) * focalLength,
  };
}

export function getDistanceToCrosshair(target: Point, width: number, height: number) {
  return distance(target, getViewportCenter(width, height));
}

export async function requestRawPointerLock(element: HTMLElement) {
  const requestPointerLock = element.requestPointerLock as (
    options?: { unadjustedMovement?: boolean },
  ) => Promise<void> | void;

  try {
    await requestPointerLock.call(element, { unadjustedMovement: true });
  } catch {
    await requestPointerLock.call(element);
  }
}

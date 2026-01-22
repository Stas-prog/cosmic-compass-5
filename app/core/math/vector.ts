import { Vector3 } from "../types/IMUState";

export function normalize(v: Vector3): Vector3 {
  const len = Math.hypot(v.x, v.y, v.z) || 1;
  return { x: v.x / len, y: v.y / len, z: v.z / len };
}

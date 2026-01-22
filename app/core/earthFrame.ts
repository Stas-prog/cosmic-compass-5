import { imuState } from "./sensors/readSensors";
import { Quaternion, Vector3 } from "./types/IMUState";

export type EarthFrame = {
  north: Vector3;
  up: Vector3;     // зеніт
  down: Vector3;   // надир
  forward: Vector3;
};

function rotateVectorByQuaternion(v: Vector3, q: Quaternion): Vector3 {
  const { x, y, z, w } = q;

  const vx = v.x, vy = v.y, vz = v.z;

  const ix =  w * vx + y * vz - z * vy;
  const iy =  w * vy + z * vx - x * vz;
  const iz =  w * vz + x * vy - y * vx;
  const iw = -x * vx - y * vy - z * vz;

  return {
    x: ix * w + iw * -x + iy * -z - iz * -y,
    y: iy * w + iw * -y + iz * -x - ix * -z,
    z: iz * w + iw * -z + ix * -y - iy * -x
  };
}

export function getEarthFrame(): EarthFrame {
  const q = imuState.quaternion;

  const north = rotateVectorByQuaternion({ x: 0, y: 0, z: -1 }, q);
  const up = rotateVectorByQuaternion({ x: 0, y: 1, z: 0 }, q);
  const forward = rotateVectorByQuaternion({ x: 0, y: 0, z: 1 }, q);
  const down = { x: -up.x, y: -up.y, z: -up.z };

  return { north, up, down, forward };
}

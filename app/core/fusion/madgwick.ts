import { imuState } from "../sensors/readSensors";
import { normalize } from "../math/vector";

let q = { x: 0, y: 0, z: 0, w: 1 };
const beta = 0.12;

export function updateFusion(dt: number) {
  let { x: ax, y: ay, z: az } = imuState.accel;
  let { x: gx, y: gy, z: gz } = imuState.gyro;

  const g = normalize({ x: ax, y: ay, z: az });
  ax = g.x; ay = g.y; az = g.z;

  let { x: qx, y: qy, z: qz, w: qw } = q;

  const f1 = 2*(qx*qz - qw*qy) - ax;
  const f2 = 2*(qw*qx + qy*qz) - ay;
  const f3 = 2*(0.5 - qx*qx - qy*qy) - az;

  let grad = {
    x: -2*qy*f1 + 2*qx*f2,
    y:  2*qz*f1 + 2*qw*f2 - 4*qx*f3,
    z: -2*qw*f1 + 2*qy*f2 - 4*qy*f3,
    w:  2*qx*f1 + 2*qy*f2
  };

  const gl = Math.hypot(grad.x, grad.y, grad.z, grad.w) || 1;
  grad.x /= gl; grad.y /= gl; grad.z /= gl; grad.w /= gl;

  const qDot = {
    w: 0.5 * (-qx*gx - qy*gy - qz*gz),
    x: 0.5 * ( qw*gx + qy*gz - qz*gy),
    y: 0.5 * ( qw*gy - qx*gz + qz*gx),
    z: 0.5 * ( qw*gz + qx*gy - qy*gx)
  };

  qw += (qDot.w - beta * grad.w) * dt;
  qx += (qDot.x - beta * grad.x) * dt;
  qy += (qDot.y - beta * grad.y) * dt;
  qz += (qDot.z - beta * grad.z) * dt;

  const ql = Math.hypot(qw, qx, qy, qz) || 1;
  qw /= ql; qx /= ql; qy /= ql; qz /= ql;

  q = { x: qx, y: qy, z: qz, w: qw };
  imuState.quaternion = q;
}

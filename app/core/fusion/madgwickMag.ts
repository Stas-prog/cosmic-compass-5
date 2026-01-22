import { imuState } from "../sensors/readSensors";
import { normalize } from "../math/vector";
import { Quaternion } from "../types/IMUState";

/**
 * Madgwick filter FULL: accel + gyro + magnetometer
 * Earth-frame quaternion (roll, pitch, yaw)
 */

let q: Quaternion = { x: 0, y: 0, z: 0, w: 1 };

const beta = 0.12; // стабільність (0.05–0.25)

export function updateFusion(dt: number = 0.016) {
  let { x: ax, y: ay, z: az } = imuState.accel;
  let { x: gx, y: gy, z: gz } = imuState.gyro;
  let { x: mx, y: my, z: mz } = imuState.mag;

  // якщо сенсори пусті — не ламати фільтр
  if (ax === 0 && ay === 0 && az === 0) return;
  if (mx === 0 && my === 0 && mz === 0) return;

  // нормалізація accel
  const g = normalize({ x: ax, y: ay, z: az });
  ax = g.x; ay = g.y; az = g.z;

  // нормалізація mag
  const m = normalize({ x: mx, y: my, z: mz });
  mx = m.x; my = m.y; mz = m.z;

  let { x: qx, y: qy, z: qz, w: qw } = q;

  // 🔭 Reference direction of Earth's magnetic field
  const hx = 2 * mx * (0.5 - qy*qy - qz*qz) + 2 * my * (qx*qy - qw*qz) + 2 * mz * (qx*qz + qw*qy);
  const hy = 2 * mx * (qx*qy + qw*qz) + 2 * my * (0.5 - qx*qx - qz*qz) + 2 * mz * (qy*qz - qw*qx);
  const bx = Math.sqrt(hx*hx + hy*hy);
  const bz = 2 * mx * (qx*qz - qw*qy) + 2 * my * (qy*qz + qw*qx) + 2 * mz * (0.5 - qx*qx - qy*qy);

  // 🔢 Objective function
  const f1 = 2*(qx*qz - qw*qy) - ax;
  const f2 = 2*(qw*qx + qy*qz) - ay;
  const f3 = 2*(0.5 - qx*qx - qy*qy) - az;

  const f4 = 2*bx*(0.5 - qy*qy - qz*qz) + 2*bz*(qx*qz - qw*qy) - mx;
  const f5 = 2*bx*(qx*qy - qw*qz) + 2*bz*(qw*qx + qy*qz) - my;
  const f6 = 2*bx*(qw*qy + qx*qz) + 2*bz*(0.5 - qx*qx - qy*qy) - mz;

  // 🔄 Jacobian gradient step
  const J_11 = -2*qy;
  const J_12 =  2*qz;
  const J_13 = -2*qw;
  const J_14 =  2*qx;

  const J_21 =  2*qx;
  const J_22 =  2*qw;
  const J_23 =  2*qz;
  const J_24 =  2*qy;

  const J_31 =  0;
  const J_32 = -4*qx;
  const J_33 = -4*qy;
  const J_34 =  0;

  let grad = {
    x: J_11*f1 + J_21*f2 + J_31*f3,
    y: J_12*f1 + J_22*f2 + J_32*f3,
    z: J_13*f1 + J_23*f2 + J_33*f3,
    w: J_14*f1 + J_24*f2 + J_34*f3
  };

  const gl = Math.hypot(grad.x, grad.y, grad.z, grad.w) || 1;
  grad.x /= gl; grad.y /= gl; grad.z /= gl; grad.w /= gl;

  // 🌀 Gyro integration
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

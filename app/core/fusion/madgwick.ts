import { imuState } from "../sensors/readSensors";
import { normalize } from "../math/vector";
import { Quaternion } from "../types/IMUState";

/**
 * Madgwick filter (IMU version: accel + gyro)
 * Без магнітометра (поки)
 */

let q: Quaternion = { x: 0, y: 0, z: 0, w: 1 };

const beta = 0.15; // коефіцієнт корекції (0.05–0.3)

export function updateFusion(dt: number = 0.016) {
  let { x: ax, y: ay, z: az } = imuState.accel;
  let { x: gx, y: gy, z: gz } = imuState.gyro;

  // нормалізація акселерометра (гравітація)
  const g = normalize({ x: ax, y: ay, z: az });
  ax = g.x; ay = g.y; az = g.z;

  let { x: qx, y: qy, z: qz, w: qw } = q;

  // 🔢 Обчислення градієнта (корекція нахилу)
  const f1 = 2*(qx*qz - qw*qy) - ax;
  const f2 = 2*(qw*qx + qy*qz) - ay;
  const f3 = 2*(0.5 - qx*qx - qy*qy) - az;

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

  // нормалізація градієнта
  const gl = Math.hypot(grad.x, grad.y, grad.z, grad.w) || 1;
  grad.x /= gl; grad.y /= gl; grad.z /= gl; grad.w /= gl;

  // 🔄 інтеграція гіроскопа
  const qDot = {
    w: 0.5 * (-qx*gx - qy*gy - qz*gz),
    x: 0.5 * ( qw*gx + qy*gz - qz*gy),
    y: 0.5 * ( qw*gy - qx*gz + qz*gx),
    z: 0.5 * ( qw*gz + qx*gy - qy*gx)
  };

  // 🧠 застосування корекції
  qw += (qDot.w - beta * grad.w) * dt;
  qx += (qDot.x - beta * grad.x) * dt;
  qy += (qDot.y - beta * grad.y) * dt;
  qz += (qDot.z - beta * grad.z) * dt;

  // нормалізація кватерніона
  const ql = Math.hypot(qw, qx, qy, qz) || 1;
  qw /= ql; qx /= ql; qy /= ql; qz /= ql;

  q = { x: qx, y: qy, z: qz, w: qw };

  imuState.quaternion = q;
}

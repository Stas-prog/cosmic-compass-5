import { IMUState } from "../types/IMUState";

export const imuState: IMUState = {
  accel: { x: 0, y: 0, z: 0 },
  gyro: { x: 0, y: 0, z: 0 },
  mag: { x: 0, y: 0, z: 0 },
  quaternion: { x: 0, y: 0, z: 0, w: 1 },
  timestamp: Date.now()
};

export function initSensors() {
  window.addEventListener("devicemotion", (e) => {
    if (!e.accelerationIncludingGravity) return;

    imuState.accel.x = e.accelerationIncludingGravity.x ?? 0;
    imuState.accel.y = e.accelerationIncludingGravity.y ?? 0;
    imuState.accel.z = e.accelerationIncludingGravity.z ?? 0;

    imuState.gyro.x = e.rotationRate?.alpha ?? 0;
    imuState.gyro.y = e.rotationRate?.beta ?? 0;
    imuState.gyro.z = e.rotationRate?.gamma ?? 0;

    imuState.timestamp = Date.now();
  });
}

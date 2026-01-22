import { IMUState } from "../types/IMUState";
import { initMagnetometer } from "./readMagnetometer";



export const imuState: IMUState = {
  accel: { x: 0, y: 0, z: 0 },
  gyro: { x: 0, y: 0, z: 0 },
  mag: { x: 0, y: 0, z: 0 },
  quaternion: { x: 0, y: 0, z: 0, w: 1 },
  timestamp: Date.now()
};

export async function initSensors() {
    initMagnetometer();
  if (
    typeof DeviceMotionEvent !== "undefined" &&
    typeof (DeviceMotionEvent as any).requestPermission === "function"
  ) {
    const res = await (DeviceMotionEvent as any).requestPermission();
    if (res !== "granted") {
      alert("Permission denied for motion sensors");
      return;
    }
  }

  window.addEventListener("devicemotion", (e) => {
    console.log("DEVICEMOTION:", e.accelerationIncludingGravity, e.rotationRate);

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


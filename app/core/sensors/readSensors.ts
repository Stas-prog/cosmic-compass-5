import { Accelerometer, Gyroscope, Magnetometer } from "expo-sensors";
import { IMUState } from "../types/IMUState";

export const imuState: IMUState = {
  accel: { x: 0, y: 0, z: 0 },
  gyro: { x: 0, y: 0, z: 0 },
  mag: { x: 0, y: 0, z: 0 },
  quaternion: { x: 0, y: 0, z: 0, w: 1 }
};

export function initSensors() {
  Accelerometer.setUpdateInterval(16);
  Gyroscope.setUpdateInterval(16);
  Magnetometer.setUpdateInterval(16);

  Accelerometer.addListener((data) => {
    imuState.accel = data;
  });

  Gyroscope.addListener((data) => {
    imuState.gyro = data;
  });

  Magnetometer.addListener((data) => {
    imuState.mag = data;
  });
}

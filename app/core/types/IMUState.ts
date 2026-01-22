export type Vector3 = {
  x: number;
  y: number;
  z: number;
};

export type Quaternion = {
  x: number;
  y: number;
  z: number;
  w: number;
};

export type IMUState = {
  accel: Vector3;
  gyro: Vector3;
  mag: Vector3;
  quaternion: Quaternion;
};

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
  accel: Vector3;   // gravity
  gyro: Vector3;    // angular velocity
  mag: Vector3;     // magnetic north
  quaternion: Quaternion; // earth-frame orientation
  timestamp: number;
};

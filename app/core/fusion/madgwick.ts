import { imuState } from "../sensors/readSensors";
import { normalize } from "../math/vector";

export function updateFusion() {
  const g = normalize(imuState.accel);

  // placeholder quaternion (далі буде повний фільтр)
  imuState.quaternion = {
    x: g.x,
    y: g.y,
    z: g.z,
    w: 1
  };
}

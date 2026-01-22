"use client";

import { useEffect } from "react";
import { initSensors } from "./core/sensors/readSensors";
import { updateFusion } from "./core/fusion/madgwick";
import { imuState } from "./core/sensors/readSensors";

export default function Page() {
  useEffect(() => {
    initSensors();

    const loop = () => {
      updateFusion();
      console.log("IMU Quaternion:", imuState.quaternion);
      requestAnimationFrame(loop);
    };

    loop();
  }, []);

  return (
    <main style={{ padding: 20 }}>
      <h1>IMU Compass Core</h1>
      <p>Sensor Fusion Running...</p>
    </main>
  );
}

"use client";

import { useEffect } from "react";
import { initSensors } from "./core/sensors/readSensors";
import { updateFusion } from "./core/fusion/madgwickMag";
import { imuState } from "./core/sensors/readSensors";

export default function Page() {
  useEffect(() => {
    initSensors();

    let last = performance.now();

    const loop = (t: number) => {
      const dt = (t - last) / 1000;
      last = t;

      updateFusion(dt);

      console.log("EARTH-FRAME QUATERNION:", imuState.quaternion);

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }, []);

  return (
    <main style={{ padding: 20 }}>
      <h1>IMU Compass Core</h1>
      <p>Madgwick Sensor Fusion Active</p>
      <p>Check console for quaternion</p>
      <button
       onClick={async () => {const { initSensors } = await import("./core/sensors/readSensors");initSensors(); }}
>
  Enable Sensors
</button>

    </main>
  );
}

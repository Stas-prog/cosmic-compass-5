import { imuState } from "./readSensors";

// Магнітометр = вектор Півночі
export function initMagnetometer() {
  // Перевірка підтримки Generic Sensor API
  if (!("Magnetometer" in window)) {
    console.warn("Magnetometer API not supported on this device");
    return;
  }

  try {
    // @ts-ignore — браузери ще не типізували API повністю
    const mag = new Magnetometer({ frequency: 60 });

    mag.addEventListener("reading", () => {
      imuState.mag.x = mag.x ?? 0;
      imuState.mag.y = mag.y ?? 0;
      imuState.mag.z = mag.z ?? 0;

      imuState.timestamp = Date.now();
    });

    mag.addEventListener("error", (e: any) => {
      console.warn("Magnetometer error:", e.error?.name || e);
    });

    mag.start();
  } catch (err) {
    console.warn("Magnetometer init failed:", err);
  }
}

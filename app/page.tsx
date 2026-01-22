import { useEffect } from "react";
import { View, Text } from "react-native";
import { initSensors, imuState } from "./core/sensors/readSensors";
import { updateFusion } from "./core/fusion/madgwick";

export default function App() {
  useEffect(() => {
    initSensors();

    let last = Date.now();

    const loop = () => {
      const now = Date.now();
      const dt = (now - last) / 1000;
      last = now;

      updateFusion(dt);

      console.log("QUAT:", imuState.quaternion);
      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>IMU Native Core Running...</Text>
    </View>
  );
}

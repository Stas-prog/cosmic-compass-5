"use client";

import * as THREE from "three";
import { useEffect } from "react";
import { updateFusion } from "./core/fusion/madgwickMag";
import { getEarthFrame } from "./core/earthFrame";

export default function VisualTest() {
  useEffect(() => {
  let sensorsReady = false;

  const start = async () => {
    const { initSensors } = await import("./core/sensors/readSensors");
    await initSensors();
    sensorsReady = true;
  };

  // кнопка запуску
  const btn = document.createElement("button");
  btn.innerText = "Enable IMU Sensors";
  btn.style.position = "fixed";
  btn.style.top = "10px";
  btn.style.right = "10px";
  btn.style.zIndex = "9999";
  btn.style.padding = "10px";
  btn.style.fontSize = "16px";
  document.body.appendChild(btn);

  btn.onclick = () => {
    start();
    btn.remove();
  };

  // 🌌 Сцена
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.1, 1000);
  camera.position.z = 3;

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(innerWidth, innerHeight);
  document.body.appendChild(renderer.domElement);

  const northArrow = new THREE.Mesh(
    new THREE.ConeGeometry(0.1, 0.4, 16),
    new THREE.MeshBasicMaterial({ color: "red" })
  );
  northArrow.position.y = 0.5;
  scene.add(northArrow);

  const upDot = new THREE.Mesh(
    new THREE.SphereGeometry(0.07),
    new THREE.MeshBasicMaterial({ color: "lime" })
  );
  scene.add(upDot);

  const fwdDot = new THREE.Mesh(
    new THREE.SphereGeometry(0.07),
    new THREE.MeshBasicMaterial({ color: "cyan" })
  );
  scene.add(fwdDot);

  let last = performance.now();

  const animate = (t: number) => {
    const dt = (t - last) / 1000;
    last = t;

    if (sensorsReady) {
      updateFusion(dt);
      const frame = getEarthFrame();

      northArrow.position.set(frame.north.x, frame.north.y, frame.north.z);
      northArrow.lookAt(0, 0, 0);

      upDot.position.set(frame.up.x, frame.up.y, frame.up.z);
      fwdDot.position.set(frame.forward.x, frame.forward.y, frame.forward.z);
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);

  return () => {
    renderer.dispose();
    document.body.removeChild(renderer.domElement);
    btn.remove();
  };
}, []);


  return (
    <main style={{ position: "fixed", inset: 0 }}>
      <div style={{
        position: "absolute",
        top: 10,
        left: 10,
        color: "white",
        fontSize: 14,
        fontFamily: "monospace",
        background: "rgba(0,0,0,0.4)",
        padding: 6,
        borderRadius: 6
      }}>
        🔴 Red = North<br/>
        🟢 Green = Up<br/>
        🔵 Cyan = Forward
      </div>
    </main>
  );
}

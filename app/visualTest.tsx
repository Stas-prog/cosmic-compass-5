"use client";

import * as THREE from "three";
import { useEffect } from "react";
import { initSensors } from "./core/sensors/readSensors";
import { updateFusion } from "./core/fusion/madgwickMag";
import { getEarthFrame } from "./core/earthFrame";

export default function VisualTest() {
  useEffect(() => {
    initSensors();

    // 🌌 Сцена
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // 🧭 СТРІЛКА ПІВНОЧІ
    const arrowGeom = new THREE.ConeGeometry(0.1, 0.4, 16);
    const arrowMat = new THREE.MeshBasicMaterial({ color: "red" });
    const northArrow = new THREE.Mesh(arrowGeom, arrowMat);
    northArrow.position.y = 0.5;
    scene.add(northArrow);

    // ⬆️ ЗЕНІТ (UP)
    const upGeom = new THREE.SphereGeometry(0.07);
    const upMat = new THREE.MeshBasicMaterial({ color: "lime" });
    const upDot = new THREE.Mesh(upGeom, upMat);
    scene.add(upDot);

    // ➡️ FORWARD
    const fwdGeom = new THREE.SphereGeometry(0.07);
    const fwdMat = new THREE.MeshBasicMaterial({ color: "cyan" });
    const fwdDot = new THREE.Mesh(fwdGeom, fwdMat);
    scene.add(fwdDot);

    // 🎞 LOOP
    let last = performance.now();

    const animate = (t: number) => {
      const dt = (t - last) / 1000;
      last = t;

      updateFusion(dt);

      const frame = getEarthFrame();

      // Північ
      northArrow.position.set(
        frame.north.x,
        frame.north.y,
        frame.north.z
      );
      northArrow.lookAt(0, 0, 0);

      // Зеніт
      upDot.position.set(
        frame.up.x,
        frame.up.y,
        frame.up.z
      );

      // Вперед
      fwdDot.position.set(
        frame.forward.x,
        frame.forward.y,
        frame.forward.z
      );

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    return () => {
      renderer.dispose();
      document.body.removeChild(renderer.domElement);
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

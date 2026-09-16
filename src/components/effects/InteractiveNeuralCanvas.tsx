"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface InteractiveNeuralCanvasProps {
  particleCount?: number;
  interactive?: boolean;
  intensity?: "high" | "medium" | "subtle";
  className?: string;
}

export default function InteractiveNeuralCanvas({
  particleCount = 140,
  interactive = true,
  intensity = "high",
  className = "",
}: InteractiveNeuralCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isHovered: false });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 85;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Particle Geometry & Attributes
    const actualCount = intensity === "subtle" ? 70 : intensity === "medium" ? 110 : particleCount;
    const positions = new Float32Array(actualCount * 3);
    const velocities = new Float32Array(actualCount * 3);
    const basePositions = new Float32Array(actualCount * 3);
    const colors = new Float32Array(actualCount * 3);

    const cyanColor = new THREE.Color("#06b6d4");
    const violetColor = new THREE.Color("#8b5cf6");
    const emeraldColor = new THREE.Color("#10b981");

    for (let i = 0; i < actualCount; i++) {
      const i3 = i * 3;
      // Spherical distribution
      const radius = 35 + Math.random() * 45;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      basePositions[i3] = x;
      basePositions[i3 + 1] = y;
      basePositions[i3 + 2] = z;

      velocities[i3] = (Math.random() - 0.5) * 0.04;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.04;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.04;

      // Color variation
      const randColor = Math.random();
      const mixedColor = randColor < 0.5 
        ? cyanColor.clone().lerp(violetColor, Math.random()) 
        : violetColor.clone().lerp(emeraldColor, Math.random() * 0.4);

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Custom Particle Texture
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, "rgba(255, 255, 255, 1)");
      grad.addColorStop(0.2, "rgba(6, 182, 212, 0.85)");
      grad.addColorStop(0.6, "rgba(139, 92, 246, 0.3)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 3.2,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Dynamic Neural Line Mesh
    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
    });

    const maxLines = 300;
    const linePositions = new Float32Array(maxLines * 6);
    const lineColors = new Float32Array(maxLines * 6);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // Central Morphing Cyber Wireframe Core
    const coreGeo = new THREE.IcosahedronGeometry(18, 2);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    // Outer Halo
    const haloGeo = new THREE.TorusGeometry(32, 0.4, 16, 100);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.22,
      wireframe: true,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    haloMesh.rotation.x = Math.PI / 3;
    scene.add(haloMesh);

    // Mouse Tracking
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = x * 25;
      mouseRef.current.targetY = y * 25;
      mouseRef.current.isHovered = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
      mouseRef.current.isHovered = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Group rotations
      particles.rotation.y = elapsedTime * 0.05 + mouseRef.current.x * 0.02;
      particles.rotation.x = Math.sin(elapsedTime * 0.03) * 0.1 - mouseRef.current.y * 0.02;

      coreMesh.rotation.y = -elapsedTime * 0.08;
      coreMesh.rotation.x = elapsedTime * 0.05;

      haloMesh.rotation.z = elapsedTime * 0.06;
      haloMesh.rotation.y = Math.sin(elapsedTime * 0.04) * 0.2;

      // Particle physics & connections
      const posAttr = geometry.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      let lineIndex = 0;
      const linePos = lineGeometry.attributes.position as THREE.BufferAttribute;
      const lineCol = lineGeometry.attributes.color as THREE.BufferAttribute;
      const lPosArr = linePos.array as Float32Array;
      const lColArr = lineCol.array as Float32Array;

      for (let i = 0; i < actualCount; i++) {
        const i3 = i * 3;

        // Subtle organic noise drift
        posArray[i3] += velocities[i3];
        posArray[i3 + 1] += velocities[i3 + 1];
        posArray[i3 + 2] += velocities[i3 + 2];

        // Bounds bounce back to origin shell
        const dist = Math.sqrt(
          posArray[i3] * posArray[i3] +
          posArray[i3 + 1] * posArray[i3 + 1] +
          posArray[i3 + 2] * posArray[i3 + 2]
        );
        if (dist > 80 || dist < 20) {
          velocities[i3] *= -1;
          velocities[i3 + 1] *= -1;
          velocities[i3 + 2] *= -1;
        }

        // Connect nearby points with neural lines
        for (let j = i + 1; j < actualCount; j++) {
          if (lineIndex >= maxLines) break;
          const j3 = j * 3;
          const dx = posArray[i3] - posArray[j3];
          const dy = posArray[i3 + 1] - posArray[j3 + 1];
          const dz = posArray[i3 + 2] - posArray[j3 + 2];
          const pDist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (pDist < 16) {
            const l6 = lineIndex * 6;
            lPosArr[l6] = posArray[i3];
            lPosArr[l6 + 1] = posArray[i3 + 1];
            lPosArr[l6 + 2] = posArray[i3 + 2];
            lPosArr[l6 + 3] = posArray[j3];
            lPosArr[l6 + 4] = posArray[j3 + 1];
            lPosArr[l6 + 5] = posArray[j3 + 2];

            const alpha = 1.0 - pDist / 16;
            lColArr[l6] = 0.02 * alpha;
            lColArr[l6 + 1] = 0.71 * alpha;
            lColArr[l6 + 2] = 0.83 * alpha;
            lColArr[l6 + 3] = 0.54 * alpha;
            lColArr[l6 + 4] = 0.36 * alpha;
            lColArr[l6 + 5] = 0.96 * alpha;

            lineIndex++;
          }
        }
      }

      // Hide remaining unused lines
      for (let k = lineIndex * 6; k < maxLines * 6; k++) {
        lPosArr[k] = 0;
        lColArr[k] = 0;
      }

      posAttr.needsUpdate = true;
      linePos.needsUpdate = true;
      lineCol.needsUpdate = true;

      // Dynamic camera parallax
      camera.position.x = mouseRef.current.x * 0.4;
      camera.position.y = mouseRef.current.y * 0.4;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mouseleave", handleMouseLeave);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      haloGeo.dispose();
      haloMat.dispose();
      renderer.dispose();
    };
  }, [particleCount, interactive, intensity]);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ zIndex: 0 }}
    />
  );
}

// components/warehouse/WarehousePreview.tsx
"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

interface SectionData {
  name: string;
  type: string;
  positionX: number;
  positionY: number;
  positionZ: number;
  sizeX: number;
  sizeY: number;
  sizeZ: number;
  color: string;
}

interface WarehousePreviewProps {
  length: number;
  width: number;
  height: number;
  sections: SectionData[];
}

export default function WarehousePreview({
  length,
  width,
  height,
  sections,
}: WarehousePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000,
    );
    camera.position.set(length * 1.5, height * 2, width * 1.5);
    camera.lookAt(0, 0, 0);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight,
    );
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(20, 30, 20);
    scene.add(directionalLight);

    // Grid
    const gridHelper = new THREE.GridHelper(Math.max(length, width) * 1.5, 20);
    scene.add(gridHelper);

    // Warehouse outline
    const warehouseGeometry = new THREE.BoxGeometry(length, height, width);
    const edges = new THREE.EdgesGeometry(warehouseGeometry);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
    const warehouse = new THREE.LineSegments(edges, lineMaterial);
    warehouse.position.set(0, height / 2, 0);
    scene.add(warehouse);

    // Sections
    sections.forEach((section) => {
      const sectionGeometry = new THREE.BoxGeometry(
        section.sizeX,
        section.sizeY,
        section.sizeZ,
      );
      const sectionMaterial = new THREE.MeshPhongMaterial({
        color: section.color,
        transparent: true,
        opacity: 0.8,
      });
      const sectionMesh = new THREE.Mesh(sectionGeometry, sectionMaterial);
      sectionMesh.position.set(
        section.positionX - length / 2 + section.sizeX / 2,
        section.positionY + section.sizeY / 2,
        section.positionZ - width / 2 + section.sizeZ / 2,
      );
      scene.add(sectionMesh);

      // Section label
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (context) {
        canvas.width = 256;
        canvas.height = 64;
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "#000000";
        context.font = "24px Arial";
        context.textAlign = "center";
        context.fillText(section.name, 128, 40);

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(4, 1, 1);
        sprite.position.set(
          section.positionX - length / 2 + section.sizeX / 2,
          section.positionY + section.sizeY + 1,
          section.positionZ - width / 2 + section.sizeZ / 2,
        );
        scene.add(sprite);
      }
    });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect =
        containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight,
      );
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      renderer.dispose();
    };
  }, [length, width, height, sections]);

  return (
    <div
      ref={containerRef}
      className="w-full h-[400px] rounded-lg border bg-slate-50"
    />
  );
}

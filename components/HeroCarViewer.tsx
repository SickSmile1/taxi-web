'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { p } from '@/lib/base-path';

interface Props {
  className?: string;
  style?: React.CSSProperties;
}

export default function HeroCarViewer({ className, style }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 560;
    const height = container.clientHeight || 440;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();

    // Transparent background so it blends with the page background
    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 1000);

    // Position camera at a premium front-quarter isometric angle looking down at the car
    camera.position.set(-6, 4.5, 9);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Camera target focus on the center
    camera.lookAt(0, 0.4, 0);

    // 3. Lighting (Premium setup to define car contours)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.8);
    fillLight.position.set(-5, 3, -5);
    scene.add(fillLight);

    // Subtle golden rim light for premium look
    const rimLight = new THREE.DirectionalLight(0xe6b032, 1.2);
    rimLight.position.set(0, 5, -8);
    scene.add(rimLight);

    let carGroup: THREE.Group | null = null;
    let taxiShield: THREE.Group | null = null;
    let currentTheme = 'dark';

    // Determine starting theme
    if (typeof document !== 'undefined') {
      currentTheme = document.body.classList.contains('light-theme')
        ? 'light'
        : 'dark';
    }

    // Function to apply car body color based on theme
    const applyCarColor = (g: THREE.Group, theme: string) => {
      g.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // Identify main body paint: Cube074_Texture_0
          if (child.name === 'Cube074_Texture_0') {
            child.material = new THREE.MeshStandardMaterial({
              color: theme === 'light' ? 0x111111 : 0xffffff, // Black for light mode, White for dark mode
              roughness: 0.15,
              metalness: 0.8,
              flatShading: true,
            });
          }
        }
      });
    };

    // 4. Load the car GLB model
    const loader = new GLTFLoader();
    loader.load(
      p('/data/low_poly_cars.glb'),
      (gltf) => {
        let rootNode: THREE.Object3D | null = null;
        gltf.scene.traverse((child) => {
          if (child.name === 'RootNode') {
            rootNode = child;
          }
        });

        if (rootNode && (rootNode as any).children.length > 0) {
          const cars = (rootNode as any).children;
          const selectedCar = cars[8 % cars.length]; // Same sedan model used in map

          if (selectedCar) {
            const cloned = selectedCar.clone();

            // Create a centering group
            const centerGroup = new THREE.Group();
            centerGroup.add(cloned);

            // Auto-center and normalize size
            centerGroup.updateMatrixWorld(true);
            const box = new THREE.Box3().setFromObject(centerGroup);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const fitScale = 4.0 / maxDim;

            centerGroup.scale.setScalar(fitScale);
            centerGroup.position.set(
              -center.x * fitScale,
              -box.min.y * fitScale,
              -center.z * fitScale,
            );

            // Parent group for orientation
            carGroup = new THREE.Group();
            carGroup.add(centerGroup);

            // Rotate to look premium (front-left profile beauty shot)
            carGroup.rotation.y = -1.05;

            // Apply initial theme color
            applyCarColor(carGroup, currentTheme);

            // 5. Add a yellow rectangle TAXI shield on the roof center
            const roofY = (box.max.y - box.min.y) * fitScale;

            taxiShield = new THREE.Group();

            // Yellow shield body
            const shieldGeom = new THREE.BoxGeometry(0.2, 0.15, 0.5);
            const shieldMat = new THREE.MeshBasicMaterial({ color: 0xe6b032 });
            const shieldMesh = new THREE.Mesh(shieldGeom, shieldMat);
            taxiShield.add(shieldMesh);

            // Black border base
            const borderGeom = new THREE.BoxGeometry(0.22, 0.03, 0.52);
            const borderMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
            const borderMesh = new THREE.Mesh(borderGeom, borderMat);
            borderMesh.position.y = -0.09;
            taxiShield.add(borderMesh);

            // Position shield on the center of the car's roof
            taxiShield.position.set(0, roofY - 0.04, -0.12);
            carGroup.add(taxiShield);

            scene.add(carGroup);
            renderer.render(scene, camera);
          }
        }
      },
      undefined,
      (err) => console.error('Failed to load GLTF car in HeroCarViewer:', err),
    );

    // 6. Listen to theme changes to dynamically repaint the car
    const handleThemeChange = (e: any) => {
      const nextTheme = e.detail;
      currentTheme = nextTheme;
      if (carGroup) {
        applyCarColor(carGroup, nextTheme);
        renderer.render(scene, camera);
      }
    };
    window.addEventListener('theme-change', handleThemeChange);

    // Static rendering, but we re-render on window resize
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight || 440;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.render(scene, camera);
    };
    window.addEventListener('resize', handleResize);

    // Initial render trigger
    const intervalId = setInterval(() => {
      renderer.render(scene, camera);
    }, 1000);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('theme-change', handleThemeChange);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: '100%', height: '100%', ...style }}
    />
  );
}

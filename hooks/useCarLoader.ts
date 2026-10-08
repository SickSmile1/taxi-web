'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { p } from '@/lib/base-path';

interface UseCarLoaderReturn {
  carGroupRef: React.RefObject<THREE.Group>;
}

function applyCarColor(g: THREE.Group, theme: string) {
  g.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      if (child.name === 'Cube074_Texture_0') {
        child.material = new THREE.MeshStandardMaterial({
          color: theme === 'light' ? 0x111111 : 0xffffff,
          roughness: 0.15,
          metalness: 0.8,
          flatShading: true,
        });
      }
    }
  });
}

export function useCarLoader(scene: THREE.Scene): UseCarLoaderReturn {
  const carGroupRef = useRef<THREE.Group>(null!);
  const sceneRef = useRef(scene);
  sceneRef.current = scene;

  useEffect(() => {
    if (!scene) return;

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
          const carIndex = 8;
          const selectedCar = cars[carIndex % cars.length];
          if (selectedCar) {
            const cloned = selectedCar.clone();
            cloned.traverse((child: any) => {
              if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
              }
            });

            const centerGroup = new THREE.Group();
            centerGroup.name = 'centerGroup';
            centerGroup.add(cloned);

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

            const orientGroup = new THREE.Group();
            orientGroup.name = 'orientGroup';
            orientGroup.add(centerGroup);
            orientGroup.rotation.y = 0;

            const carGroup = new THREE.Group();
            carGroup.name = 'car';
            carGroup.add(orientGroup);
            carGroup.visible = false;
            if (sceneRef.current) {
              sceneRef.current.add(carGroup);
            }

            carGroupRef.current = carGroup;
            const isLight = document.body.classList.contains('light-theme');
            applyCarColor(carGroup, isLight ? 'light' : 'dark');
          }
        }
      },
      undefined,
      (err) => {
        console.error('useCarLoader: Failed to load GLTF car:', err);
      },
    );

    const handleThemeChange = (e: Event) => {
      const nextTheme = (e as CustomEvent).detail;
      const carGroup = carGroupRef.current;
      if (carGroup) {
        applyCarColor(carGroup, nextTheme);
      }
    };
    window.addEventListener('theme-change', handleThemeChange as EventListener);

    return () => {
      window.removeEventListener(
        'theme-change',
        handleThemeChange as EventListener,
      );

      // Remove carGroup from scene and dispose all geometries/materials
      const carGroup = carGroupRef.current;
      if (carGroup) {
        carGroup.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach((m) => m.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
        if (sceneRef.current) {
          sceneRef.current.remove(carGroup);
        }
        carGroupRef.current = null as any;
      }
    };
  }, [scene]);

  return { carGroupRef };
}

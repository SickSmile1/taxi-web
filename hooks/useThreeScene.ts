'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import {
  ANCHOR_LAT,
  ANCHOR_LNG,
  ecefToEnu,
  FREIBURG_GROUND_ALT,
  gpsToEcef,
} from '@/lib/geo-utils';

interface UseThreeSceneReturn {
  scene: THREE.Scene | null;
  camera: THREE.PerspectiveCamera | null;
  renderer: THREE.WebGLRenderer | null;
  composer: EffectComposer | null;
  controls: OrbitControls | null;
  bloomPass: UnrealBloomPass | null;
}

export function useThreeScene(
  containerRef: React.RefObject<HTMLDivElement | null>,
): UseThreeSceneReturn {
  const sceneRef = useRef<THREE.Scene>(null!);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null!);
  const rendererRef = useRef<THREE.WebGLRenderer>(null!);
  const composerRef = useRef<EffectComposer>(null!);
  const controlsRef = useRef<OrbitControls>(null!);
  const bloomPassRef = useRef<UnrealBloomPass>(null!);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 1200;
    const height = container.clientHeight || 480;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);
    scene.fog = new THREE.FogExp2(0x111111, 0.000003);
    sceneRef.current = scene;

    // Camera — positioned in local ENU space, origin at anchor ground
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 200000);
    // Local scene uses Y-up (Three.js standard frame)
    camera.up.set(0, 1, 0);
    // Offset camera GPS slightly NW and 800m above ground for angled view
    const camPos = ecefToEnu(
      gpsToEcef(
        ANCHOR_LNG - 0.003,
        ANCHOR_LAT + 0.003,
        FREIBURG_GROUND_ALT + 800,
      ),
    );
    camera.position.set(camPos.x, camPos.y, camPos.z);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Post-processing
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      0.6,
      0.3,
      0.85,
    );
    composer.addPass(bloomPass);
    composerRef.current = composer;
    bloomPassRef.current = bloomPass;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI / 2 - 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 50000;
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.PAN,
    };
    controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN,
    };
    controls.target.set(0, 0, 0);
    controls.update();
    controlsRef.current = controls;
    setReady(true);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x1a233a, 1.5);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0x2d3f56, 0x111118, 1.0);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfff5e6, 2.5);
    // Local ENU space: X = East, Y = Up, Z = -North (southward)
    const sunUp = 2000;
    const sunEast = 1500;
    const sunNorth = 1000;
    sunLight.position.set(sunEast, sunUp, -sunNorth);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 100;
    sunLight.shadow.camera.far = 8000;
    const d = 5000;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // Theme switching for 3D Background & Lighting
    const applySceneTheme = (theme: 'light' | 'dark') => {
      const isLight = theme === 'light';
      const bgColor = isLight ? 0xe9eef5 : 0x111111;

      scene.background = new THREE.Color(bgColor);
      if (scene.fog) {
        (scene.fog as THREE.FogExp2).color.setHex(bgColor);
      }

      if (isLight) {
        ambientLight.color.setHex(0xffffff);
        ambientLight.intensity = 2.2;
        hemiLight.color.setHex(0xffffff);
        hemiLight.groundColor.setHex(0xcfd7e3);
        hemiLight.intensity = 1.4;
        bloomPass.strength = 0.2;
      } else {
        ambientLight.color.setHex(0x1a233a);
        ambientLight.intensity = 1.5;
        hemiLight.color.setHex(0x2d3f56);
        hemiLight.groundColor.setHex(0x111118);
        hemiLight.intensity = 1.0;
        bloomPass.strength = 0.6;
      }
    };

    const initialTheme = document.body.classList.contains('light-theme')
      ? 'light'
      : 'dark';
    applySceneTheme(initialTheme);

    const handleThemeChange = (e: Event) => {
      const theme = (e as CustomEvent).detail as 'light' | 'dark';
      applySceneTheme(theme);
    };
    window.addEventListener('theme-change', handleThemeChange as EventListener);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 480;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
      bloomPass.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      setReady(false);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener(
        'theme-change',
        handleThemeChange as EventListener,
      );
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [containerRef]);

  return {
    scene: sceneRef.current,
    camera: cameraRef.current,
    renderer: rendererRef.current,
    composer: composerRef.current,
    controls: controlsRef.current,
    bloomPass: bloomPassRef.current,
  };
}

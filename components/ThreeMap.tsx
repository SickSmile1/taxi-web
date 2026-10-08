'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useCarLoader } from '@/hooks/useCarLoader';
import { useGeoJsonLayers } from '@/hooks/useGeoJsonLayers';
import { useThreeScene } from '@/hooks/useThreeScene';
import {
  ecefToEnu,
  FALLBACK_GROUND_ALT,
  FREIBURG_GROUND_ALT,
  gpsToEcef,
  loadGroundHeight,
} from '@/lib/geo-utils';
import { createAirportModel } from '@/lib/models/airport';
import { onRouteChange } from '@/lib/route-store';
import CameraHud from './map/CameraHud';
import TunnelOverlay from './map/TunnelOverlay';

function gpsToScene(lng: number, lat: number, height = 0): THREE.Vector3 {
  const enu = ecefToEnu(gpsToEcef(lng, lat, height));
  return new THREE.Vector3(enu.x, enu.y, enu.z);
}

function ecefQuat(
  tangent: { x: number; y: number; z: number },
  up: { x: number; y: number; z: number },
): THREE.Quaternion {
  const fwd = new THREE.Vector3(tangent.x, tangent.y, tangent.z);
  const upV = new THREE.Vector3(up.x, up.y, up.z);
  fwd.addScaledVector(upV, -fwd.dot(upV)).normalize();
  const right = new THREE.Vector3().crossVectors(fwd, upV).normalize();
  const m = new THREE.Matrix4().makeBasis(right, upV, fwd.clone().negate());
  return new THREE.Quaternion().setFromRotationMatrix(m);
}

// Local up vector for the scene (local ENU is Y-up)
const LOCAL_UP = { x: 0, y: 1, z: 0 };
const LOCAL_EAST = { x: 1, y: 0, z: 0 };
const LOCAL_NORTH = { x: 0, y: 0, z: -1 };

class PolylinePath {
  points: THREE.Vector3[];
  distances: number[];
  totalLength: number;

  constructor(points: THREE.Vector3[]) {
    this.points = points;
    this.distances = [0];
    let total = 0;
    for (let i = 1; i < points.length; i++) {
      const d = points[i].distanceTo(points[i - 1]);
      total += d;
      this.distances.push(total);
    }
    this.totalLength = Math.max(total, 0.001);
  }

  getPointAt(t: number, target = new THREE.Vector3()): THREE.Vector3 {
    const clampedT = Math.max(0, Math.min(1, t));
    const targetDist = clampedT * this.totalLength;

    let low = 0;
    let high = this.distances.length - 1;
    while (low < high - 1) {
      const mid = (low + high) >> 1;
      if (this.distances[mid] <= targetDist) {
        low = mid;
      } else {
        high = mid;
      }
    }

    const segDist = this.distances[low + 1] - this.distances[low];
    const segT = segDist > 0 ? (targetDist - this.distances[low]) / segDist : 0;
    return target.copy(this.points[low]).lerp(this.points[low + 1], segT);
  }

  getTangentAt(t: number, target = new THREE.Vector3()): THREE.Vector3 {
    const clampedT = Math.max(0, Math.min(1, t));
    const targetDist = clampedT * this.totalLength;

    let low = 0;
    let high = this.distances.length - 1;
    while (low < high - 1) {
      const mid = (low + high) >> 1;
      if (this.distances[mid] <= targetDist) {
        low = mid;
      } else {
        high = mid;
      }
    }

    target.copy(this.points[low + 1]).sub(this.points[low]);
    if (target.lengthSq() > 0.0001) {
      target.normalize();
    } else {
      target.set(1, 0, 0);
    }
    return target;
  }
}

interface ThreeMapProps {
  mode?: 'basic' | 'full';
}

export default function ThreeMap({ mode = 'basic' }: ThreeMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [camMode, setCamMode] = useState<'chase' | 'overview' | 'orbit'>(
    'orbit',
  );

  const camModeRef = useRef(camMode);
  useEffect(() => {
    camModeRef.current = camMode;
  }, [camMode]);

  const [animStatus, setAnimStatus] = useState<
    'idle' | 'playing' | 'paused' | 'tunneling' | 'arrived'
  >('idle');
  const [tunnelText, setTunnelText] = useState('');

  const animStatusRef = useRef(animStatus);
  const animElapsedRef = useRef(0);
  const animDurationRef = useRef(25000);
  const routeCurveRef = useRef<PolylinePath | null>(null);
  const isAirportRouteRef = useRef(false);
  const freiburgCurveRef = useRef<PolylinePath | null>(null);
  const airportCurveRef = useRef<PolylinePath | null>(null);
  const lastCarPosRef = useRef(new THREE.Vector3());

  const { scene, camera, renderer, composer, controls, bloomPass } =
    useThreeScene(containerRef);

  const { carGroupRef } = useCarLoader(scene as THREE.Scene);

  const groundHeightRef = useRef<(lng: number, lat: number) => number>(
    () => FALLBACK_GROUND_ALT,
  );

  useEffect(() => {
    let active = true;
    loadGroundHeight().then((fn) => {
      if (active) groundHeightRef.current = fn;
    });
    return () => {
      active = false;
    };
  }, []);

  const groundHeight = useCallback(
    (lng: number, lat: number) => groundHeightRef.current(lng, lat),
    [],
  );

  const { updateTiles } = useGeoJsonLayers({
    scene: scene as THREE.Scene,
    renderer: renderer as THREE.WebGLRenderer,
    camera: camera as THREE.PerspectiveCamera,
    groundHeight,
    onLoaded: () => setLoading(false),
  });

  const updateAnimStatus = (status: typeof animStatus) => {
    animStatusRef.current = status;
    setAnimStatus(status);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !scene || !camera || !renderer || !composer || !controls)
      return;

    // Airport 3D Models
    const airports = [
      {
        name: 'EuroAirport Basel-Mulhouse',
        iata: 'BSL',
        lng: 7.5297,
        lat: 47.5896,
        rot: 0,
      },
      {
        name: 'Karlsruhe / Baden-Baden',
        iata: 'FKB',
        lng: 8.08,
        lat: 48.7794,
        rot: 0.3,
      },
      {
        name: 'Flughafen Frankfurt',
        iata: 'FRA',
        lng: 8.5705,
        lat: 50.0333,
        rot: -0.2,
      },
      {
        name: 'München International',
        iata: 'MUC',
        lng: 11.7861,
        lat: 48.3538,
        rot: 0.5,
      },
    ];

    const airportModelsGroup = new THREE.Group();
    airportModelsGroup.name = 'airportsGroup';
    airports.forEach((ap) => {
      const apModel = createAirportModel(ap);
      const apPos = gpsToScene(ap.lng, ap.lat, FREIBURG_GROUND_ALT);
      apModel.position.copy(apPos);
      apModel.rotation.y = ap.rot;
      airportModelsGroup.add(apModel);
    });
    scene.add(airportModelsGroup);

    // Helpers
    const isInitialLight = document.body.classList.contains('light-theme');
    const grid = new THREE.GridHelper(
      80000,
      400,
      isInitialLight ? 0x94a3b8 : 0x222222,
      isInitialLight ? 0xcbd5e1 : 0x181818,
    );
    grid.name = 'gridHelper';
    // Local ENU space: origin is the anchor, grid lies flat in XZ (East/South) plane
    scene.add(grid);

    const handleGridThemeChange = (e: Event) => {
      const theme = (e as CustomEvent).detail as 'light' | 'dark';
      const isLight = theme === 'light';
      const g = scene.getObjectByName('gridHelper') as THREE.GridHelper;
      if (g && Array.isArray(g.material)) {
        g.material[0].color.setHex(isLight ? 0x94a3b8 : 0x222222);
        g.material[1].color.setHex(isLight ? 0xcbd5e1 : 0x181818);
      } else if (g && g.material) {
        (g.material as THREE.LineBasicMaterial).color.setHex(
          isLight ? 0x94a3b8 : 0x222222,
        );
      }
    };
    window.addEventListener(
      'theme-change',
      handleGridThemeChange as EventListener,
    );

    // Active Route Ribbon Renderer
    let routeMesh: THREE.Mesh | null = null;

    const buildRouteRibbon = (coords: [number, number][]) => {
      const vertices: number[] = [];
      const indices: number[] = [];
      const width = 6.0; // 6 meters wide road ribbon

      const localPoints = coords.map((c) => {
        return gpsToScene(
          c[0],
          c[1],
          groundHeightRef.current(c[0], c[1]) + 0.3,
        );
      });

      for (let i = 0; i < localPoints.length; i++) {
        const current = localPoints[i];
        const tangent = new THREE.Vector3();

        if (i === 0) {
          tangent.copy(localPoints[1]).sub(current).normalize();
        } else if (i === localPoints.length - 1) {
          tangent
            .copy(current)
            .sub(localPoints[i - 1])
            .normalize();
        } else {
          const prev = localPoints[i - 1];
          const next = localPoints[i + 1];
          tangent.copy(next).sub(prev).normalize();
        }

        // Project tangent onto local horizontal plane (Y-up local space)
        const upVec = new THREE.Vector3(0, 1, 0);
        const dotUp = tangent.dot(upVec);
        const horiz = tangent
          .clone()
          .addScaledVector(upVec, -dotUp)
          .normalize();
        const normal = new THREE.Vector3()
          .crossVectors(upVec, horiz)
          .normalize();
        const left = current.clone().addScaledVector(normal, width / 2);
        const right = current.clone().addScaledVector(normal, -width / 2);

        vertices.push(left.x, left.y, left.z);
        vertices.push(right.x, right.y, right.z);

        if (i < localPoints.length - 1) {
          const base = i * 2;
          indices.push(base, base + 1, base + 2);
          indices.push(base + 1, base + 3, base + 2);
        }
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(vertices, 3),
      );
      geometry.setIndex(indices);
      geometry.computeVertexNormals();

      const material = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0xffaa00,
        emissiveIntensity: 0.5,
        roughness: 0.5,
        metalness: 0.2,
        side: THREE.DoubleSide,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1,
      });

      return new THREE.Mesh(geometry, material);
    };

    // Route animation variables
    let routeCoords: [number, number][] = [];
    const lastCarPos = new THREE.Vector3();

    const unsubRoute = onRouteChange((route) => {
      if (routeMesh) {
        scene.remove(routeMesh);
        routeMesh.geometry.dispose();
        (routeMesh.material as THREE.Material).dispose();
        routeMesh = null;
      }

      const carGroup = carGroupRef.current;

      if (route && route.geometry && route.geometry.length > 0) {
        routeMesh = buildRouteRibbon(route.geometry);
        scene.add(routeMesh);

        routeCoords = route.geometry;
        const localPoints = route.geometry.map(([lng, lat]) => {
          return gpsToScene(
            lng,
            lat,
            groundHeightRef.current(lng, lat) + 0.4, // sits slightly on top of ribbon
          );
        });
        const routePath = new PolylinePath(localPoints);
        routeCurveRef.current = routePath;

        const isAirport =
          route.destination.name.toLowerCase().includes('airport') ||
          route.distanceKm > 20;
        isAirportRouteRef.current = isAirport;

        if (isAirport) {
          const freiburgPoints = localPoints.filter((pt) => pt.length() < 7500);
          const fPoints =
            freiburgPoints.length >= 2
              ? freiburgPoints
              : localPoints.slice(0, Math.min(5, localPoints.length));
          freiburgCurveRef.current = new PolylinePath(fPoints);

          const cutIdx = Math.max(localPoints.length - 8, 0);
          const aPoints = localPoints.slice(cutIdx);
          const finalAPoints =
            aPoints.length >= 2
              ? aPoints
              : localPoints.slice(Math.max(localPoints.length - 2, 0));
          airportCurveRef.current = new PolylinePath(finalAPoints);

          animDurationRef.current = 28000; // 28 seconds for airport transfers

          const airportName = route.destination.name
            .replace(/\(.*?\)/g, '')
            .trim();
          setTunnelText(
            lang === 'de'
              ? `Verlasse Freiburg... Fahrt zum ${airportName}`
              : `Leaving Freiburg... Heading to ${airportName}`,
          );
        } else {
          freiburgCurveRef.current = null;
          airportCurveRef.current = null;
          // Realistic city driving duration (~30 m/s virtual speed)
          const pathMeters = routePath.totalLength;
          animDurationRef.current = Math.max(
            Math.min((pathMeters / 30) * 1000, 50000),
            22000,
          );
        }

        animElapsedRef.current = 0;
        lastFrameTime = performance.now();
        updateAnimStatus('playing');

        // Default to chase mode when a new route is calculated
        setCamMode('chase');

        if (carGroup) {
          carGroup.visible = true;
          const startPos = localPoints[0];
          const startTangent = routePath.getTangentAt(0);
          carGroup.position.copy(startPos);
          carGroup.quaternion.copy(ecefQuat(startTangent, LOCAL_UP));
          lastCarPos.copy(startPos);
          lastCarPosRef.current.copy(startPos);

          const forwardDir = new THREE.Vector3(
            startTangent.x,
            startTangent.y,
            startTangent.z,
          );
          const upVec = new THREE.Vector3(0, 1, 0);
          forwardDir.addScaledVector(upVec, -forwardDir.dot(upVec)).normalize();
          const startCamPos = startPos.clone().addScaledVector(forwardDir, -14);
          startCamPos.addScaledVector(upVec, 5.5);

          camera.position.copy(startCamPos);
          controls.target.copy(startPos);
          camera.lookAt(startPos);
          controls.update();
        }
      } else {
        routeCurveRef.current = null;
        routeCoords = [];
        isAirportRouteRef.current = false;
        freiburgCurveRef.current = null;
        airportCurveRef.current = null;
        animElapsedRef.current = 0;
        updateAnimStatus('idle');
        if (carGroup) {
          carGroup.visible = false;
        }
        setCamMode('orbit');
      }
    });

    // Animation loop
    let animationFrameId: number;
    let loopFrame = 0;
    let lastFrameTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      loopFrame++;

      const carGroup = carGroupRef.current;

      if (routeCurveRef.current && carGroup) {
        const now = performance.now();
        const dt = Math.min(now - lastFrameTime, 100);
        lastFrameTime = now;

        if (animStatusRef.current === 'playing') {
          animElapsedRef.current += dt;
        }

        const duration = animDurationRef.current;
        const elapsed = animElapsedRef.current;
        const t = Math.min(elapsed / duration, 1.0);

        let pos = new THREE.Vector3();
        let tangent = new THREE.Vector3();

        const isAirport = isAirportRouteRef.current;
        const fCurve = freiburgCurveRef.current;
        const aCurve = airportCurveRef.current;

        if (isAirport && fCurve && aCurve) {
          if (t < 0.4) {
            // Phase 1: Drive Freiburg
            if (animStatusRef.current === 'tunneling') {
              updateAnimStatus('playing');
            }
            const subT = t / 0.4;
            pos = fCurve.getPointAt(subT);
            tangent = fCurve.getTangentAt(subT);
            carGroup.visible = true;
          } else if (t < 0.55) {
            // Phase 2: Tunneling
            if (animStatusRef.current !== 'tunneling') {
              updateAnimStatus('tunneling');
            }
            carGroup.visible = false;

            // Pan camera target smoothly from Freiburg exit to Airport entry
            const startTarget = fCurve.getPointAt(1.0);
            const endTarget = aCurve.getPointAt(0.0);
            const panT = (t - 0.4) / 0.15;

            const currentTarget = startTarget.clone().lerp(endTarget, panT);
            controls.target.copy(currentTarget);

            // Also transition camera location
            const nextTangent = aCurve.getTangentAt(0.0);
            const nextForward = new THREE.Vector3(
              nextTangent.x,
              nextTangent.y,
              nextTangent.z,
            );
            const upVec = new THREE.Vector3(0, 1, 0);
            nextForward
              .addScaledVector(upVec, -nextForward.dot(upVec))
              .normalize();
            const endCam = endTarget.clone().addScaledVector(nextForward, -16);
            endCam.addScaledVector(upVec, 6.5);

            camera.position.lerp(endCam, 0.08);

            pos.copy(startTarget);
            tangent.copy(fCurve.getTangentAt(1.0));
          } else {
            // Phase 3: Drive Airport
            if (animStatusRef.current === 'tunneling') {
              updateAnimStatus('playing');
            }
            const subT = (t - 0.55) / 0.45;
            pos = aCurve.getPointAt(subT);
            tangent = aCurve.getTangentAt(subT);
            carGroup.visible = true;
          }
        } else {
          // Regular local route
          pos = routeCurveRef.current.getPointAt(t);
          tangent = routeCurveRef.current.getTangentAt(t);
          carGroup.visible = true;
        }

        const carDelta = pos.clone().sub(lastCarPosRef.current);
        lastCarPosRef.current.copy(pos);

        // Smooth steering via yaw interpolation (stable, no gimbal issues)
        const upV = new THREE.Vector3(0, 1, 0);
        const eastV = new THREE.Vector3(
          LOCAL_EAST.x,
          LOCAL_EAST.y,
          LOCAL_EAST.z,
        );
        const northV = new THREE.Vector3(
          LOCAL_NORTH.x,
          LOCAL_NORTH.y,
          LOCAL_NORTH.z,
        );
        const curFwd = new THREE.Vector3(0, 0, -1).applyQuaternion(
          carGroup.quaternion,
        );
        curFwd.addScaledVector(upV, -curFwd.dot(upV)).normalize();
        const curYaw = Math.atan2(curFwd.dot(eastV), curFwd.dot(northV));
        const tgtFwd = new THREE.Vector3(tangent.x, tangent.y, tangent.z);
        tgtFwd.addScaledVector(upV, -tgtFwd.dot(upV)).normalize();
        const tgtYaw = Math.atan2(tgtFwd.dot(eastV), tgtFwd.dot(northV));
        let dy = tgtYaw - curYaw;
        if (dy < -Math.PI) dy += Math.PI * 2;
        if (dy > Math.PI) dy -= Math.PI * 2;
        const blendedYaw = curYaw + dy * 0.18;
        carGroup.quaternion.copy(
          ecefQuat(
            {
              x:
                northV.x * Math.cos(blendedYaw) +
                eastV.x * Math.sin(blendedYaw),
              y:
                northV.y * Math.cos(blendedYaw) +
                eastV.y * Math.sin(blendedYaw),
              z:
                northV.z * Math.cos(blendedYaw) +
                eastV.z * Math.sin(blendedYaw),
            },
            LOCAL_UP,
          ),
        );

        carGroup.position.copy(pos);

        if (
          camModeRef.current === 'chase' &&
          animStatusRef.current !== 'tunneling'
        ) {
          controls.enabled = true;
          // Smoothly translate camera and target with the moving car
          camera.position.add(carDelta);
          controls.target.add(carDelta);
        }

        // Handle arrived state
        if (t >= 1.0 && animStatusRef.current !== 'arrived') {
          updateAnimStatus('arrived');
        }

        if (camModeRef.current === 'overview') {
          controls.enabled = false;
          const bounds = new THREE.Box3();
          routeCoords.forEach(([lng, lat]) => {
            const pt = gpsToScene(
              lng,
              lat,
              groundHeightRef.current(lng, lat) + 0.3,
            );
            bounds.expandByPoint(pt);
          });
          const center = bounds.getCenter(new THREE.Vector3());
          const size = bounds.getSize(new THREE.Vector3());
          // Max horizontal (XZ plane) dimension in local ENU space
          const maxDim = Math.max(size.x, size.z);

          const targetCamPos = center
            .clone()
            .addScaledVector(new THREE.Vector3(0, 1, 0), maxDim * 1.2);
          camera.position.lerp(targetCamPos, 0.05);
          controls.target.lerp(center, 0.05);
          camera.lookAt(controls.target);
        } else if (camModeRef.current === 'orbit') {
          controls.enabled = true;
        }
      } else {
        controls.enabled = true;
      }

      // Dynamic Ribbons Scale & Billboarding (Face camera)
      const ribbonsGroup = scene.getObjectByName('districtsRibbons');
      if (ribbonsGroup) {
        // Local ENU space: up is +Y, anchor is at origin
        const camHeight = camera.position.y;
        const minHeight = 100;
        const maxHeight = 500;
        const minScale = 2.0;
        const maxScale = 5.0;

        let scaleFactor = maxScale;
        if (camHeight < minHeight) {
          scaleFactor = minScale;
        } else if (camHeight < maxHeight) {
          const t = (camHeight - minHeight) / (maxHeight - minHeight);
          scaleFactor = minScale + t * (maxScale - minScale);
        }

        ribbonsGroup.children.forEach((child) => {
          child.scale.set(scaleFactor, scaleFactor, scaleFactor);
          child.quaternion.copy(camera.quaternion); // Face camera for maximum readability
          child.visible = true;
        });
      }

      if (controls.enabled) {
        if (camModeRef.current === 'orbit') {
          controls.target.set(0, 0, 0);
        }
        controls.update();
      }

      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      updateTiles();
      if (isMobile) {
        renderer.render(scene, camera);
      } else {
        composer.render();
      }
    };
    animate();

    return () => {
      unsubRoute();
      window.removeEventListener(
        'theme-change',
        handleGridThemeChange as EventListener,
      );
      cancelAnimationFrame(animationFrameId);
    };
  }, [mode, scene, camera, renderer, composer, controls]);

  const handlePlayPause = () => {
    if (
      animStatusRef.current === 'playing' ||
      animStatusRef.current === 'tunneling'
    ) {
      updateAnimStatus('paused');
    } else if (
      animStatusRef.current === 'paused' ||
      animStatusRef.current === 'arrived'
    ) {
      if (animStatusRef.current === 'arrived') {
        animElapsedRef.current = 0;
      }
      updateAnimStatus('playing');
    }
  };

  const handleReset = () => {
    animElapsedRef.current = 0;
    updateAnimStatus('playing');
    const carGroup = carGroupRef.current;
    const path = routeCurveRef.current;
    if (path && carGroup) {
      const startPos = path.getPointAt(0);
      const startTangent = path.getTangentAt(0);
      carGroup.position.copy(startPos);
      carGroup.quaternion.copy(ecefQuat(startTangent, LOCAL_UP));
      carGroup.visible = true;
      lastCarPosRef.current.copy(startPos);
      if (controls && camera) {
        if (camModeRef.current === 'chase') {
          const forwardDir = new THREE.Vector3(
            startTangent.x,
            startTangent.y,
            startTangent.z,
          );
          const upVec = new THREE.Vector3(0, 1, 0);
          forwardDir.addScaledVector(upVec, -forwardDir.dot(upVec)).normalize();
          const startCamPos = startPos.clone().addScaledVector(forwardDir, -14);
          startCamPos.addScaledVector(upVec, 5.5);
          camera.position.copy(startCamPos);
        }
        controls.target.copy(startPos);
        controls.target.addScaledVector(new THREE.Vector3(0, 1, 0), 1.2);
        camera.lookAt(controls.target);
        controls.update();
      }
    }
  };

  const handleSetCamMode = (newMode: 'chase' | 'overview' | 'orbit') => {
    setCamMode(newMode);
    if (newMode === 'chase' && carGroupRef.current && camera && controls) {
      const pos = carGroupRef.current.position;
      const forwardDir = new THREE.Vector3(0, 0, -1).applyQuaternion(
        carGroupRef.current.quaternion,
      );
      const upVec = new THREE.Vector3(0, 1, 0);
      forwardDir.addScaledVector(upVec, -forwardDir.dot(upVec)).normalize();
      const idealCamPos = pos.clone().addScaledVector(forwardDir, -14);
      idealCamPos.addScaledVector(upVec, 5.5);
      camera.position.copy(idealCamPos);
      controls.target.copy(pos);
      controls.target.addScaledVector(upVec, 1.2);
      controls.update();
    }
  };

  const lang =
    typeof window !== 'undefined'
      ? window.location.pathname.split('/')[1] || 'de'
      : 'de';

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      {/* Floating Camera Control HUD */}
      {!loading && (
        <CameraHud
          camMode={camMode}
          setCamMode={handleSetCamMode}
          animStatus={animStatus}
          onPlayPause={handlePlayPause}
          onReset={handleReset}
        />
      )}

      {/* Autobahn Tunneling Overlay */}
      <TunnelOverlay
        visible={animStatus === 'tunneling'}
        isGerman={lang === 'de'}
        tunnelText={tunnelText}
      />

      {loading && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-hud)',
            color: '#888888',
            fontSize: 16,
            fontFamily: 'sans-serif',
            gap: 16,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              border: '3px solid rgba(255, 170, 0, 0.2)',
              borderTopColor: '#ffaa00',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          Loading 3D city model...
        </div>
      )}
    </div>
  );
}

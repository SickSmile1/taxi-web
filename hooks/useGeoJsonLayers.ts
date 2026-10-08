'use client';

import { TilesRenderer } from '3d-tiles-renderer/three';
import { useCallback, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { p } from '@/lib/base-path';
import {
  ANCHOR_LAT,
  ANCHOR_LNG,
  ECEF_ANCHOR,
  ENU_EAST,
  ENU_NORTH,
  ENU_UP,
  ecefToEnu,
  gpsToEcef,
} from '@/lib/geo-utils';

function gpsToScene(lng: number, lat: number, height = 0): THREE.Vector3 {
  const enu = ecefToEnu(gpsToEcef(lng, lat, height));
  return new THREE.Vector3(enu.x, enu.y, enu.z);
}

function getFeatureCentroid(geometry: any): { lng: number; lat: number } {
  let sumLng = 0;
  let sumLat = 0;
  let count = 0;

  const addPoint = (lng: number, lat: number) => {
    sumLng += lng;
    sumLat += lat;
    count++;
  };

  const processCoords = (arr: any) => {
    if (typeof arr[0] === 'number') {
      addPoint(arr[0], arr[1]);
    } else {
      arr.forEach((sub: any) => processCoords(sub));
    }
  };

  if (geometry && geometry.coordinates) {
    processCoords(geometry.coordinates);
  }

  if (count === 0) return { lng: ANCHOR_LNG, lat: ANCHOR_LAT };
  return { lng: sumLng / count, lat: sumLat / count };
}

function createDistrictRibbon(
  name: string,
  centroid: { lng: number; lat: number },
  groundHeight: (lng: number, lat: number) => number,
  group: THREE.Group,
  renderer?: THREE.WebGLRenderer,
) {
  const ribbonCurvePoints = [
    new THREE.Vector3(-30, 0, -2),
    new THREE.Vector3(-25, 4, -1),
    new THREE.Vector3(-20, -2, 1),
    new THREE.Vector3(-12, 0, 0.2),
    new THREE.Vector3(-6, 1, 0.4),
    new THREE.Vector3(0, 1.5, 0.5),
    new THREE.Vector3(6, 1, 0.4),
    new THREE.Vector3(12, 0, 0.2),
    new THREE.Vector3(20, -2, 1),
    new THREE.Vector3(25, 4, -1),
    new THREE.Vector3(30, 0, -2),
  ];

  const curve = new THREE.CatmullRomCurve3(ribbonCurvePoints);
  const segments = 64;
  const curvePoints = curve.getPoints(segments);

  const frontVertices: number[] = [];
  const frontIndices: number[] = [];
  const frontUvs: number[] = [];
  const ribbonHeight = 7.5;

  curvePoints.forEach((pt, i) => {
    frontVertices.push(pt.x, pt.y + ribbonHeight / 2, pt.z);
    frontVertices.push(pt.x, pt.y - ribbonHeight / 2, pt.z);

    const u = i / segments;
    frontUvs.push(u, 1.0);
    frontUvs.push(u, 0.0);

    if (i < segments) {
      const base = i * 2;
      frontIndices.push(base, base + 1, base + 2);
      frontIndices.push(base + 1, base + 3, base + 2);
    }
  });

  const frontGeom = new THREE.BufferGeometry();
  frontGeom.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(frontVertices, 3),
  );
  frontGeom.setAttribute('uv', new THREE.Float32BufferAttribute(frontUvs, 2));
  frontGeom.setIndex(frontIndices);
  frontGeom.computeVertexNormals();

  const backVertices: number[] = [];
  const backIndices: number[] = [];
  const backUvs: number[] = [];

  curvePoints.forEach((pt, i) => {
    backVertices.push(pt.x, pt.y + ribbonHeight / 2, pt.z);
    backVertices.push(pt.x, pt.y - ribbonHeight / 2, pt.z);

    const u = i / segments;
    backUvs.push(1.0 - u, 1.0);
    backUvs.push(1.0 - u, 0.0);

    if (i < segments) {
      const base = i * 2;
      backIndices.push(base, base + 2, base + 1);
      backIndices.push(base + 1, base + 2, base + 3);
    }
  });

  const backGeom = new THREE.BufferGeometry();
  backGeom.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(backVertices, 3),
  );
  backGeom.setAttribute('uv', new THREE.Float32BufferAttribute(backUvs, 2));
  backGeom.setIndex(backIndices);
  backGeom.computeVertexNormals();

  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#5e0808';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#ffe066';
    ctx.lineWidth = 14;
    ctx.strokeRect(12, 12, canvas.width - 24, canvas.height - 24);

    ctx.lineWidth = 4;
    ctx.strokeRect(26, 26, canvas.width - 52, canvas.height - 52);

    ctx.fillStyle = '#ffe066';

    ctx.fillRect(26, 26, 32, 6);
    ctx.fillRect(26, 26, 6, 32);
    ctx.fillRect(40, 40, 10, 10);

    ctx.fillRect(canvas.width - 58, 26, 32, 6);
    ctx.fillRect(canvas.width - 32, 26, 6, 32);
    ctx.fillRect(canvas.width - 50, 40, 10, 10);

    ctx.fillRect(26, canvas.height - 32, 32, 6);
    ctx.fillRect(26, canvas.height - 58, 6, 32);
    ctx.fillRect(40, canvas.height - 50, 10, 10);

    ctx.fillRect(canvas.width - 58, canvas.height - 32, 32, 6);
    ctx.fillRect(canvas.width - 32, canvas.height - 58, 6, 32);
    ctx.fillRect(canvas.width - 50, canvas.height - 50, 10, 10);

    ctx.fillStyle = '#ffe066';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = "bold 110px 'CloisterBlack', 'Georgia', serif";
    ctx.fillText(name, canvas.width / 2, canvas.height / 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  if (renderer) {
    texture.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());
  }
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;

  const ribbonMat = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.FrontSide,
    transparent: true,
    opacity: 0.95,
  });

  const frontMesh = new THREE.Mesh(frontGeom, ribbonMat);
  const backMesh = new THREE.Mesh(backGeom, ribbonMat);

  const ribbonGroup = new THREE.Group();
  ribbonGroup.name = 'altstadtRibbon';
  ribbonGroup.add(frontMesh);
  ribbonGroup.add(backMesh);

  const scenePt = gpsToScene(
    centroid.lng,
    centroid.lat,
    groundHeight(centroid.lng, centroid.lat) + 140,
  );
  ribbonGroup.position.set(scenePt.x, scenePt.y, scenePt.z);

  ribbonGroup.rotation.y = Math.PI / 4;

  group.add(ribbonGroup);
}

interface UseGeoJsonLayersParams {
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  groundHeight: (lng: number, lat: number) => number;
  onLoaded?: () => void;
}

interface UseGeoJsonLayersReturn {
  updateTiles: () => void;
}

export function useGeoJsonLayers({
  scene,
  renderer,
  camera,
  groundHeight,
  onLoaded,
}: UseGeoJsonLayersParams): UseGeoJsonLayersReturn {
  const sceneRef = useRef(scene);
  sceneRef.current = scene;
  const onLoadedRef = useRef(onLoaded);
  onLoadedRef.current = onLoaded;
  const groundHeightRef = useRef(groundHeight);
  groundHeightRef.current = groundHeight;
  const tilesRendererRef = useRef<TilesRenderer | null>(null);

  useEffect(() => {
    if (!scene || !renderer) return;

    let cancelled = false;

    // Track all objects added to scene for proper disposal
    const addedObjects: THREE.Object3D[] = [];

    // Extruded districts group
    const districtsGroup = new THREE.Group();
    districtsGroup.name = 'districts';
    sceneRef.current.add(districtsGroup);
    addedObjects.push(districtsGroup);

    // Victorian ribbons group
    const ribbonsGroup = new THREE.Group();
    ribbonsGroup.name = 'districtsRibbons';
    sceneRef.current.add(ribbonsGroup);
    addedObjects.push(ribbonsGroup);

    // Load GeoJSON districts and render borders instead of solid fills to eliminate rendering artifacts
    fetch(p('/data/districts.geojson'))
      .then((res) => res.json())
      .then((geojson) => {
        if (cancelled) return;

        geojson.features.forEach((feature: any) => {
          const colorHex = feature.properties.color || '#444444';
          const lineMaterial = new THREE.LineBasicMaterial({
            color: new THREE.Color(colorHex),
          });

          const geomType = feature.geometry.type;
          const coords = feature.geometry.coordinates;

          const addDistrictBorder = (rings: any[][]) => {
            rings.forEach((ring) => {
              if (!ring || ring.length < 2) return;
              const points = ring.map(([lng, lat]) => {
                return gpsToScene(
                  lng,
                  lat,
                  groundHeightRef.current(lng, lat) + 0.05,
                );
              });
              const geometry = new THREE.BufferGeometry().setFromPoints(points);
              const line = new THREE.LineLoop(geometry, lineMaterial);
              districtsGroup.add(line);
            });
          };

          if (geomType === 'Polygon') {
            addDistrictBorder(coords);
          } else if (geomType === 'MultiPolygon') {
            coords.forEach((polyCoords: any) => {
              addDistrictBorder(polyCoords);
            });
          }

          const name = feature.properties.name || feature.properties.NAME;
          if (name && typeof name === 'string' && name !== 'undefined') {
            const centroid = getFeatureCentroid(feature.geometry);
            createDistrictRibbon(
              name,
              centroid,
              groundHeightRef.current,
              ribbonsGroup,
              renderer,
            );
          }
        });

        onLoadedRef.current?.();
      })
      .catch((err) => {
        console.error('Failed to load districts geojson:', err);
        onLoadedRef.current?.();
      });

    const isInitialLight = document.body.classList.contains('light-theme');

    const roadMat = new THREE.MeshStandardMaterial({
      color: isInitialLight ? 0xbac5d4 : 0x1f293d,
      roughness: 0.8,
      metalness: 0.1,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });

    const handleThemeChange = (e: Event) => {
      const theme = (e as CustomEvent).detail as 'light' | 'dark';
      const isLight = theme === 'light';
      roadMat.color.setHex(isLight ? 0xbac5d4 : 0x1f293d);
    };
    window.addEventListener('theme-change', handleThemeChange as EventListener);

    // Load GeoJSON streets and build wide 3D road meshes
    fetch(p('/data/freiburg-streets-geom.geojson'))
      .then((res) => res.json())
      .then((geojson) => {
        if (cancelled) return;

        const vertices: number[] = [];
        const indices: number[] = [];
        let vertexIndex = 0;

        geojson.features.forEach((feature: any) => {
          const coords = feature.geometry?.coordinates;
          if (!coords || coords.length < 2) return;

          const highway = feature.properties?.highway || '';
          let width = 4.0;
          if (['motorway', 'trunk', 'primary'].includes(highway)) {
            width = 8.0;
          } else if (['secondary', 'tertiary'].includes(highway)) {
            width = 6.0;
          }

          const localPoints = coords.map((c: any) => {
            return gpsToScene(
              c[0],
              c[1],
              groundHeightRef.current(c[0], c[1]) + 0.03,
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
              const base = vertexIndex + i * 2;
              indices.push(base, base + 1, base + 2);
              indices.push(base + 1, base + 3, base + 2);
            }
          }
          vertexIndex += localPoints.length * 2;
        });

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
          'position',
          new THREE.Float32BufferAttribute(vertices, 3),
        );
        geometry.setIndex(indices);
        geometry.computeVertexNormals();

        const roadMesh = new THREE.Mesh(geometry, roadMat);
        roadMesh.receiveShadow = true;
        sceneRef.current.add(roadMesh);
        addedObjects.push(roadMesh);
      })
      .catch((err) => console.error('Failed to load streets geojson:', err));

    // Load LoD2 3D buildings via TilesRenderer
    const tilesetUrl = p('/data/freiburg-3d/tileset.json');
    const tilesRenderer = new TilesRenderer(tilesetUrl);
    tilesRenderer.setCamera(camera);
    tilesRenderer.setResolutionFromRenderer(camera, renderer);
    tilesRenderer.errorTarget = 6;
    tilesRenderer.loadSiblings = true;
    tilesRenderer.maxDepth = 18;

    const buildingMatEcef = new THREE.MeshStandardMaterial({
      color: isInitialLight ? 0xc89620 : 0xe6b032,
      emissive: isInitialLight ? 0x221800 : 0x4a340b,
      emissiveIntensity: isInitialLight ? 0.4 : 0.8,
      roughness: 0.2,
      metalness: 0.8,
      transparent: true,
      opacity: isInitialLight ? 0.65 : 0.5,
    });

    tilesRenderer.addEventListener('load-model', (event: any) => {
      const model = event.scene as THREE.Group;
      model.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh) {
          child.material = buildingMatEcef;
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    });

    tilesRenderer.addEventListener('load-error', (event: any) => {
      const url = event.url || 'unknown';
      console.warn(
        `TilesRenderer load error for ${url}:`,
        event.error?.message,
      );
    });

    const resetInterval = window.setInterval(() => {
      tilesRenderer.resetFailedTiles();
    }, 5000);

    // Reposition the 3D tiles into local ENU scene space.
    // Tiles are stored as raw ECEF; this matrix maps ECEF -> local (X=East, Y=Up, Z=-North),
    // centering the anchor at the scene origin.
    const er = ENU_EAST,
      nr = ENU_NORTH,
      ur = ENU_UP,
      ax = ECEF_ANCHOR;
    const R00 = er.x,
      R01 = er.y,
      R02 = er.z;
    const R10 = ur.x,
      R11 = ur.y,
      R12 = ur.z;
    const R20 = -nr.x,
      R21 = -nr.y,
      R22 = -nr.z;
    const m = new THREE.Matrix4().set(
      R00,
      R01,
      R02,
      -(R00 * ax.x + R01 * ax.y + R02 * ax.z),
      R10,
      R11,
      R12,
      -(R10 * ax.x + R11 * ax.y + R12 * ax.z),
      R20,
      R21,
      R22,
      -(R20 * ax.x + R21 * ax.y + R22 * ax.z),
      0,
      0,
      0,
      1,
    );
    tilesRenderer.group.matrixAutoUpdate = false;
    tilesRenderer.group.matrix.copy(m);

    sceneRef.current.add(tilesRenderer.group);
    addedObjects.push(tilesRenderer.group);
    tilesRendererRef.current = tilesRenderer;

    return () => {
      cancelled = true;
      window.removeEventListener(
        'theme-change',
        handleThemeChange as EventListener,
      );

      // Dispose and remove all tracked objects
      addedObjects.forEach((obj) => {
        obj.traverse((child) => {
          if (child instanceof THREE.Mesh || child instanceof THREE.Line) {
            child.geometry.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach((m) => {
                if (
                  m instanceof THREE.MeshBasicMaterial ||
                  m instanceof THREE.MeshStandardMaterial
                ) {
                  if (m.map) m.map.dispose();
                }
                m.dispose();
              });
            } else {
              const mat = child.material as THREE.Material;
              if (
                mat instanceof THREE.MeshBasicMaterial ||
                mat instanceof THREE.MeshStandardMaterial
              ) {
                if (mat.map) mat.map.dispose();
              }
              mat.dispose();
            }
          }
        });
        sceneRef.current.remove(obj);
      });
      districtsGroup.clear();
      ribbonsGroup.clear();
      window.clearInterval(resetInterval);
      tilesRendererRef.current?.dispose();
      tilesRendererRef.current = null;
    };
  }, [scene, renderer, camera]);

  const updateTiles = useCallback(() => {
    const tr = tilesRendererRef.current;
    if (tr) {
      tr.setCamera(camera);
      tr.setResolutionFromRenderer(camera, renderer);
      tr.update();
    }
  }, [camera, renderer]);

  return { updateTiles };
}

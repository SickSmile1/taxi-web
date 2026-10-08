import * as THREE from 'three';

export function createMuenster() {
  const group = new THREE.Group();

  // 1. Ink / Fine-Line Engraving Material System
  const inkColor = new THREE.Color('#1a1a1a');
  const lineMaterial = new THREE.LineBasicMaterial({
    color: inkColor,
    linewidth: 1,
  });

  // Toon-shaded materials for red-brown sandstone, clay roofs, and candle glow
  const stoneToonMaterial = new THREE.MeshToonMaterial({
    color: 0x8c533c, // Warm red-brown sandstone
  });

  const roofToonMaterial = new THREE.MeshToonMaterial({
    color: 0x4a2518, // Dark brownish-red clay roof tile color
  });

  const glowMaterial = new THREE.MeshStandardMaterial({
    color: 0xffaa00, // Warm candle yellow
    emissive: 0xff5500, // Radiant orange-yellow emissive
    emissiveIntensity: 2.0, // High glow intensity
    roughness: 0.1,
    metalness: 0.1,
  });

  // Helper to build structural components wrapped in line outlines for the engraving effect
  function createEngravedMesh(
    geometry: THREE.BufferGeometry,
    material: THREE.Material,
  ) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    // Edges geometry for the fine-line hatching overlay
    const edges = new THREE.EdgesGeometry(geometry, 25);
    const lineSegments = new THREE.LineSegments(edges, lineMaterial);
    mesh.add(lineSegments);

    return mesh;
  }

  // 2. Parametric Architectural Constants
  const NAVE_LENGTH = 40;
  const NAVE_WIDTH = 10;
  const NAVE_HEIGHT = 16;
  const ROOF_HEIGHT = 8;
  const TRANSEPT_LENGTH = 32;
  const TRANSEPT_WIDTH = 10;
  const SIDE_AISLE_WIDTH = 4;
  const SIDE_AISLE_HEIGHT = 9;
  const SIDE_AISLE_ROOF_HEIGHT = 4;

  // Helper for TriPrismGeometry (Triangular Nave Roof)
  const createTriPrismGeometry = (
    width: number,
    height: number,
    length: number,
  ) => {
    const geo = new THREE.BufferGeometry();
    const w = width / 2;
    const h = height;
    const l = length / 2;

    const vertices = new Float32Array([
      // Front Face
      -w,
      0,
      l,
      w,
      0,
      l,
      0,
      h,
      l,
      // Back Face
      -w,
      0,
      -l,
      0,
      h,
      -l,
      w,
      0,
      -l,
      // Left Slanted Face
      -w,
      0,
      l,
      0,
      h,
      l,
      0,
      h,
      -l,
      -w,
      0,
      l,
      0,
      h,
      -l,
      -w,
      0,
      -l,
      // Right Slanted Face
      w,
      0,
      l,
      0,
      h,
      -l,
      0,
      h,
      l,
      w,
      0,
      l,
      w,
      0,
      -l,
      0,
      h,
      -l,
      // Bottom Base Face
      -w,
      0,
      l,
      -w,
      0,
      -l,
      w,
      0,
      -l,
      -w,
      0,
      l,
      w,
      0,
      -l,
      w,
      0,
      l,
    ]);

    geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geo.computeVertexNormals();
    return geo;
  };

  // Helper for LeanToRoofGeometry (Side Aisles Lean-to Roofs)
  const createLeanToRoofGeometry = (
    width: number,
    height: number,
    length: number,
    isLeft: boolean,
  ) => {
    const geo = new THREE.BufferGeometry();
    const w = width;
    const l = length / 2;
    const dir = isLeft ? 1 : -1;

    const vertices = new Float32Array([
      // Front Triangle
      0,
      height,
      l,
      dir * w,
      0,
      l,
      0,
      0,
      l,
      // Back Triangle
      0,
      height,
      -l,
      0,
      0,
      -l,
      dir * w,
      0,
      -l,
      // Slanted Slope Face
      0,
      height,
      l,
      dir * w,
      0,
      -l,
      dir * w,
      0,
      l,
      0,
      height,
      l,
      0,
      height,
      -l,
      dir * w,
      0,
      -l,
      // Vertical Inside Face
      0,
      height,
      l,
      0,
      0,
      l,
      0,
      0,
      -l,
      0,
      height,
      l,
      0,
      0,
      -l,
      0,
      height,
      -l,
    ]);
    geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geo.computeVertexNormals();
    return geo;
  };

  // A. Main Nave
  const naveGeometry = new THREE.BoxGeometry(
    NAVE_WIDTH,
    NAVE_HEIGHT,
    NAVE_LENGTH,
  );
  const nave = createEngravedMesh(naveGeometry, stoneToonMaterial);
  nave.position.y = NAVE_HEIGHT / 2;
  group.add(nave);

  // B. Main Nave Roof
  const naveRoofGeo = createTriPrismGeometry(
    NAVE_WIDTH,
    ROOF_HEIGHT,
    NAVE_LENGTH,
  );
  const naveRoof = createEngravedMesh(naveRoofGeo, roofToonMaterial);
  naveRoof.position.y = NAVE_HEIGHT;
  group.add(naveRoof);

  // C. Transept Wings (North & South Flanks - Cross Shape)
  const transeptGeo = new THREE.BoxGeometry(
    TRANSEPT_LENGTH,
    NAVE_HEIGHT,
    TRANSEPT_WIDTH,
  );
  const transept = createEngravedMesh(transeptGeo, stoneToonMaterial);
  transept.position.set(0, NAVE_HEIGHT / 2, 0);
  group.add(transept);

  const transeptRoofGeo = createTriPrismGeometry(
    TRANSEPT_WIDTH,
    ROOF_HEIGHT,
    TRANSEPT_LENGTH,
  );
  const transeptRoof = createEngravedMesh(transeptRoofGeo, roofToonMaterial);
  transeptRoof.rotation.y = Math.PI / 2;
  transeptRoof.position.y = NAVE_HEIGHT;
  group.add(transeptRoof);

  // D. Symmetrical Side Aisles & Lean-To Monopitch Roofs
  [-1, 1].forEach((side) => {
    // Wall Base
    const aisleWallGeo = new THREE.BoxGeometry(
      SIDE_AISLE_WIDTH,
      SIDE_AISLE_HEIGHT,
      NAVE_LENGTH,
    );
    const aisleWall = createEngravedMesh(aisleWallGeo, stoneToonMaterial);
    aisleWall.position.set(
      side * (NAVE_WIDTH / 2 + SIDE_AISLE_WIDTH / 2),
      SIDE_AISLE_HEIGHT / 2,
      0,
    );
    group.add(aisleWall);

    // Shed Roof matching the base wall perfectly
    const aisleRoofGeo = createLeanToRoofGeometry(
      SIDE_AISLE_WIDTH,
      SIDE_AISLE_ROOF_HEIGHT,
      NAVE_LENGTH,
      side === -1,
    );
    const aisleRoof = createEngravedMesh(aisleRoofGeo, roofToonMaterial);
    aisleRoof.position.set(side * (NAVE_WIDTH / 2), SIDE_AISLE_HEIGHT, 0);
    group.add(aisleRoof);
  });

  // E. Choir & Eastern Apse (Polygonal semi-cone structure)
  const apseRadius = NAVE_WIDTH / 2;
  const apseHeight = NAVE_HEIGHT;
  const apseSegments = 8;

  const apseGeo = new THREE.CylinderGeometry(
    apseRadius,
    apseRadius,
    apseHeight,
    apseSegments,
    1,
    false,
    0,
    Math.PI,
  );
  const apse = createEngravedMesh(apseGeo, stoneToonMaterial);
  apse.position.set(0, apseHeight / 2, NAVE_LENGTH / 2);
  group.add(apse);

  const apseRoofGeo = new THREE.ConeGeometry(
    apseRadius,
    ROOF_HEIGHT,
    apseSegments,
    1,
    false,
    0,
    Math.PI,
  );
  const apseRoof = createEngravedMesh(apseRoofGeo, roofToonMaterial);
  apseRoof.position.set(0, NAVE_HEIGHT + ROOF_HEIGHT / 2, NAVE_LENGTH / 2);
  group.add(apseRoof);

  // F. Vertical Spires & Instanced Buttress Pinnacles
  // Main West Spire (Octagonal Pyramid)
  const westSpireGeo = new THREE.ConeGeometry(4, 24, 8);
  const westSpire = createEngravedMesh(westSpireGeo, stoneToonMaterial);
  westSpire.position.set(0, NAVE_HEIGHT + 12, -NAVE_LENGTH / 2 + 2);
  group.add(westSpire);

  // Crossing Flèche Spire
  const flecheGeo = new THREE.ConeGeometry(1.5, 10, 6);
  const fleche = createEngravedMesh(flecheGeo, stoneToonMaterial);
  fleche.position.set(0, NAVE_HEIGHT + ROOF_HEIGHT + 5, 0);
  group.add(fleche);

  // Symmetrical Buttress Pinnacles (InstancedMesh)
  const pinnacleGeo = new THREE.ConeGeometry(0.6, 3, 4);
  const totalPinnacles = 16;
  const instancedPinnacles = new THREE.InstancedMesh(
    pinnacleGeo,
    stoneToonMaterial,
    totalPinnacles,
  );

  let pinIndex = 0;
  const dummy = new THREE.Object3D();

  for (let i = 0; i < 8; i++) {
    const zOffset = -NAVE_LENGTH / 2.5 + i * 5;
    if (Math.abs(zOffset) > TRANSEPT_WIDTH / 2 + 2) {
      dummy.position.set(
        -(NAVE_WIDTH / 2 + SIDE_AISLE_WIDTH),
        SIDE_AISLE_HEIGHT + 1.5,
        zOffset,
      );
      dummy.updateMatrix();
      instancedPinnacles.setMatrixAt(pinIndex++, dummy.matrix);

      dummy.position.set(
        NAVE_WIDTH / 2 + SIDE_AISLE_WIDTH,
        SIDE_AISLE_HEIGHT + 1.5,
        zOffset,
      );
      dummy.updateMatrix();
      instancedPinnacles.setMatrixAt(pinIndex++, dummy.matrix);
    }
  }
  group.add(instancedPinnacles);

  // Interior Grid Pillars (InstancedMesh)
  const pillarGeo = new THREE.CylinderGeometry(0.4, 0.4, NAVE_HEIGHT, 8);
  const instancedPillars = new THREE.InstancedMesh(
    pillarGeo,
    stoneToonMaterial,
    12,
  );
  let pillarIndex = 0;

  for (let i = 0; i < 6; i++) {
    const zPos = -NAVE_LENGTH / 2 + 6 + i * 5;
    [-NAVE_WIDTH / 2, NAVE_WIDTH / 2].forEach((xPos) => {
      dummy.position.set(xPos, NAVE_HEIGHT / 2, zPos);
      dummy.updateMatrix();
      instancedPillars.setMatrixAt(pillarIndex++, dummy.matrix);
    });
  }
  group.add(instancedPillars);

  // G. Glowing Gothic Window Meshes (Yellow Candle Light)
  const windowGeo = new THREE.BoxGeometry(0.12, 2.0, 0.8);
  for (let i = 0; i < 6; i++) {
    const zPos = -NAVE_LENGTH / 2.5 + i * 5.2;
    if (Math.abs(zPos) > TRANSEPT_WIDTH / 2 + 1) {
      // Left side wall window
      const winL = new THREE.Mesh(windowGeo, glowMaterial);
      winL.position.set(-NAVE_WIDTH / 2 - 0.02, NAVE_HEIGHT / 3, zPos);
      group.add(winL);

      // Right side wall window
      const winR = new THREE.Mesh(windowGeo, glowMaterial);
      winR.position.set(NAVE_WIDTH / 2 + 0.02, NAVE_HEIGHT / 3, zPos);
      group.add(winR);
    }
  }

  // 4 Glowing Belfry Windows on Tower sides
  const belfryWinGeo = new THREE.BoxGeometry(1.6, 3.2, 1.6);
  const towerZ = -NAVE_LENGTH / 2 + 2;
  const towerX = 0;
  const belfryHeight = NAVE_HEIGHT + 4;

  const belfryWin1 = new THREE.Mesh(belfryWinGeo, glowMaterial);
  belfryWin1.position.set(towerX, belfryHeight, towerZ + 2.02);
  group.add(belfryWin1);

  const belfryWin2 = new THREE.Mesh(belfryWinGeo, glowMaterial);
  belfryWin2.position.set(towerX, belfryHeight, towerZ - 2.02);
  group.add(belfryWin2);

  const belfryWin3 = new THREE.Mesh(belfryWinGeo, glowMaterial);
  belfryWin3.position.set(towerX + 2.02, belfryHeight, towerZ);
  group.add(belfryWin3);

  const belfryWin4 = new THREE.Mesh(belfryWinGeo, glowMaterial);
  belfryWin4.position.set(towerX - 2.02, belfryHeight, towerZ);
  group.add(belfryWin4);

  // 3. Align and Scale with the Freiburg Map Coordinate Space
  // Rotate 90 degrees to align the East-West longitudinal axis (Z axis of model) with X axis of map.
  group.rotation.y = Math.PI / 2;

  // Scale down by another 10% -> Scale is now 2.88
  group.scale.setScalar(2.88);

  return group;
}

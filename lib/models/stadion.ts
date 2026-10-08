import * as THREE from 'three';

const BRICK = 0x8a3a3a;
const WHITE = 0xcccccc;
const BLUE = 0x1a3356;
const PITCH_GREEN = 0x3b7a57;
const DARK = 0x333333;

function addStrut(
  g: THREE.Group,
  x1: number,
  y1: number,
  z1: number,
  x2: number,
  y2: number,
  z2: number,
  radius: number,
  mat: THREE.Material,
) {
  const start = new THREE.Vector3(x1, y1, z1);
  const end = new THREE.Vector3(x2, y2, z2);
  const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  const dir = new THREE.Vector3().subVectors(end, start);
  const len = dir.length();
  dir.normalize();
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, len, 6),
    mat,
  );
  mesh.position.copy(mid);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
  g.add(mesh);
}

export function createStadion(): THREE.Group {
  const g = new THREE.Group();

  const brickMat = new THREE.MeshStandardMaterial({
    color: BRICK,
    flatShading: true,
  });
  const whiteMat = new THREE.MeshStandardMaterial({
    color: WHITE,
    flatShading: true,
  });
  const blueMat = new THREE.MeshStandardMaterial({
    color: BLUE,
    flatShading: true,
  });
  const greenMat = new THREE.MeshStandardMaterial({
    color: PITCH_GREEN,
    flatShading: true,
  });
  const darkMat = new THREE.MeshStandardMaterial({
    color: DARK,
    flatShading: true,
  });

  const sLength = 100;
  const sWidth = 80;
  const sHeight = 22;

  // Pitch (placed in center, 60x40x0.2)
  const pitch = new THREE.Mesh(new THREE.BoxGeometry(60, 40, 0.2), greenMat);
  pitch.position.z = 0.2;
  pitch.receiveShadow = true;
  g.add(pitch);

  // Outer walls (hollow corners, thickness 4, heights 22, stopping before masts at 42, 34)
  const outerWallThickness = 4;
  const wallZ = sHeight / 2;

  // N/S walls: length 76 (X from -38 to 38), placed at Y = 38
  const wallN = new THREE.Mesh(
    new THREE.BoxGeometry(76, outerWallThickness, sHeight),
    darkMat,
  );
  wallN.position.set(0, sWidth / 2 - outerWallThickness / 2, wallZ);
  wallN.castShadow = true;
  wallN.receiveShadow = true;
  g.add(wallN);

  const wallS = wallN.clone();
  wallS.position.y = -(sWidth / 2 - outerWallThickness / 2);
  g.add(wallS);

  // E/W walls: width 60 (Y from -30 to 30), placed at X = 48
  const wallE = new THREE.Mesh(
    new THREE.BoxGeometry(outerWallThickness, 60, sHeight),
    darkMat,
  );
  wallE.position.set(sLength / 2 - outerWallThickness / 2, 0, wallZ);
  wallE.castShadow = true;
  wallE.receiveShadow = true;
  g.add(wallE);

  const wallW = wallE.clone();
  wallW.position.x = -(sLength / 2 - outerWallThickness / 2);
  g.add(wallW);

  // Stands (brick red, thickness 10, height 13.2, hollow corners, meeting pitch exactly)
  const standThickness = 10;
  const standHeight = sHeight * 0.6;
  const standZ = standHeight / 2;

  // N/S stands: length 76 (X from -38 to 38), Y position 25
  const standN = new THREE.Mesh(
    new THREE.BoxGeometry(76, standThickness, standHeight),
    brickMat,
  );
  standN.position.set(0, 30 - standThickness / 2, standZ);
  g.add(standN);

  const standS = standN.clone();
  standS.position.y = -(30 - standThickness / 2);
  g.add(standS);

  // E/W stands: width 40 (Y from -20 to 20), X position 35
  const standE = new THREE.Mesh(
    new THREE.BoxGeometry(standThickness, 40, standHeight),
    brickMat,
  );
  standE.position.set(40 - standThickness / 2, 0, standZ);
  g.add(standE);

  const standW = standE.clone();
  standW.position.x = -(40 - standThickness / 2);
  g.add(standW);

  // White outer roof border (thickness 1.5, width 10, matching wall spans to avoid corners)
  const roofThickness = 1.5;
  const outerRoofWidth = 10;
  const roofZ = sHeight + roofThickness / 2;

  // N/S roofs: length 76 (X from -38 to 38), Y position 35
  const roofN = new THREE.Mesh(
    new THREE.BoxGeometry(76, outerRoofWidth, roofThickness),
    whiteMat,
  );
  roofN.position.set(0, sWidth / 2 - outerRoofWidth / 2, roofZ);
  g.add(roofN);

  const roofS = roofN.clone();
  roofS.position.y = -(sWidth / 2 - outerRoofWidth / 2);
  g.add(roofS);

  // E/W roofs: width 60 (Y from -30 to 30), X position 45
  const roofE = new THREE.Mesh(
    new THREE.BoxGeometry(outerRoofWidth, 60, roofThickness),
    whiteMat,
  );
  roofE.position.set(sLength / 2 - outerRoofWidth / 2, 0, roofZ);
  g.add(roofE);

  const roofW = roofE.clone();
  roofW.position.x = -(sLength / 2 - outerRoofWidth / 2);
  g.add(roofW);

  // Blue inner roof rim (thickness 1.5, width 4, aligned to roof spans)
  const rimWidth = 4;
  const rimZ = roofZ + 0.1;

  // N/S rims: length 72 (X from -36 to 36), Y position 28
  const blueN = new THREE.Mesh(
    new THREE.BoxGeometry(72, rimWidth, roofThickness),
    blueMat,
  );
  blueN.position.set(0, sWidth / 2 - outerRoofWidth - rimWidth / 2, rimZ);
  g.add(blueN);

  const blueS = blueN.clone();
  blueS.position.y = -(sWidth / 2 - outerRoofWidth - rimWidth / 2);
  g.add(blueS);

  // E/W rims: width 52 (Y from -26 to 26), X position 38
  const blueE = new THREE.Mesh(
    new THREE.BoxGeometry(rimWidth, 52, roofThickness),
    blueMat,
  );
  blueE.position.set(sLength / 2 - outerRoofWidth - rimWidth / 2, 0, rimZ);
  g.add(blueE);

  const blueW = blueE.clone();
  blueW.position.x = -(sLength / 2 - outerRoofWidth - rimWidth / 2);
  g.add(blueW);

  // Floodlight masts at corners (freestanding, not touching walls or roofs)
  const mastMat = new THREE.MeshStandardMaterial({
    color: 0x6a6a6a,
    flatShading: true,
  });
  const mastGeom = new THREE.CylinderGeometry(0.8, 1.2, sHeight + 16, 6);
  for (const [sx, sy] of [
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
  ]) {
    const mast = new THREE.Mesh(mastGeom, mastMat);
    mast.position.set(sx * 42, sy * 34, (sHeight + 16) / 2);
    g.add(mast);
  }

  // V-pillar exoskeleton on all four sides (aligned with walls, stopping before corner masts)
  const pillarMat = new THREE.MeshStandardMaterial({
    color: WHITE,
    flatShading: true,
  });
  const pillarR = 0.35;
  const offset = 0.8;

  // North / South (long sides, length 76)
  const longSteps = 10;
  const longDist = 76 / longSteps;
  for (const sideY of [38 + offset, -(38 + offset)]) {
    for (let i = 0; i < longSteps; i++) {
      const x1 = -38 + i * longDist;
      const x2 = -38 + (i + 1) * longDist;
      addStrut(g, x1, sideY, 0, x2, sideY, sHeight, pillarR, pillarMat);
      addStrut(g, x2, sideY, 0, x1, sideY, sHeight, pillarR, pillarMat);
    }
  }

  // East / West (short sides, length 60)
  const shortSteps = 8;
  const shortDist = 60 / shortSteps;
  for (const sideX of [48 + offset, -(48 + offset)]) {
    for (let i = 0; i < shortSteps; i++) {
      const y1 = -30 + i * shortDist;
      const y2 = -30 + (i + 1) * shortDist;
      addStrut(g, sideX, y1, 0, sideX, y2, sHeight, pillarR, pillarMat);
      addStrut(g, sideX, y2, 0, sideX, y1, sHeight, pillarR, pillarMat);
    }
  }

  return g;
}

import * as THREE from 'three';

export interface AirportConfig {
  name: string;
  iata: string;
}

export function createAirportModel(config: AirportConfig): THREE.Group {
  const g = new THREE.Group();
  g.name = `airport-${config.iata.toLowerCase()}`;

  // Materials
  const tarmacMat = new THREE.MeshStandardMaterial({
    color: 0x222225,
    roughness: 0.85,
    metalness: 0.1,
  });
  const terminalMat = new THREE.MeshStandardMaterial({
    color: 0xd0d4dc,
    roughness: 0.3,
    metalness: 0.7,
    flatShading: true,
  });
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x6699cc,
    emissive: 0x224477,
    emissiveIntensity: 0.6,
    roughness: 0.1,
    metalness: 0.9,
  });
  const runwayMat = new THREE.MeshStandardMaterial({
    color: 0x18181c,
    roughness: 0.9,
  });
  const whitePaintMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const beaconMat = new THREE.MeshBasicMaterial({ color: 0xff2200 });
  const goldSignMat = new THREE.MeshStandardMaterial({
    color: 0xe6b032,
    emissive: 0xe6b032,
    emissiveIntensity: 0.4,
    metalness: 0.8,
    roughness: 0.2,
  });

  // 1. Apron Ground Base (300 x 200m)
  const apron = new THREE.Mesh(new THREE.BoxGeometry(320, 0.4, 220), tarmacMat);
  apron.position.set(0, 0.2, 0);
  apron.receiveShadow = true;
  g.add(apron);

  // 2. Terminal Main Concourse (120 x 45 x 16m)
  const concourse = new THREE.Mesh(
    new THREE.BoxGeometry(110, 16, 42),
    terminalMat,
  );
  concourse.position.set(0, 8.2, -20);
  concourse.castShadow = true;
  concourse.receiveShadow = true;
  g.add(concourse);

  // Terminal Glass Facade
  const facade = new THREE.Mesh(new THREE.BoxGeometry(106, 12, 2), glassMat);
  facade.position.set(0, 8, 1);
  g.add(facade);

  // Terminal Roof Canopy Overhang
  const canopy = new THREE.Mesh(
    new THREE.BoxGeometry(120, 2.5, 52),
    terminalMat,
  );
  canopy.position.set(0, 16.5, -18);
  canopy.castShadow = true;
  g.add(canopy);

  // Departure Curb Drop-off Canopy (Front Entrance)
  const dropOffCanopy = new THREE.Mesh(
    new THREE.BoxGeometry(90, 1.2, 14),
    goldSignMat,
  );
  dropOffCanopy.position.set(0, 6, -45);
  g.add(dropOffCanopy);

  // 3. Air Traffic Control Tower (Height 46m)
  const towerShaft = new THREE.Mesh(
    new THREE.CylinderGeometry(3.5, 4.8, 38, 8),
    terminalMat,
  );
  towerShaft.position.set(65, 19, -20);
  towerShaft.castShadow = true;
  g.add(towerShaft);

  // Tower Observation Cab (Glass Top)
  const towerCab = new THREE.Mesh(
    new THREE.CylinderGeometry(7, 5, 6, 8),
    glassMat,
  );
  towerCab.position.set(65, 40, -20);
  g.add(towerCab);

  const towerRoof = new THREE.Mesh(
    new THREE.ConeGeometry(7.5, 3, 8),
    terminalMat,
  );
  towerRoof.position.set(65, 44.5, -20);
  g.add(towerRoof);

  // Tower Red Beacon Light
  const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.8, 8, 8), beaconMat);
  beacon.position.set(65, 46.5, -20);
  g.add(beacon);

  // 4. Runway (Length 280m, Width 32m)
  const runway = new THREE.Mesh(new THREE.BoxGeometry(280, 0.5, 32), runwayMat);
  runway.position.set(0, 0.3, 60);
  runway.receiveShadow = true;
  g.add(runway);

  // Runway Centerline Stripes
  for (let x = -120; x <= 120; x += 24) {
    const stripe = new THREE.Mesh(
      new THREE.PlaneGeometry(14, 1.2),
      whitePaintMat,
    );
    stripe.rotation.x = -Math.PI / 2;
    stripe.position.set(x, 0.6, 60);
    g.add(stripe);
  }

  // Runway Threshold Bars
  for (let z = 48; z <= 72; z += 3.5) {
    const barWest = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 1.8),
      whitePaintMat,
    );
    barWest.rotation.x = -Math.PI / 2;
    barWest.position.set(-130, 0.6, z);
    g.add(barWest);

    const barEast = barWest.clone();
    barEast.position.x = 130;
    g.add(barEast);
  }

  // 5. Parked Low-Poly Commercial Airliner at Gate
  const planeGroup = new THREE.Group();
  planeGroup.position.set(-35, 0.5, 18);
  planeGroup.rotation.y = -Math.PI / 4;

  const planeMat = new THREE.MeshStandardMaterial({
    color: 0xf5f5f5,
    roughness: 0.2,
    metalness: 0.3,
    flatShading: true,
  });

  // Fuselage
  const fuselage = new THREE.Mesh(
    new THREE.CylinderGeometry(2.2, 2.2, 28, 10),
    planeMat,
  );
  fuselage.rotation.z = Math.PI / 2;
  fuselage.position.y = 3.5;
  fuselage.castShadow = true;
  planeGroup.add(fuselage);

  // Nose Cone
  const nose = new THREE.Mesh(new THREE.ConeGeometry(2.2, 5, 10), planeMat);
  nose.rotation.z = -Math.PI / 2;
  nose.position.set(16.5, 3.5, 0);
  planeGroup.add(nose);

  // Wings
  const wingLeft = new THREE.Mesh(new THREE.BoxGeometry(10, 0.4, 22), planeMat);
  wingLeft.position.set(0, 3.2, 10);
  wingLeft.rotation.y = -0.3;
  wingLeft.castShadow = true;
  planeGroup.add(wingLeft);

  const wingRight = new THREE.Mesh(
    new THREE.BoxGeometry(10, 0.4, 22),
    planeMat,
  );
  wingRight.position.set(0, 3.2, -10);
  wingRight.rotation.y = 0.3;
  wingRight.castShadow = true;
  planeGroup.add(wingRight);

  // Jet Engines
  const engineMat = new THREE.MeshStandardMaterial({
    color: 0x44444a,
    roughness: 0.4,
  });
  const engineLeft = new THREE.Mesh(
    new THREE.CylinderGeometry(1.0, 0.9, 4, 8),
    engineMat,
  );
  engineLeft.rotation.z = Math.PI / 2;
  engineLeft.position.set(0, 1.8, 6.5);
  planeGroup.add(engineLeft);

  const engineRight = engineLeft.clone();
  engineRight.position.z = -6.5;
  planeGroup.add(engineRight);

  // Tail Fin
  const tail = new THREE.Mesh(new THREE.BoxGeometry(5, 7, 0.4), goldSignMat);
  tail.position.set(-11, 7.5, 0);
  tail.rotation.z = 0.35;
  planeGroup.add(tail);

  g.add(planeGroup);

  // 6. Jet Bridges from terminal to gates
  const bridge1 = new THREE.Mesh(
    new THREE.BoxGeometry(18, 3.5, 3.5),
    terminalMat,
  );
  bridge1.position.set(-35, 4.5, 4);
  bridge1.rotation.y = Math.PI / 4;
  g.add(bridge1);

  return g;
}

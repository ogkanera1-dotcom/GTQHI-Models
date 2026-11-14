/* ============================================================
   GTQHI ULTIMATE VEHICLE GENERATOR
   Version 2.0
   Three.js r128 compatible
   26 original vehicles + enhanced details + performance data
   Load after THREE.js
============================================================ */

(function (global) {
  "use strict";

  if (!global.THREE) {
    console.error("GTQHI: THREE.js が読み込まれていません。");
    return;
  }

  const CARS = {
    "Nissan Fairlady Z": {
      type:"sports", w:2.0,h:0.85,l:4.4,roof:0.65,cabin:0.55,
      speed:240,acceleration:8.5,braking:9.0,handling:8.5
    },
    "Toyota Supra": {
      type:"sports",w:2.0,h:0.9,l:4.5,roof:0.7,cabin:0.6,
      speed:260,acceleration:9.0,braking:9.0,handling:8.7
    },
    "Porsche 911": {
      type:"sports",w:1.95,h:0.9,l:4.5,roof:0.72,cabin:0.6,
      speed:290,acceleration:9.5,braking:9.8,handling:9.7
    },
    "Lamborghini Revuelto": {
      type:"super",w:2.1,h:0.85,l:4.9,roof:0.65,cabin:0.5,
      speed:350,acceleration:10,braking:10,handling:9.8
    },
    "Mazda Roadster": {
      type:"sports",w:1.75,h:0.65,l:3.9,roof:0.35,cabin:0.4,
      speed:190,acceleration:7.5,braking:8.0,handling:9.5
    },
    "Alpine A110": {
      type:"sports",w:1.8,h:0.8,l:4.2,roof:0.6,cabin:0.5,
      speed:250,acceleration:8.8,braking:9.0,handling:9.4
    },
    "Audi TT": {
      type:"sports",w:1.85,h:0.85,l:4.2,roof:0.65,cabin:0.55,
      speed:230,acceleration:8.0,braking:8.5,handling:8.5
    },
    "Toyota Harrier": {
      type:"suv",w:1.95,h:1.35,l:4.8,roof:0.9,cabin:0.8,
      speed:190,acceleration:6.5,braking:7.0,handling:6.8
    },
    "Mazda CX-5": {
      type:"suv",w:1.9,h:1.35,l:4.6,roof:0.9,cabin:0.8,
      speed:185,acceleration:6.5,braking:7.0,handling:7.0
    },
    "Mercedes G-Class": {
      type:"box",w:2.0,h:1.8,l:4.7,roof:1.0,cabin:1.0,
      speed:210,acceleration:6.5,braking:7.5,handling:6.0
    },
    "Jeep Wrangler": {
      type:"box",w:1.95,h:1.75,l:4.3,roof:0.95,cabin:0.9,
      speed:180,acceleration:6.0,braking:7.0,handling:6.0
    },
    "Land Rover Defender": {
      type:"box",w:2.0,h:1.7,l:4.8,roof:1.0,cabin:0.9,
      speed:190,acceleration:6.5,braking:7.0,handling:6.5
    },
    "Toyota Land Cruiser": {
      type:"suv",w:2.0,h:1.7,l:5.0,roof:1.0,cabin:0.9,
      speed:200,acceleration:6.8,braking:7.5,handling:6.5
    },
    "Land Cruiser 70": {
      type:"box",w:1.9,h:1.8,l:4.8,roof:1.0,cabin:0.9,
      speed:160,acceleration:5.5,braking:6.0,handling:5.5
    },
    "FJ Cruiser": {
      type:"box",w:1.9,h:1.65,l:4.6,roof:0.95,cabin:0.85,
      speed:175,acceleration:6.0,braking:6.5,handling:6.0
    },
    "Mitsubishi Delica D:5": {
      type:"van",w:1.85,h:1.75,l:4.8,roof:1.0,cabin:0.95,
      speed:180,acceleration:5.8,braking:6.5,handling:6.0
    },
    "Cadillac Escalade": {
      type:"suv",w:2.1,h:1.85,l:5.3,roof:1.05,cabin:1.0,
      speed:210,acceleration:7.0,braking:7.5,handling:6.0
    },
    "Toyota Vellfire": {
      type:"van",w:1.85,h:1.8,l:4.9,roof:1.0,cabin:1.0,
      speed:190,acceleration:6.0,braking:7.0,handling:6.0
    },
    "Rover Mini": {
      type:"classic",w:1.55,h:1.15,l:3.1,roof:0.7,cabin:0.65,
      speed:150,acceleration:5.5,braking:6.0,handling:8.0
    },
    "Citroen 2CV": {
      type:"classic",w:1.5,h:1.4,l:3.8,roof:0.9,cabin:0.75,
      speed:110,acceleration:3.5,braking:4.5,handling:5.5
    },
    "VW Beetle": {
      type:"beetle",w:1.75,h:1.45,l:4.1,roof:0.95,cabin:0.8,
      speed:160,acceleration:5.0,braking:5.5,handling:6.5
    },
    "Isuzu 117 Coupe": {
      type:"classic",w:1.75,h:0.95,l:4.3,roof:0.7,cabin:0.6,
      speed:170,acceleration:5.5,braking:6.0,handling:7.0
    },
    "Nissan Pao": {
      type:"classic",w:1.6,h:1.35,l:3.7,roof:0.85,cabin:0.7,
      speed:130,acceleration:4.0,braking:5.0,handling:6.0
    },
    "Nissan Figaro": {
      type:"classic",w:1.65,h:1.3,l:3.7,roof:0.8,cabin:0.7,
      speed:140,acceleration:4.5,braking:5.0,handling:6.0
    },
    "Nissan Sunny Truck": {
      type:"truck",w:1.65,h:1.3,l:4.1,roof:0.7,cabin:0.55,
      speed:140,acceleration:4.0,braking:5.0,handling:5.0
    },
    "Volvo 240 Estate": {
      type:"wagon",w:1.8,h:1.4,l:4.8,roof:0.9,cabin:0.8,
      speed:180,acceleration:5.5,braking:6.5,handling:6.5
    }
  };

  const DEFAULT_COLOR = 0xc62828;

  const COLORS = {
    body: DEFAULT_COLOR,
    glass: 0x263e50,
    tire: 0x151515,
    rim: 0xc5c9cc,
    chrome: 0xb9c1c9,
    black: 0x17191d,
    headlight: 0xfff1c2,
    taillight: 0xd71920
  };

  function mat(color, roughness, metalness) {
    return new THREE.MeshStandardMaterial({
      color: color,
      roughness: roughness === undefined ? 0.55 : roughness,
      metalness: metalness === undefined ? 0.12 : metalness
    });
  }

  function addPart(group, geometry, material, x, y, z) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    return mesh;
  }

  function addBox(group, material, x, y, z, w, h, l) {
    return addPart(
      group,
      new THREE.BoxGeometry(w, h, l),
      material,
      x, y, z
    );
  }

  function addSphere(group, material, x, y, z, w, h, l) {
    const mesh = addPart(
      group,
      new THREE.SphereGeometry(1, 24, 16),
      material,
      x, y, z
    );

    mesh.scale.set(w, h, l);
    return mesh;
  }

  function addCylinder(group, material, x, y, z, radius, depth) {
    const mesh = addPart(
      group,
      new THREE.CylinderGeometry(radius, radius, depth, 32),
      material,
      x, y, z
    );

    mesh.rotation.z = Math.PI / 2;
    return mesh;
  }

  function addWheel(group, x, y, z, tire, rim, brake) {
    const wheel = new THREE.Group();
    wheel.position.set(x, y, z);
    group.add(wheel);

    addCylinder(wheel, tire, 0, 0, 0, 0.43, 0.25);
    addCylinder(wheel, rim, 0.13, 0, 0, 0.28, 0.04);
    addCylinder(wheel, brake, 0.15, 0, 0, 0.17, 0.045);

    // Wheel hub
    addCylinder(
      wheel,
      mat(0x777777, 0.25, 0.7),
      0.18, 0, 0,
      0.07, 0.05
    );

    // Spokes
    const spokeMat = mat(0xe0e0e0, 0.3, 0.8);

    for (let i = 0; i < 5; i++) {
      const angle = (Math.PI * 2 / 5) * i;

      const spoke = addBox(
        wheel,
        spokeMat,
        0.18,
        Math.cos(angle) * 0.13,
        Math.sin(angle) * 0.13,
        0.035,
        0.24,
        0.035
      );

      spoke.rotation.x = angle;
    }

    return wheel;
  }

  function createWheels(group, spec, tire, rim) {
    const brake = mat(0x777777, 0.4, 0.6);

    const x = spec.w / 2;
    const front = spec.l * 0.31;
    const back = -spec.l * 0.31;
    const y = 0.48;

    const wheels = [];

    [-x, x].forEach(side => {
      wheels.push(addWheel(group, side, y, front, tire, rim, brake));
      wheels.push(addWheel(group, side, y, back, tire, rim, brake));
    });

    return wheels;
  }

  function createLights(group, spec, light, redLight, chrome) {
    const w = spec.w;
    const l = spec.l;

    [-1, 1].forEach(side => {
      // Headlight housing
      addBox(
        group, chrome,
        side * w * 0.36,
        1.0,
        l * 0.49,
        0.3, 0.18, 0.08
      );

      // Headlight
      addSphere(
        group, light,
        side * w * 0.36,
        1.0,
        l * 0.51,
        0.13, 0.10, 0.05
      );

      // Rear light
      addBox(
        group, redLight,
        side * w * 0.36,
        1.0,
        -l * 0.50,
        0.22, 0.15, 0.07
      );
    });
  }

  function createWindows(group, spec, glass, paint, y) {
    const w = spec.w;
    const l = spec.l;
    const windowH = Math.max(0.25, spec.roof * 0.65);

    // Front windshield
    const frontWindow = addBox(
      group,
      glass,
      0,
      y + spec.h * 0.35,
      l * 0.12,
      w * 0.76,
      windowH,
      0.055
    );

    frontWindow.rotation.x = -0.12;

    // Rear windshield
    const rearWindow = addBox(
      group,
      glass,
      0,
      y + spec.h * 0.35,
      -l * 0.28,
      w * 0.76,
      windowH,
      0.055
    );

    rearWindow.rotation.x = 0.12;

    // Side windows
    [-1, 1].forEach(side => {
      addBox(
        group,
        glass,
        side * w * 0.44,
        y + spec.h * 0.36,
        -0.12,
        0.035,
        windowH * 0.85,
        l * 0.35
      );

      // Door frame
      addBox(
        group,
        paint,
        side * w * 0.45,
        y + spec.h * 0.35,
        -0.12,
        0.045,
        windowH * 1.1,
        0.045
      );
    });
  }

  function createMirrors(group, spec, dark, chrome) {
    [-1, 1].forEach(side => {
      addBox(
        group,
        dark,
        side * spec.w * 0.49,
        1.35,
        spec.l * 0.20,
        0.12, 0.10, 0.15
      );

      addBox(
        group,
        chrome,
        side * spec.w * 0.50,
        1.35,
        spec.l * 0.20,
        0.035, 0.06, 0.10
      );
    });
  }

  function createBumpers(group, spec, chrome) {
    addBox(
      group,
      chrome,
      0, 0.75, spec.l * 0.51,
      spec.w * 0.9, 0.12, 0.12
    );

    addBox(
      group,
      chrome,
      0, 0.75, -spec.l * 0.51,
      spec.w * 0.9, 0.12, 0.12
    );
  }

  function createSpoiler(group, spec, dark, paint) {
    if (spec.type !== "sports" && spec.type !== "super") {
      return;
    }

    const rear = -spec.l * 0.43;

    addBox(
      group,
      dark,
      0, 1.25, rear,
      0.08, 0.30, 0.08
    );

    addBox(
      group,
      dark,
      0, 1.25, rear - 0.35,
      0.08, 0.30, 0.08
    );

    addBox(
      group,
      paint,
      0, 1.43, rear - 0.18,
      spec.w * 0.85, 0.08, 0.45
    );
  }

  function createExhaust(group, spec, chrome) {
    [-1, 1].forEach(side => {
      addCylinder(
        group,
        chrome,
        side * spec.w * 0.28,
        0.52,
        -spec.l * 0.51,
        0.07,
        0.20
      );
    });
  }

  function createInterior(group, spec, dark) {
    const y = 1.05;

    // Dashboard
    addBox(
      group,
      dark,
      0, y, 0.18,
      spec.w * 0.7, 0.12, 0.35
    );

    // Seats
    [-1, 1].forEach(side => {
      addBox(
        group,
        dark,
        side * spec.w * 0.20,
        y - 0.15,
        -0.12,
        0.38, 0.45, 0.38
      );

      addBox(
        group,
        dark,
        side * spec.w * 0.20,
        y + 0.10,
        -0.30,
        0.38, 0.35, 0.10
      );
    });

    // Steering wheel
    const steering = addCylinder(
      group,
      mat(0x111111),
      -spec.w * 0.22,
      y,
      0.30,
      0.16,
      0.04
    );

    steering.rotation.z = Math.PI / 2;
  }

  function createBody(group, spec, paint, dark) {
    const w = spec.w;
    const h = spec.h;
    const l = spec.l;
    const y = 0.85;

    if (spec.type === "beetle") {
      addSphere(
        group, paint,
        0, y, 0,
        w * 0.52, h * 0.48, l * 0.48
      );

      addSphere(
        group, paint,
        0, y + 0.25, -0.05,
        w * 0.43, h * 0.52, l * 0.34
      );

      addSphere(
        group, paint,
        0, y + 0.25, l * 0.27,
        w * 0.4, h * 0.32, l * 0.2
      );

    } else if (spec.type === "classic") {
      addSphere(
        group, paint,
        0, y, 0,
        w * 0.52, h * 0.4, l * 0.48
      );

      addBox(
        group, paint,
        0, y + 0.05, 0,
        w * 0.95, h * 0.5, l * 0.72
      );

    } else if (spec.type === "sports" || spec.type === "super") {
      addBox(
        group, paint,
        0, y, 0,
        w, h * 0.65, l
      );

      addBox(
        group, paint,
        0, y + 0.16, -0.12,
        w * 0.82, h * 0.35, l * 0.52
      );

      addBox(
        group, paint,
        0, y - 0.12, l * 0.12,
        w * 0.98, h * 0.18, l * 0.65
      );

    } else {
      addBox(
        group, paint,
        0, y, 0,
        w, h * 0.75, l
      );

      addBox(
        group, paint,
        0, y + h * 0.36, -0.08,
        w * 0.88, h * 0.5, l * 0.62
      );
    }

    // Roof
    if (spec.type !== "beetle" && spec.type !== "classic") {
      addBox(
        group, paint,
        0, y + h * 0.48, -0.12,
        w * 0.83, h * 0.18, l * 0.53
      );
    }

    // Lower body trim
    addBox(
      group, dark,
      0, 0.43, 0,
      w * 0.92, 0.10, l * 0.85
    );
  }

  function createTruckBed(group, spec, paint, dark) {
    if (spec.type !== "truck") return;

    addBox(
      group, paint,
      0, 1.0, -spec.l * 0.32,
      spec.w * 0.85, 0.35, spec.l * 0.34
    );

    addBox(
      group, dark,
      0, 1.18, -spec.l * 0.32,
      spec.w * 0.75, 0.04, spec.l * 0.3
    );

    // Cargo bed walls
    [-1, 1].forEach(side => {
      addBox(
        group, paint,
        side * spec.w * 0.40,
        1.18,
        -spec.l * 0.32,
        0.08, 0.35, spec.l * 0.34
      );
    });
  }

  function createCar(name, color) {
    const spec = CARS[name];

    if (!spec) {
      console.warn("GTQHI: Unknown car:", name);
      return null;
    }

    const group = new THREE.Group();
    group.name = name;

    const paint = mat(
      color === undefined ? DEFAULT_COLOR : color,
      0.3,
      0.45
    );

    const dark = mat(COLORS.black, 0.8);
    const glass = new THREE.MeshStandardMaterial({
      color: COLORS.glass,
      roughness: 0.18,
      metalness: 0.35,
      transparent: true,
      opacity: 0.82
    });

    const chrome = mat(COLORS.chrome, 0.25, 0.8);
    const light = new THREE.MeshStandardMaterial({
      color: COLORS.headlight,
      emissive: 0x665522
    });

    const redLight = new THREE.MeshStandardMaterial({
      color: COLORS.taillight,
      emissive: 0x550000
    });

    const tire = mat(COLORS.tire, 0.95);
    const rim = mat(COLORS.rim, 0.25, 0.85);

    createBody(group, spec, paint, dark);
    createWindows(group, spec, glass, paint, 0.85);
    createBumpers(group, spec, chrome);
    createLights(group, spec, light, redLight, chrome);
    createMirrors(group, spec, dark, chrome);
    createInterior(group, spec, dark);
    createTruckBed(group, spec, paint, dark);
    createSpoiler(group, spec, dark, paint);
    createExhaust(group, spec, chrome);

    const wheels = createWheels(group, spec, tire, rim);

    // Door handles
    [-1, 1].forEach(side => {
      addBox(
        group,
        chrome,
        side * spec.w * 0.49,
        0.90,
        0,
        0.035, 0.045, 0.16
      );
    });

    // Front grille
    addBox(
      group,
      dark,
      0, 0.80, spec.l * 0.505,
      spec.w * 0.38, 0.18, 0.035
    );

    // Grille lines
    for (let i = 0; i < 4; i++) {
      addBox(
        group,
        chrome,
        0,
        0.74 + i * 0.035,
        spec.l * 0.525,
        spec.w * 0.30,
        0.012,
        0.015
      );
    }

    // Number plate
    addBox(
      group,
      mat(0xffffff),
      0, 0.70, spec.l * 0.53,
      0.38, 0.10, 0.025
    );

    // Vehicle metadata
    group.userData.vehicleName = name;
    group.userData.vehicleSpec = spec;
    group.userData.speed = 0;
    group.userData.maxSpeed = spec.speed;
    group.userData.acceleration = spec.acceleration;
    group.userData.braking = spec.braking;
    group.userData.handling = spec.handling;
    group.userData.wheels = wheels;

    // Collision dimensions
    group.userData.hitbox = {
      width: spec.w,
      height: spec.h,
      length: spec.l
    };

    group.userData.isVehicle = true;

    return group;
  }

  function getSpec(name) {
    return CARS[name] || null;
  }

  function getPerformance(name) {
    const spec = CARS[name];

    if (!spec) return null;

    return {
      maxSpeed: spec.speed,
      acceleration: spec.acceleration,
      braking: spec.braking,
      handling: spec.handling
    };
  }

  function getHitbox(name) {
    const spec = CARS[name];

    if (!spec) return null;

    return {
      width: spec.w,
      height: spec.h,
      length: spec.l
    };
  }

  function setColor(vehicle, color) {
    if (!vehicle || !vehicle.traverse) return;

    vehicle.traverse(function (object) {
      if (!object.isMesh || !object.material) return;

      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material];

      materials.forEach(function (material) {
        if (
          material.color &&
          material.userData &&
          material.userData.isCarPaint
        ) {
          material.color.set(color);
        }
      });
    });
  }

  function createNPC(name, color) {
    const npc = createCar(name, color);

    if (!npc) return null;

    npc.userData.isNPC = true;
    npc.userData.isVehicle = true;
    npc.userData.speed = 0;
    npc.userData.npcTargetSpeed = npc.userData.maxSpeed * 0.65;

    return npc;
  }

  function listByType(type) {
    return Object.keys(CARS).filter(function (name) {
      return CARS[name].type === type;
    });
  }

  global.GTQHICars = {
    list: Object.keys(CARS),
    specs: CARS,
    colors: COLORS,

    create: createCar,
    createNPC: createNPC,

    getSpec: getSpec,
    getPerformance: getPerformance,
    getHitbox: getHitbox,

    listByType: listByType,
    setColor: setColor
  };

  console.log(
    "GTQHI Ultimate Cars loaded:",
    Object.keys(CARS).length,
    "vehicles"
  );

})(window);

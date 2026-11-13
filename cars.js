
/* GTQHI - 26 Vehicle Generator
   Three.js r128 compatible
   Load this file after THREE.js.
*/

(function (global) {
  "use strict";

  const CARS = {
    "Nissan Fairlady Z":       { type:"sports", w:2.0, h:0.85, l:4.4, roof:0.65, cabin:0.55 },
    "Toyota Supra":            { type:"sports", w:2.0, h:0.9, l:4.5, roof:0.7, cabin:0.6 },
    "Porsche 911":             { type:"sports", w:1.95,h:0.9, l:4.5, roof:0.72,cabin:0.6 },
    "Lamborghini Revuelto":    { type:"super",  w:2.1, h:0.85,l:4.9, roof:0.65,cabin:0.5 },
    "Mazda Roadster":          { type:"sports", w:1.75,h:0.65,l:3.9, roof:0.35,cabin:0.4 },
    "Alpine A110":             { type:"sports", w:1.8, h:0.8, l:4.2, roof:0.6, cabin:0.5 },
    "Audi TT":                 { type:"sports", w:1.85,h:0.85,l:4.2, roof:0.65,cabin:0.55 },
    "Toyota Harrier":          { type:"suv",    w:1.95,h:1.35,l:4.8, roof:0.9, cabin:0.8 },
    "Mazda CX-5":              { type:"suv",    w:1.9, h:1.35,l:4.6, roof:0.9, cabin:0.8 },
    "Mercedes G-Class":        { type:"box",    w:2.0, h:1.8, l:4.7, roof:1.0, cabin:1.0 },
    "Jeep Wrangler":           { type:"box",    w:1.95,h:1.75,l:4.3, roof:0.95,cabin:0.9 },
    "Land Rover Defender":     { type:"box",    w:2.0, h:1.7, l:4.8, roof:1.0, cabin:0.9 },
    "Toyota Land Cruiser":     { type:"suv",    w:2.0, h:1.7, l:5.0, roof:1.0, cabin:0.9 },
    "Land Cruiser 70":         { type:"box",    w:1.9, h:1.8, l:4.8, roof:1.0, cabin:0.9 },
    "FJ Cruiser":              { type:"box",    w:1.9, h:1.65,l:4.6, roof:0.95,cabin:0.85 },
    "Mitsubishi Delica D:5":   { type:"van",    w:1.85,h:1.75,l:4.8, roof:1.0, cabin:0.95 },
    "Cadillac Escalade":       { type:"suv",    w:2.1, h:1.85,l:5.3, roof:1.05,cabin:1.0 },
    "Toyota Vellfire":         { type:"van",    w:1.85,h:1.8, l:4.9, roof:1.0, cabin:1.0 },
    "Rover Mini":              { type:"classic",w:1.55,h:1.15,l:3.1, roof:0.7, cabin:0.65 },
    "Citroen 2CV":             { type:"classic",w:1.5, h:1.4, l:3.8, roof:0.9, cabin:0.75 },
    "VW Beetle":               { type:"beetle", w:1.75,h:1.45,l:4.1, roof:0.95,cabin:0.8 },
    "Isuzu 117 Coupe":         { type:"classic",w:1.75,h:0.95,l:4.3, roof:0.7, cabin:0.6 },
    "Nissan Pao":              { type:"classic",w:1.6, h:1.35,l:3.7, roof:0.85,cabin:0.7 },
    "Nissan Figaro":            { type:"classic",w:1.65,h:1.3, l:3.7, roof:0.8, cabin:0.7 },
    "Nissan Sunny Truck":      { type:"truck",  w:1.65,h:1.3, l:4.1, roof:0.7, cabin:0.55 },
    "Volvo 240 Estate":        { type:"wagon",  w:1.8, h:1.4, l:4.8, roof:0.9, cabin:0.8 }
  };

  const DEFAULT_COLOR = 0xc62828;

  function material(color, roughness) {
    return new THREE.MeshStandardMaterial({
      color: color,
      roughness: roughness === undefined ? 0.55 : roughness,
      metalness: 0.12
    });
  }

  function part(group, geometry, mat, x, y, z) {
    const mesh = new THREE.Mesh(geometry, mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    return mesh;
  }

  function box(group, mat, x, y, z, w, h, l) {
    return part(
      group,
      new THREE.BoxGeometry(w, h, l),
      mat, x, y, z
    );
  }

  function sphere(group, mat, x, y, z, w, h, l) {
    const mesh = part(
      group,
      new THREE.SphereGeometry(1, 24, 16),
      mat, x, y, z
    );
    mesh.scale.set(w, h, l);
    return mesh;
  }

  function cylinder(group, mat, x, y, z, radius, depth) {
    const mesh = part(
      group,
      new THREE.CylinderGeometry(radius, radius, depth, 24),
      mat, x, y, z
    );
    mesh.rotation.z = Math.PI / 2;
    return mesh;
  }

  function createWheels(group, spec, tireMat, rimMat) {
    const x = spec.w / 2;
    const zFront = spec.l * 0.31;
    const zBack = -spec.l * 0.31;
    const y = 0.48;

    [-x, x].forEach(side => {
      [zFront, zBack].forEach(z => {
        cylinder(group, tireMat, side, y, z, 0.43, 0.24);
        cylinder(group, rimMat, side * 1.015, y, z, 0.23, 0.25);
        cylinder(group, material(0x777777), side * 1.03, y, z, 0.08, 0.26);
      });
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

    const paint = material(color || DEFAULT_COLOR, 0.3);
    const dark = material(0x17191d, 0.8);
    const glass = new THREE.MeshStandardMaterial({
      color: 0x263e50,
      roughness: 0.18,
      metalness: 0.35,
      transparent: true,
      opacity: 0.82
    });
    const chrome = material(0xb9c1c9, 0.25);
    const light = new THREE.MeshStandardMaterial({
      color: 0xfff1c2,
      emissive: 0x665522
    });
    const redLight = new THREE.MeshStandardMaterial({
      color: 0xd71920,
      emissive: 0x550000
    });
    const tire = material(0x171717, 0.95);
    const rim = material(0xc5c9cc, 0.25);

    const w = spec.w;
    const h = spec.h;
    const l = spec.l;
    const y = 0.85;

    // Main body
    if (spec.type === "beetle") {
      sphere(group, paint, 0, y, 0, w * 0.52, h * 0.48, l * 0.48);
      sphere(group, paint, 0, y + 0.25, -0.05, w * 0.43, h * 0.52, l * 0.34);
      sphere(group, paint, 0, y + 0.25, l * 0.27, w * 0.4, h * 0.32, l * 0.2);
    } else if (spec.type === "classic") {
      sphere(group, paint, 0, y, 0, w * 0.52, h * 0.4, l * 0.48);
      box(group, paint, 0, y + 0.05, 0, w * 0.95, h * 0.5, l * 0.72);
    } else if (spec.type === "sports" || spec.type === "super") {
      box(group, paint, 0, y, 0, w, h * 0.65, l);
      box(group, paint, 0, y + 0.16, -0.12, w * 0.82, h * 0.35, l * 0.52);
      box(group, paint, 0, y - 0.12, l * 0.12, w * 0.98, h * 0.18, l * 0.65);
    } else {
      box(group, paint, 0, y, 0, w, h * 0.75, l);
      box(group, paint, 0, y + h * 0.36, -0.08, w * 0.88, h * 0.5, l * 0.62);
    }

    // Roof and cabin
    if (spec.type !== "beetle" && spec.type !== "classic") {
      box(group, paint, 0, y + h * 0.48, -0.12, w * 0.83, h * 0.18, l * 0.53);
    }

    // Windows
    const windowH = Math.max(0.25, spec.roof * 0.65);
    box(group, glass, 0, y + h * 0.35, 0.18, w * 0.78, windowH, l * 0.24);
    box(group, glass, 0, y + h * 0.35, -0.31, w * 0.78, windowH, l * 0.18);

    // Side windows
    [-1, 1].forEach(side => {
      box(group, glass, side * w * 0.43, y + h * 0.36, -0.12,
        0.035, windowH * 0.85, l * 0.35);
    });

    // Front and rear bumpers
    box(group, chrome, 0, 0.75, l * 0.51, w * 0.9, 0.12, 0.12);
    box(group, chrome, 0, 0.75, -l * 0.51, w * 0.9, 0.12, 0.12);

    // Headlights and tail lights
    [-1, 1].forEach(side => {
      sphere(group, light, side * w * 0.36, 1.0, l * 0.48, 0.14, 0.12, 0.07);
      sphere(group, redLight, side * w * 0.36, 1.0, -l * 0.48, 0.12, 0.12, 0.07);
    });

    // Beetle's iconic round headlights
    if (spec.type === "beetle") {
      [-1, 1].forEach(side => {
        sphere(group, chrome, side * w * 0.37, 1.12, l * 0.43, 0.17, 0.17, 0.09);
        sphere(group, light, side * w * 0.37, 1.12, l * 0.49, 0.12, 0.12, 0.07);
      });
    }

    // Wheels
    createWheels(group, spec, tire, rim);

    // Truck cargo bed
    if (spec.type === "truck") {
      box(group, paint, 0, 1.0, -l * 0.32, w * 0.85, 0.35, l * 0.34);
      box(group, dark, 0, 1.18, -l * 0.32, w * 0.75, 0.04, l * 0.3);
    }

    // Mirrors
    [-1, 1].forEach(side => {
      box(group, dark, side * w * 0.48, 1.35, l * 0.2, 0.12, 0.1, 0.15);
    });

    group.userData.vehicleName = name;
    group.userData.vehicleSpec = spec;
    group.userData.speed = 0;

    return group;
  }

  global.GTQHICars = {
    list: Object.keys(CARS),
    specs: CARS,
    create: createCar
  };

})(window);


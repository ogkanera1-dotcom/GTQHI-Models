
/*
 * GTQHI - High Detail Vehicle Generator
 * Three.js r128 compatible | Procedural geometry | No external model downloads
 * API compatibility: window.GTQHICars.create(name, color), .list, .specs
 *
 * Vehicle coordinate system: front = +Z, rear = -Z, up = +Y.
 * This generator intentionally uses real mesh geometry instead of emoji/placeholders.
 */
(function (global) {
  'use strict';

  if (!global.THREE) {
    console.error('GTQHICars: Three.js must be loaded before cars.js.');
    return;
  }
  const THREE = global.THREE;
  const VERSION = '2.0.0';
  const DEFAULT_COLOR = 0xc62828;
  const TAU = Math.PI * 2;

  // Every vehicle owns its own proportions and performance tuning.
  const CARS = {
    'Nissan Fairlady Z': {
      name: 'Nissan Fairlady Z',
      type: 'sports',
      width: 2.0, height: 0.86, length: 4.38,
      color: '#d52d25', maxSpeed: 700, acceleration: 5.0,
      proportions: {
        hoodLength: 0.27, cabinLength: 0.38, trunkLength: 0.25,
        hoodHeight: 0.78, roofHeight: 0.78, cabinWidth: 0.82,
        wheelBase: 0.62, wheelRadius: 0.39, wheelWidth: 0.24,
        groundClearance: 0.22,
      },
      styling: {
        frontOverhang: 0.48, rearOverhang: 0.28, bumperDepth: 0.18,
        windowInset: 0.22, lampSize: 0.12, trimThickness: 0.035,
        archRadius: 0.12, grilleStyle: 'wide', roofStyle: 'low',
        wheelStyle: 'sport',
      },
      features: {
        frontSplitter: true, rearDiffuser: true, sideSkirts: true,
        fenderFlares: false, roofRails: false, spareWheel: false,
        cargoBed: false, convertibleTop: false, roundHeadlamps: false,
        wideGrille: false, fogLamps: false, rearSpoiler: true,
        chromeBumpers: false, doorHandles: true, sideMirrors: true,
        licensePlates: true, interiorSeats: true, dashboard: true,
        steeringWheel: true, exhaustTips: true,
      },
    },
    'Toyota Supra': {
      name: 'Toyota Supra', type: 'sports',
      width: 2.0, height: 0.9, length: 4.5,
      color: '#efa42d', maxSpeed: 720, acceleration: 4.1,
      proportions: {
        hoodLength: 0.27, cabinLength: 0.38, trunkLength: 0.25,
        hoodHeight: 0.78, roofHeight: 0.78, cabinWidth: 0.82,
        wheelBase: 0.62, wheelRadius: 0.39, wheelWidth: 0.24,
        groundClearance: 0.22,
      },
      styling: {
        frontOverhang: 0.48, rearOverhang: 0.28, bumperDepth: 0.18,
        windowInset: 0.22, lampSize: 0.12, trimThickness: 0.035,
        archRadius: 0.12, grilleStyle: 'wide', roofStyle: 'low',
        wheelStyle: 'sport',
      },
      features: {
        frontSplitter: true, rearDiffuser: true, sideSkirts: true,
        fenderFlares: false, roofRails: false, spareWheel: false,
        cargoBed: false, convertibleTop: false, roundHeadlamps: false,
        wideGrille: false, fogLamps: false, rearSpoiler: true,
        chromeBumpers: false, doorHandles: true, sideMirrors: true,
        licensePlates: true, interiorSeats: true, dashboard: true,
        steeringWheel: true, exhaustTips: true,
      },
    },
    'Porsche 911': {
      name: 'Porsche 911', type: 'sports',
      width: 1.95, height: 0.9, length: 4.5,
      color: '#eeeeee', maxSpeed: 680, acceleration: 4.0,
      proportions: {
        hoodLength: 0.27, cabinLength: 0.38, trunkLength: 0.25,
        hoodHeight: 0.78, roofHeight: 0.78, cabinWidth: 0.82,
        wheelBase: 0.62, wheelRadius: 0.39, wheelWidth: 0.24,
        groundClearance: 0.22,
      },
      styling: {
        frontOverhang: 0.48, rearOverhang: 0.28, bumperDepth: 0.18,
        windowInset: 0.22, lampSize: 0.12, trimThickness: 0.035,
        archRadius: 0.12, grilleStyle: 'wide', roofStyle: 'low',
        wheelStyle: 'sport',
      },
      features: {
        frontSplitter: true, rearDiffuser: true, sideSkirts: true,
        fenderFlares: false, roofRails: false, spareWheel: false,
        cargoBed: false, convertibleTop: false, roundHeadlamps: false,
        wideGrille: false, fogLamps: false, rearSpoiler: true,
        chromeBumpers: false, doorHandles: true, sideMirrors: true,
        licensePlates: true, interiorSeats: true, dashboard: true,
        steeringWheel: true, exhaustTips: true,
      },
    },
    'Lamborghini Revuelto': {
      name: 'Lamborghini Revuelto', type: 'super',
      width: 2.1, height: 0.85, length: 4.9,
      color: '#c7d12d', maxSpeed: 850, acceleration: 2.5,
      proportions: {
        hoodLength: 0.27, cabinLength: 0.38, trunkLength: 0.25,
        hoodHeight: 0.78, roofHeight: 0.78, cabinWidth: 0.82,
        wheelBase: 0.62, wheelRadius: 0.39, wheelWidth: 0.24,
        groundClearance: 0.22,
      },
      styling: {
        frontOverhang: 0.42, rearOverhang: 0.24, bumperDepth: 0.16,
        windowInset: 0.26, lampSize: 0.18, trimThickness: 0.045,
        archRadius: 0.16, grilleStyle: 'wide', roofStyle: 'low',
        wheelStyle: 'sport',
      },
      features: {
        frontSplitter: true, rearDiffuser: true, sideSkirts: true,
        fenderFlares: false, roofRails: false, spareWheel: false,
        cargoBed: false, convertibleTop: false, roundHeadlamps: false,
        wideGrille: false, fogLamps: false, rearSpoiler: true,
        chromeBumpers: false, doorHandles: true, sideMirrors: true,
        licensePlates: true, interiorSeats: true, dashboard: true,
        steeringWheel: true, exhaustTips: true,
      },
    },
    'Mazda Roadster': {
      name: 'Mazda Roadster', type: 'open',
      width: 1.75, height: 0.65, length: 3.9,
      color: '#b72d32', maxSpeed: 420, acceleration: 6.8,
      proportions: {
        hoodLength: 0.24, cabinLength: 0.43, trunkLength: 0.28,
        hoodHeight: 0.94, roofHeight: 1.0, cabinWidth: 0.82,
        wheelBase: 0.64, wheelRadius: 0.43, wheelWidth: 0.27,
        groundClearance: 0.3,
      },
      styling: {
        frontOverhang: 0.52, rearOverhang: 0.22, bumperDepth: 0.12,
        windowInset: 0.18, lampSize: 0.1, trimThickness: 0.03,
        archRadius: 0.08, grilleStyle: 'classic', roofStyle: 'open',
        wheelStyle: 'classic',
      },
      features: {
        frontSplitter: false, rearDiffuser: false, sideSkirts: false,
        fenderFlares: false, roofRails: false, spareWheel: false,
        cargoBed: false, convertibleTop: true, roundHeadlamps: false,
        wideGrille: false, fogLamps: false, rearSpoiler: false,
        chromeBumpers: false, doorHandles: true, sideMirrors: true,
        licensePlates: true, interiorSeats: true, dashboard: true,
        steeringWheel: true, exhaustTips: false,
      },
    },
    'Alpine A110': {
      name: 'Alpine A110', type: 'sports',
      width: 1.8, height: 0.8, length: 4.2,
      color: '#1689db', maxSpeed: 520, acceleration: 4.5,
      proportions: {
        hoodLength: 0.27, cabinLength: 0.38, trunkLength: 0.25,
        hoodHeight: 0.78, roofHeight: 0.78, cabinWidth: 0.82,
        wheelBase: 0.62, wheelRadius: 0.39, wheelWidth: 0.24,
        groundClearance: 0.22,
      },
      styling: {
        frontOverhang: 0.48, rearOverhang: 0.28, bumperDepth: 0.18,
        windowInset: 0.22, lampSize: 0.12, trimThickness: 0.035,
        archRadius: 0.12, grilleStyle: 'wide', roofStyle: 'low',
        wheelStyle: 'sport',
      },
      features: {
        frontSplitter: true, rearDiffuser: true, sideSkirts: true,
        fenderFlares: false, roofRails: false, spareWheel: false,
        cargoBed: false, convertibleTop: false, roundHeadlamps: false,
        wideGrille: false, fogLamps: false, rearSpoiler: true,
        chromeBumpers: false, doorHandles: true, sideMirrors: true,
        licensePlates: true, interiorSeats: true, dashboard: true,
        steeringWheel: true, exhaustTips: true,
      },
    },
    'Audi TT': {
      name: 'Audi TT', type: 'sports',
      width: 1.85, height: 0.85, length: 4.2,
      color: '#c6cbd1', maxSpeed: 560, acceleration: 4.8,
      proportions: {
        hoodLength: 0.27, cabinLength: 0.38, trunkLength: 0.25,
        hoodHeight: 0.78, roofHeight: 0.78, cabinWidth: 0.82,
        wheelBase: 0.62, wheelRadius: 0.39, wheelWidth: 0.24,
        groundClearance: 0.22,
      },
      styling: {
        frontOverhang: 0.48, rearOverhang: 0.28, bumperDepth: 0.18,
        windowInset: 0.22, lampSize: 0.12, trimThickness: 0.035,
        archRadius: 0.12, grilleStyle: 'wide', roofStyle: 'low',
        wheelStyle: 'sport',
      },
      features: {
        frontSplitter: true, rearDiffuser: true, sideSkirts: true,
        fenderFlares: false, roofRails: false, spareWheel: false,
        cargoBed: false, convertibleTop: false, roundHeadlamps: false,
        wideGrille: false, fogLamps: false, rearSpoiler: true,
        chromeBumpers: false, doorHandles: true, sideMirrors: true,
        licensePlates: true, interiorSeats: true, dashboard: true,
        steeringWheel: true, exhaustTips: true,
      },
    },
    'Toyota Harrier': {
      name: 'Toyota Harrier', type: 'suv',
      width: 1.95, height: 1.35, length: 4.8,
      color: '#343c49', maxSpeed: 480, acceleration: 7.0,
      proportions: {
        hoodLength: 0.24, cabinLength: 0.43, trunkLength: 0.28,
        hoodHeight: 0.94, roofHeight: 1.0, cabinWidth: 0.82,
        wheelBase: 0.64, wheelRadius: 0.43, wheelWidth: 0.27,
        groundClearance: 0.42,
      },
      styling: {
        frontOverhang: 0.72, rearOverhang: 0.42, bumperDepth: 0.26,
        windowInset: 0.16, lampSize: 0.12, trimThickness: 0.04,
        archRadius: 0.1, grilleStyle: 'upright', roofStyle: 'high',
        wheelStyle: 'utility',
      },
      features: {
        frontSplitter: false, rearDiffuser: false, sideSkirts: false,
        fenderFlares: true, roofRails: true, spareWheel: false,
        cargoBed: false, convertibleTop: false, roundHeadlamps: false,
        wideGrille: true, fogLamps: true, rearSpoiler: false,
        chromeBumpers: false, doorHandles: true, sideMirrors: true,
        licensePlates: true, interiorSeats: true, dashboard: true,
        steeringWheel: true, exhaustTips: false,
      },
    },
    'Mazda CX-5': {
      name: 'Mazda CX-5', type: 'suv',
      width: 1.9, height: 1.35, length: 4.6,
      color: '#b32a2b', maxSpeed: 460, acceleration: 7.2,
      proportions: {
        hoodLength: 0.24, cabinLength: 0.43, trunkLength: 0.28,
        hoodHeight: 0.94, roofHeight: 1.0, cabinWidth: 0.82,
        wheelBase: 0.64, wheelRadius: 0.43, wheelWidth: 0.27,
        groundClearance: 0.42,
      },
      styling: {
        frontOverhang: 0.72, rearOverhang: 0.42, bumperDepth: 0.26,
        windowInset: 0.16, lampSize: 0.12, trimThickness: 0.04,
        archRadius: 0.1, grilleStyle: 'upright', roofStyle: 'high',
        wheelStyle: 'utility',
      },
      features: {
        frontSplitter: false, rearDiffuser: false, sideSkirts: false,
        fenderFlares: true, roofRails: true, spareWheel: false,
        cargoBed: false, convertibleTop: false, roundHeadlamps: false,
        wideGrille: true, fogLamps: true, rearSpoiler: false,
        chromeBumpers: false, doorHandles: true, sideMirrors: true,
        licensePlates: true, interiorSeats: true, dashboard: true,
        steeringWheel: true, exhaustTips: false,
      },
    },
    'Mercedes G-Class': {
      name: 'Mercedes G-Class', type: 'box',
      width: 2.0, height: 1.8, length: 4.7,
      color: '#b8b8b8', maxSpeed: 500, acceleration: 7.5,
      proportions: {
        hoodLength: 0.24, cabinLength: 0.43, trunkLength: 0.28,
        hoodHeight: 0.94, roofHeight: 1.0, cabinWidth: 0.82,
        wheelBase: 0.64, wheelRadius: 0.43, wheelWidth: 0.27,
        groundClearance: 0.42,
      },
      styling: {
        frontOverhang: 0.72, rearOverhang: 0.42, bumperDepth: 0.26,
        windowInset: 0.16, lampSize: 0.12, trimThickness: 0.04,
        archRadius: 0.1, grilleStyle: 'upright', roofStyle: 'high',
        wheelStyle: 'utility',
      },
      features: {
        frontSplitter: false, rearDiffuser: false, sideSkirts: false,
        fenderFlares: true, roofRails: true, spareWheel: true,
        cargoBed: false, convertibleTop: false, roundHeadlamps: true,
        wideGrille: false, fogLamps: true, rearSpoiler: false,
        chromeBumpers: true, doorHandles: true, sideMirrors: true,
        licensePlates: true, interiorSeats: true, dashboard: true,
        steeringWheel: true, exhaustTips: false,
      },
    },
    'Jeep Wrangler': {
      name: 'Jeep Wrangler', type: 'box',
      width: 1.95, height: 1.75, length: 4.3,
      color: '#56724a', maxSpeed: 430, acceleration: 8.2,
      proportions: {
        hoodLength: 0.24, cabinLength: 0.43, trunkLength: 0.28,
        hoodHeight: 0.94, roofHeight: 1.0, cabinWidth: 0.82,
        wheelBase: 0.64, wheelRadius: 0.43, wheelWidth: 0.27,
        groundClearance: 0.42,
      },
      styling: {
        frontOverhang: 0.72, rearOverhang: 0.42, bumperDepth: 0.26,
        windowInset: 0.16, lampSize: 0.12, trimThickness: 0.04,
        archRadius: 0.1, grilleStyle: 'upright', roofStyle: 'high',
        wheelStyle: 'utility',
      },
      features: {
        frontSplitter: false, rearDiffuser: false, sideSkirts: false,
        fenderFlares: true, roofRails: false, spareWheel: true,
        cargoBed: false, convertibleTop: true, roundHeadlamps: true,
        wideGrille: false, fogLamps: true, rearSpoiler: false,
        chromeBumpers: false, doorHandles: true, sideMirrors: true,
        licensePlates: true, interiorSeats: true, dashboard: true,
        steeringWheel: true, exhaustTips: false,
      },
    },
    'Land Rover Defender': {
      name: 'Land Rover Defender', type: 'box',
      width: 2.0, height: 1.7, length: 4.8,
      color: '#87917c', maxSpeed: 470, acceleration: 7.8,
      proportions: {
        hoodLength: 0.24, cabinLength: 0.43, trunkLength: 0.28,
        hoodHeight: 0.94, roofHeight: 1.0, cabinWidth: 0.82,
        wheelBase: 0.64, wheelRadius: 0.43, wheelWidth: 0.27,
        groundClearance: 0.42,
      },
      styling: {
        frontOverhang: 0.72, rearOverhang: 0.42, bumperDepth: 0.26,
        windowInset: 0.16, lampSize: 0.12, trimThickness: 0.04,
        archRadius: 0.1, grilleStyle: 'upright', roofStyle: 'high',
        wheelStyle: 'utility',
      },
      features: {
        frontSplitter: false, rearDiffuser: false, sideSkirts: false,
        fenderFlares: true, roofRails: true, spareWheel: true,
        cargoBed: false, convertibleTop: false, roundHeadlamps: true,
        wideGrille: false, fogLamps: true, rearSpoiler: false,
        chromeBumpers: true, doorHandles: true, sideMirrors: true,
        licensePlates: true, interiorSeats: true, dashboard: true,
        steeringWheel: true, exhaustTips: false,
      },
    },
    'Toyota Land Cruiser': {
      name: 'Toyota Land Cruiser', type: 'suv',
      width: 2.0, height: 1.7, length: 5.0,
      color: '#a6a49a', maxSpeed: 490, acceleration: 7.4,
      proportions: {
        hoodLength: 0.24, cabinLength: 0.43, trunkLength: 0.28,
        hoodHeight: 0.94, roofHeight: 1.0, cabinWidth: 0.82,
        wheelBase: 0.64, wheelRadius: 0.43, wheelWidth: 0.27,
        groundClearance: 0.42,
      },
      styling: {
        frontOverhang: 0.72, rearOverhang: 0.42, bumperDepth: 0.26,
        windowInset: 0.16, lampSize: 0.12, trimThickness: 0.04,
        archRadius: 0.1, grilleStyle: 'upright', roofStyle: 'high',
        wheelStyle: 'utility',
      },
      features: {
        frontSplitter: false, rearDiffuser: false, sideSkirts: false,
        fenderFlares: true, roofRails: true, spareWheel: false,
        cargoBed: false, convertibleTop: false, roundHeadlamps: false,
        wideGrille: true, fogLamps: true, rearSpoiler: false,
        chromeBumpers: false, doorHandles: true, sideMirrors: true,
        licensePlates: true, interiorSeats: true, dashboard: true,
        steeringWheel: true, exhaustTips: false,
      },
    },
    'Land Cruiser 70': {
      name: 'Land Cruiser 70', type: 'box',
      width: 1.9, height: 1.8, length: 4.8,
      color: '#c0b9a2', maxSpeed: 410, acceleration: 8.8,
      proportions: {
        hoodLength: 0.24, cabinLength: 0.43, trunkLength: 0.28,
        hoodHeight: 0.94, roofHeight: 1.0, cabinWidth: 0.82,
        wheelBase: 0.64, wheelRadius: 0.43, wheelWidth: 0.27,
        groundClearance: 0.42,
      },
      styling: {
        frontOverhang: 0.72, rearOverhang: 0.42, bumperDepth: 0.26,
        windowInset: 0.16, lampSize: 0.12, trimThickness: 0.04,
        archRadius: 0.1, grilleStyle: 'upright', roofStyle: 'high',
        wheelStyle: 'utility',
      },
      features: {
        frontSplitter: false, rearDiffuser: false, sideSkirts: false,
        fenderFlares: true, roofRails: false, spareWheel: true,
        cargoBed: false, convertibleTop: false, roundHeadlamps: true,
        wideGrille: false, fogLamps: true, rearSpoiler: false,
        chromeBumpers: true, doorHandles: true, sideMirrors: true,
        licensePlates: true, interiorSeats: true, dashboard: true,
        steeringWheel: true, exhaustTips: false,
      },
    },
    'FJ Cruiser': {
      name: 'FJ Cruiser', type: 'box',
      width: 1.9, height: 1.65, length: 4.6,
      color: '#e4d4b4', maxSpeed: 440, acceleration: 8.0,
      proportions: {
        hoodLength: 0.24, cabinLength: 0.43, trunkLength: 0.28,
        hoodHeight: 0.94, roofHeight: 1.0, cabinWidth: 0.82,
        wheelBase: 0.64, wheelRadius: 0.43, wheelWidth: 0.27,
        groundClearance: 0.42,
      },
      styling: {
        frontOverhang: 0.72, rearOverhang: 0.42, bumperDepth: 0.26,
        windowInset: 0.16, lampSize: 0.12, trimThickness: 0.04,
        archRadius: 0.1, grilleStyle: 'upright', roofStyle: 'high',
        wheelStyle: 'utility',
      },
      features: {
        frontSplitter: false, rearDiffuser: false, sideSkirts: false,
        fenderFlares: true, roofRails: false, spareWheel: true,
        cargoBed: false, convertibleTop: false, roundHeadlamps: true,
        wideGrille: false, fogLamps: true, rearSpoiler: false,
        chromeBumpers: false, doorHandles: true, sideMirrors: true,
        licensePlates: true, interiorSeats: true, dashboard: true,
        steeringWheel: true, exhaustTips: false,
      },
    },
    'Mitsubishi Delica D:5': {
      name: 'Mitsubishi Delica D:5', type: 'van',
      width: 1.85, height: 1.75, length: 4.8,
      color: '#8e969d', maxSpeed: 430, acceleration: 8.5,
      proportions: {
        hoodLength: 0.24, cabinLength: 0.43, trunkLength: 0.28,
        hoodHeight: 0.94, roofHeight: 1.0, cabinWidth: 0.82,
        wheelBase: 0.64, wheelRadius: 0.43, wheelWidth: 0.27,
        groundClearance: 0.42,
      },
      styling: {
        frontOverhang: 0.72, rearOverhang: 0.42, bumperDepth: 0.26,
        windowInset: 0.16, lampSize: 0.12, trimThickness: 0.04,
        archRadius: 0.1, grilleStyle: 'upright', roofStyle: 'high',
        wheelStyle: 'utility',
      },
      features: {
        frontSplitter: false, rearDiffuser: false, sideSkirts: false,
        fenderFlares: true, roofRails: true, spareWheel: false,
        cargoBed: false, convertibleTop: false, roundHeadlamps: false,
        wideGrille: true, fogLamps: true, rearSpoiler: false,
        chromeBumpers: false, doorHandles: true, sideMirrors: true,
        licensePlates: true, interiorSeats: true, dashboard: true,
        steeringWheel: true, exhaustTips: false,
      },
    },
    'Cadillac Escalade': {
      name: 'Cadillac Escalade', type: 'suv',
      width: 2.1, height: 1.85, length: 5.3,
      color: '#20252b', maxSpeed: 520, acceleration: 7.0,
      proportions: {
        hoodLength: 0.24, cabinLength: 0.43, trunkLength: 0.28,
        hoodHeight: 0.94, roofHeight: 1.0, cabinWidth: 0.82,
        wheelBase: 0.64, wheelRadius: 0.43, wheelWidth: 0.27,
        groundClearance: 0.42,
      },
      styling: {
        frontOverhang: 0.72, rearOverhang: 0.42, bumperDepth: 0.26,
        windowInset: 0.16, lampSize: 0.12, trimThickness: 0.04,
        archRadius: 0.1, grilleStyle: 'upright', roofStyle: 'high',
        wheelStyle: 'utility',
      },
      features: {
        frontSplitter: false, rearDiffuser: false, sideSkirts: false,
        fenderFlares: true, roofRails: true, spareWheel: false,
        cargoBed: false, convertibleTop: false, roundHeadlamps: false,
        wideGrille: true, fogLamps: true, rearSpoiler: false,
        chromeBumpers: false, doorHandles: true, sideMirrors: true,
        licensePlates: true, interiorSeats: true, dashboard: true,
        steeringWheel: true, exhaustTips: false,
      },
    },
    'Toyota Vellfire': {
      name: 'Toyota Vellfire', type: 'van',
      width: 1.85, height: 1.8, length: 4.9,
      color: '#252a32', maxSpeed: 470, acceleration: 7.8,
      proportions: {
        hoodLength: 0.24, cabinLength: 0.43, trunkLength: 0.28,
        hoodHeight: 0.94, roofHeight: 1.0, cabinWidth: 0.82,
        wheelBase: 0.64, wheelRadius: 0.43, wheelWidth: 0.27,
        groundClearance: 0.42,
      },
      styling: {
        frontOverhang: 0.72, rearOverhang: 0.42, bumperDepth: 0.26,
        windowInset: 0.16, lampSize: 0.12, trimThickness: 0.04,
        archRadius: 0.1, grilleStyle: 'upright', roofStyle: 'high',
        wheelStyle: 'utility',
      },
      features: {
        frontSplitter: false, rearDiffuser: false, sideSkirts: false,
        fenderFlares: true, roofRails: false, spareWheel: false,
        cargoBed: false, convertibleTop: false, roundHeadlamps: false,
        wideGrille: true, fogLamps: true, rearSpoiler: false,
        chromeBumpers: false, doorHandles: true, sideMirrors: true,
        licensePlates: true, interiorSeats: true, dashboard: true,
        steeringWheel: true, exhaustTips: false,
      },
    },
    'Rover Mini': {
      name: 'Rover Mini', type: 'classic',
      width: 1.55, height: 1.15, length: 3.1,
      color: '#d83d32', maxSpeed: 340, acceleration: 8.0,
      proportions: {
        hoodLength: 0.2, cabinLength: 0.48, trunkLength: 0.2,
        hoodHeight: 0.9, roofHeight: 1.0, cabinWidth: 0.84,
        wheelBase: 0.68, wheelRadius: 0.34, wheelWidth: 0.2,
        groundClearance: 0.18,
      },
      styling: {
        frontOverhang: 0.32, rearOverhang: 0.2, bumperDepth: 0.12,
        windowInset: 0.18, lampSize: 0.13, trimThickness: 0.04,
        archRadius: 0.09, grilleStyle: 'classic', roofStyle: 'round',
        wheelStyle: 'classic',
      },
      features: {
        frontSplitter: false, rearDiffuser: false, sideSkirts: false,
        fenderFlares: false, roofRails: false, spareWheel: false,
        cargoBed: false, convertibleTop: false, roundHeadlamps: true,
        wideGrille: false, fogLamps: false, rearSpoiler: false,
        chromeBumpers: true, doorHandles: true, sideMirrors: true,
        licensePlates: true, interiorSeats: true, dashboard: true,
        steeringWheel: true, exhaustTips: false,
      },
    },
    'Citroen 2CV': {
      name: 'Citroen 2CV', type: 'classic',
      width: 1.5, height: 1.4, length: 3.8,
      color: '#d9d2b4', maxSpeed: 260, acceleration: 11.0,
      proportions: {
        hoodLength: 0.2, cabinLength: 0.48, trunkLength: 0.2,
        hoodHeight: 0.9, roofHeight: 1.0, cabinWidth: 0.84,
        wheelBase: 0.68, wheelRadius: 0.34, wheelWidth: 0.2,
        groundClearance: 0.18,
      },
      styling: {
        frontOverhang: 0.32, rearOverhang: 0.2, bumperDepth: 0.12,
        windowInset: 0.18, lampSize: 0.13, trimThickness: 0.04,
        archRadius: 0.09, grilleStyle: 'classic', roofStyle: 'round',
        wheelStyle: 'classic',
      },
      features: {
        frontSplitter: false, rearDiffuser: false, sideSkirts: false,
        fenderFlares: false, roofRails: false, spareWheel: false,
        cargoBed: false, convertibleTop: true, roundHeadlamps: true,
        wideGrille: false, fogLamps: false, rearSpoiler: false,
        chromeBumpers: true, doorHandles: true, sideMirrors: true,
        licensePlates: true, interiorSeats: true, dashboard: true,
        steeringWheel: true, exhaustTips: false,
      },
    },
    'VW Beetle': {
      name: 'VW Beetle', type: 'beetle',
      width: 1.75, height: 1.45, length: 4.1,
      color: '#f0c33b', maxSpeed: 360, acceleration: 8.5,
      proportions: {
        hoodLength: 0.22, cabinLength: 0.48, trunkLength: 0.22,
        hoodHeight: 0.9, roofHeight: 1.0, cabinWidth: 0.84,
        wheelBase: 0.66, wheelRadius: 0.36, wheelWidth: 0.22,
        groundClearance: 0.2,
      },
      styling: {
        frontOverhang: 0.34, rearOverhang: 0.28, bumperDepth: 0.14,
        windowInset: 0.18, lampSize: 0.16, trimThickness: 0.045,
        archRadius: 0.1, grilleStyle: 'classic', roofStyle: 'round',
        wheelStyle: 'classic',
      },
      features: {
        frontSplitter: false, rearDiffuser: false, sideSkirts: false,
        fenderFlares: false, roofRails: false, spareWheel: false,
        cargoBed: false, convertibleTop: false, roundHeadlamps: true,
        wideGrille: false, fogLamps: false, rearSpoiler: false,
        chromeBumpers: true, doorHandles: true, sideMirrors: true,
        licensePlates: true, interiorSeats: true, dashboard: true,
        steeringWheel: true, exhaustTips: false,
      },
    },
    'Isuzu 117 Coupe': {
      name: 'Isuzu 117 Coupe', type: 'classic',
      width: 1.75, height: 0.95, length: 4.3,
      color: '#d7d0b7', maxSpeed: 390, acceleration: 7.5,
      proportions: {
        hoodLength: 0.2, cabinLength: 0.48, trunkLength: 0.2,
        hoodHeight: 0.9, roofHeight: 1.0, cabinWidth: 0.84,
        wheelBase: 0.68, wheelRadius: 0.34, wheelWidth: 0.2,
        groundClearance: 0.18,
      },
      styling: {
        frontOverhang: 0.32, rearOverhang: 0.2, bumperDepth: 0.12,
        windowInset: 0.18, lampSize: 0.13, trimThickness: 0.04,
        archRadius: 0.09, grilleStyle: 'classic', roofStyle: 'round',
        wheelStyle: 'classic',
      },
      features: {
        frontSplitter: false, rearDiffuser: false, sideSkirts: false,
        fenderFlares: false, roofRails: false, spareWheel: false,
        cargoBed: false, convertibleTop: false, roundHeadlamps: false,
        wideGrille: false, fogLamps: false, rearSpoiler: false,
        chromeBumpers: true, doorHandles: true, sideMirrors: true,
        licensePlates: true, interiorSeats: true, dashboard: true,
        steeringWheel: true, exhaustTips: false,
      },
    },
    'Nissan Pao': {
      name: 'Nissan Pao', type: 'classic',
      width: 1.6, height: 1.35, length: 3.7,
      color: '#a8b6a0', maxSpeed: 300, acceleration: 9.0,
      proportions: {
        hoodLength: 0.2, cabinLength: 0.48, trunkLength: 0.2,
        hoodHeight: 0.9, roofHeight: 1.0, cabinWidth: 0.84,
        wheelBase: 0.68, wheelRadius: 0.34, wheelWidth: 0.2,
        groundClearance: 0.18,
      },
      styling: {
        frontOverhang: 0.32, rearOverhang: 0.2, bumperDepth: 0.12,
        windowInset: 0.18, lampSize: 0.13, trimThickness: 0.04,
        archRadius: 0.09, grilleStyle: 'classic', roofStyle: 'round',
        wheelStyle: 'classic',
      },
      features: {
        frontSplitter: false, rearDiffuser: false, sideSkirts: false,
        fenderFlares: false, roofRails: false, spareWheel: false,
        cargoBed: false, convertibleTop: false, roundHeadlamps: true,
        wideGrille: false, fogLamps: false, rearSpoiler: false,
        chromeBumpers: true, doorHandles: true, sideMirrors: true,
        licensePlates: true, interiorSeats: true, dashboard: true,
        steeringWheel: true, exhaustTips: false,
      },
    },
    'Nissan Figaro': {
      name: 'Nissan Figaro', type: 'classic',
      width: 1.65, height: 1.3, length: 3.7,
      color: '#8eb9a8', maxSpeed: 310, acceleration: 8.8,
      proportions: {
        hoodLength: 0.2, cabinLength: 0.48, trunkLength: 0.2,
        hoodHeight: 0.9, roofHeight: 1.0, cabinWidth: 0.84,
        wheelBase: 0.68, wheelRadius: 0.34, wheelWidth: 0.2,
        groundClearance: 0.18,
      },
      styling: {
        frontOverhang: 0.32, rearOverhang: 0.2, bumperDepth: 0.12,
        windowInset: 0.18, lampSize: 0.13, trimThickness: 0.04,
        archRadius: 0.09, grilleStyle: 'classic', roofStyle: 'round',
        wheelStyle: 'classic',
      },
      features: {
        frontSplitter: false, rearDiffuser: false, sideSkirts: false,
        fenderFlares: false, roofRails: false, spareWheel: false,
        cargoBed: false, convertibleTop: true, roundHeadlamps: true,
        wideGrille: false, fogLamps: false, rearSpoiler: false,
        chromeBumpers: true, doorHandles: true, sideMirrors: true,
        licensePlates: true, interiorSeats: true, dashboard: true,
        steeringWheel: true, exhaustTips: false,
      },
    },
    'Nissan Sunny Truck': {
      name: 'Nissan Sunny Truck', type: 'truck',
      width: 1.65, height: 1.3, length: 4.1,
      color: '#d6d0b8', maxSpeed: 350, acceleration: 8.0,
      proportions: {
        hoodLength: 0.25, cabinLength: 0.34, trunkLength: 0.3,
        hoodHeight: 0.88, roofHeight: 0.96, cabinWidth: 0.84,
        wheelBase: 0.66, wheelRadius: 0.36, wheelWidth: 0.22,
        groundClearance: 0.24,
      },
      styling: {
        frontOverhang: 0.42, rearOverhang: 0.36, bumperDepth: 0.14,
        windowInset: 0.18, lampSize: 0.12, trimThickness: 0.04,
        archRadius: 0.1, grilleStyle: 'classic', roofStyle: 'high',
        wheelStyle: 'utility',
      },
      features: {
        frontSplitter: false, rearDiffuser: false, sideSkirts: false,
        fenderFlares: false, roofRails: false, spareWheel: false,
        cargoBed: true, convertibleTop: false, roundHeadlamps: true,
        wideGrille: false, fogLamps: false, rearSpoiler: false,
        chromeBumpers: true, doorHandles: true, sideMirrors: true,
        licensePlates: true, interiorSeats: true, dashboard: true,
        steeringWheel: true, exhaustTips: false,
      },
    },
    'Volvo 240 Estate': {
      name: 'Volvo 240 Estate', type: 'wagon',
      width: 1.8, height: 1.4, length: 4.8,
      color: '#8a2c2c', maxSpeed: 400, acceleration: 7.8,
      proportions: {
        hoodLength: 0.24, cabinLength: 0.43, trunkLength: 0.28,
        hoodHeight: 0.94, roofHeight: 1.0, cabinWidth: 0.82,
        wheelBase: 0.64, wheelRadius: 0.43, wheelWidth: 0.27,
        groundClearance: 0.28,
      },
      styling: {
        frontOverhang: 0.58, rearOverhang: 0.42, bumperDepth: 0.2,
        windowInset: 0.16, lampSize: 0.12, trimThickness: 0.04,
        archRadius: 0.1, grilleStyle: 'upright', roofStyle: 'high',
        wheelStyle: 'classic',
      },
      features: {
        frontSplitter: false, rearDiffuser: false, sideSkirts: false,
        fenderFlares: false, roofRails: true, spareWheel: false,
        cargoBed: false, convertibleTop: false, roundHeadlamps: false,
        wideGrille: false, fogLamps: false, rearSpoiler: false,
        chromeBumpers: true, doorHandles: true, sideMirrors: true,
        licensePlates: true, interiorSeats: true, dashboard: true,
        steeringWheel: true, exhaustTips: false,
      },
    },
  };

  function mat(color, roughness, metalness) {
    return new THREE.MeshStandardMaterial({
      color: color,
      roughness: roughness === undefined ? 0.48 : roughness,
      metalness: metalness === undefined ? 0.18 : metalness,
    });
  }

  function addMesh(group, geometry, material, x, y, z) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x || 0, y || 0, z || 0);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    return mesh;
  }

  function addBox(group, material, x, y, z, width, height, depth) {
    return addMesh(
      group,
      new THREE.BoxGeometry(width, height, depth),
      material,
      x, y, z
    );
  }

  function addSphere(group, material, x, y, z, sx, sy, sz) {
    const mesh = addMesh(
      group,
      new THREE.SphereGeometry(1, 24, 16),
      material,
      x, y, z
    );
    mesh.scale.set(sx, sy, sz);
    return mesh;
  }

  function addCylinder(group, material, x, y, z, radius, depth, segments) {
    const mesh = addMesh(
      group,
      new THREE.CylinderGeometry(radius, radius, depth, segments || 24),
      material,
      x, y, z
    );
    mesh.rotation.z = Math.PI / 2;
    return mesh;
  }

  function addTorus(group, material, x, y, z, radius, tube) {
    return addMesh(
      group,
      new THREE.TorusGeometry(radius, tube, 10, 28),
      material,
      x, y, z
    );
  }

  function addLine(group, material, points, radius) {
    const curve = new THREE.CatmullRomCurve3(
      points.map(function (p) {
        return new THREE.Vector3(p[0], p[1], p[2]);
      })
    );
    return addMesh(
      group,
      new THREE.TubeGeometry(curve, 24, radius || 0.025, 8, false),
      material,
      0, 0, 0
    );
  }

  function addCylinderBetween(group, material, a, b, radius) {
    const start = new THREE.Vector3(a[0], a[1], a[2]);
    const end = new THREE.Vector3(b[0], b[1], b[2]);
    const direction = new THREE.Vector3().subVectors(end, start);
    const length = direction.length();
    const mesh = addMesh(
      group,
      new THREE.CylinderGeometry(radius, radius, length, 12),
      material,
      (a[0] + b[0]) / 2,
      (a[1] + b[1]) / 2,
      (a[2] + b[2]) / 2
    );
    mesh.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction.normalize()
    );
    return mesh;
  }

  function addWheel(group, x, z, radius, width, tireMaterial, rimMaterial, brakeMaterial) {
    const wheel = new THREE.Group();
    wheel.position.set(x, radius, z);
    group.add(wheel);

    const tire = addCylinder(
      wheel, tireMaterial, 0, 0, 0, radius, width, 32
    );
    tire.rotation.z = Math.PI / 2;

    const rim = addCylinder(
      wheel, rimMaterial, 0, 0, 0, radius * 0.64, width * 1.04, 32
    );
    rim.rotation.z = Math.PI / 2;

    const disc = addCylinder(
      wheel, brakeMaterial, 0, 0, 0, radius * 0.43, width * 1.08, 24
    );
    disc.rotation.z = Math.PI / 2;

    const hub = addCylinder(
      wheel, rimMaterial, 0, 0, 0, radius * 0.16, width * 1.12, 20
    );
    hub.rotation.z = Math.PI / 2;

    for (let i = 0; i < 10; i++) {
      const angle = i * TAU / 10;
      const spoke = addBox(
        wheel, rimMaterial,
        Math.cos(angle) * radius * 0.31,
        Math.sin(angle) * radius * 0.31,
        0,
        radius * 0.09,
        radius * 0.48,
        width * 1.14
      );
      spoke.rotation.z = angle;
    }

    wheel.userData.isWheel = true;
    return wheel;
  }

  function addWheelArch(group, x, y, z, radius, material, side) {
    const points = [];
    for (let i = 0; i <= 16; i++) {
      const angle = Math.PI * i / 16;
      points.push([
        x,
        y + Math.sin(angle) * radius,
        z + Math.cos(angle) * radius
      ]);
    }
    return addLine(group, material, points, 0.045);
  }

  function addWindow(group, glass, x, y, z, w, h, d) {
    return addBox(group, glass, x, y, z, w, h, d);
  }

  function addHeadlamp(group, materials, x, y, z, scale) {
    const bezel = addSphere(
      group, materials.chrome, x, y, z, scale * 1.15, scale, scale * 0.38
    );
    const lens = addSphere(
      group, materials.headlight, x, y, z + scale * 0.08,
      scale * 0.88, scale * 0.78, scale * 0.3
    );
    lens.material = materials.headlight;
    return { bezel: bezel, lens: lens };
  }

  function addTailLamp(group, materials, x, y, z, scale) {
    addBox(
      group, materials.dark, x, y, z,
      scale * 1.8, scale * 0.75, scale * 0.22
    );
    return addBox(
      group, materials.tailLight, x, y, z + 0.025,
      scale * 1.55, scale * 0.5, scale * 0.12
    );
  }

  function createMaterials(color) {
    return {
      paint: new THREE.MeshStandardMaterial({
        color: color || DEFAULT_COLOR,
        roughness: 0.27,
        metalness: 0.48,
      }),
      paintDark: mat(0x202329, 0.35, 0.3),
      glass: new THREE.MeshStandardMaterial({
        color: 0x182b3c,
        roughness: 0.12,
        metalness: 0.35,
        transparent: true,
        opacity: 0.78,
      }),
      tire: mat(0x101114, 0.92, 0.02),
      rim: mat(0xbfc6ce, 0.22, 0.82),
      brake: mat(0x55585d, 0.65, 0.45),
      chrome: mat(0xd2d7dc, 0.2, 0.9),
      dark: mat(0x090b0e, 0.78, 0.1),
      headlight: new THREE.MeshStandardMaterial({
        color: 0xfff4ce,
        emissive: 0x776633,
        roughness: 0.15,
      }),
      tailLight: new THREE.MeshStandardMaterial({
        color: 0xe21c2b,
        emissive: 0x650008,
        roughness: 0.2,
      }),
      interior: mat(0x191b20, 0.82, 0.05),
      seat: mat(0x292d34, 0.9, 0.02),
      rubber: mat(0x17191c, 0.95, 0),
    };
  }
        cabinWidth: 0.82,
        wheelBase: 0.64,
        wheelRadius: 0.43,
        wheelWidth: 0.27,
        groundClearance: 0.3,
      },
      styling: {
        frontOverhang: 0.52,
        rearOverhang: 0.22,
        bumperDepth: 0.12,
        windowInset: 0.18,
        lampSize: 0.1,
        trimThickness: 0.03,
        archRadius: 0.08,
        grilleStyle: 'classic',
        roofStyle: 'open',
        wheelStyle: 'classic',
      },
      features: {
        frontSplitter: false,
        rearDiffuser: false,
        sideSkirts: false,
        fenderFlares: false,
        roofRails: false,
        spareWheel: false,
        cargoBed: false,
        convertibleTop: true,
        roundHeadlamps: false,
        wideGrille: false,
        fogLamps: false,
        rearSpoiler: false,
        chromeBumpers: false,
        doorHandles: true,
        sideMirrors: true,
        licensePlates: true,
        interiorSeats: true,
        dashboard: true,
        steeringWheel: true,
        exhaustTips: false,
      },
    },
    'Alpine A110': {
      name: 'Alpine A110',
      type: 'sports',
      width: 1.8, height: 0.8, length: 4.2,
      color: '#1689db', maxSpeed: 520, acceleration: 4.5,
      proportions: {
        hoodLength: 0.27,
        cabinLength: 0.38,
        trunkLength: 0.25,
        hoodHeight: 0.78,
        roofHeight: 0.78,
        cabinWidth: 0.82,
        wheelBase: 0.62,
        wheelRadius: 0.39,
        wheelWidth: 0.24,
        groundClearance: 0.22,
      },
      styling: {
        frontOverhang: 0.48,
        rearOverhang: 0.28,
        bumperDepth: 0.18,
        windowInset: 0.22,
        lampSize: 0.12,
        trimThickness: 0.035,
        archRadius: 0.12,
        grilleStyle: 'wide',
        roofStyle: 'low',
        wheelStyle: 'sport',
      },
      features: {
        frontSplitter: true,
        rearDiffuser: true,
        sideSkirts: true,
        fenderFlares: false,
        roofRails: false,
        spareWheel: false,
        cargoBed: false,
        convertibleTop: false,
        roundHeadlamps: false,
        wideGrille: false,
        fogLamps: false,
        rearSpoiler: true,
        chromeBumpers: false,
        doorHandles: true,
        sideMirrors: true,
        licensePlates: true,
        interiorSeats: true,
        dashboard: true,
        steeringWheel: true,
        exhaustTips: true,
      },
    },
    'Audi TT': {
      name: 'Audi TT',
      type: 'sports',
      width: 1.85, height: 0.85, length: 4.2,
      color: '#c6cbd1', maxSpeed: 560, acceleration: 4.8,
      proportions: {
        hoodLength: 0.27,
        cabinLength: 0.38,
        trunkLength: 0.25,
        hoodHeight: 0.78,
        roofHeight: 0.78,
        cabinWidth: 0.82,
        wheelBase: 0.62,
        wheelRadius: 0.39,
        wheelWidth: 0.24,
        groundClearance: 0.22,
      },
      styling: {
        frontOverhang: 0.48,
        rearOverhang: 0.28,
        bumperDepth: 0.18,
        windowInset: 0.22,
        lampSize: 0.12,
        trimThickness: 0.035,
        archRadius: 0.12,
        grilleStyle: 'wide',
        roofStyle: 'low',
        wheelStyle: 'sport',
      },
      features: {
        frontSplitter: true,
        rearDiffuser: true,
        sideSkirts: true,
        fenderFlares: false,
        roofRails: false,
        spareWheel: false,
        cargoBed: false,
        convertibleTop: false,
        roundHeadlamps: false,
        wideGrille: false,
        fogLamps: false,
        rearSpoiler: true,
        chromeBumpers: false,
        doorHandles: true,
        sideMirrors: true,
        licensePlates: true,
        interiorSeats: true,
        dashboard: true,
        steeringWheel: true,
        exhaustTips: true,
      },
    },
    'Toyota Harrier': {
      name: 'Toyota Harrier',
      type: 'suv',
      width: 1.95, height: 1.35, length: 4.8,
      color: '#343c49', maxSpeed: 480, acceleration: 7.0,
      proportions: {
        hoodLength: 0.24,
        cabinLength: 0.43,
        trunkLength: 0.28,
        hoodHeight: 0.94,
        roofHeight: 1.0,
        cabinWidth: 0.82,
        wheelBase: 0.64,
        wheelRadius: 0.43,
        wheelWidth: 0.27,
        groundClearance: 0.42,
      },
      styling: {
        frontOverhang: 0.72,
        rearOverhang: 0.42,
        bumperDepth: 0.26,
        windowInset: 0.16,
        lampSize: 0.12,
        trimThickness: 0.04,
        archRadius: 0.1,
        grilleStyle: 'upright',
        roofStyle: 'high',
        wheelStyle: 'utility',
      },
      features: {
        frontSplitter: false,
        rearDiffuser: false,
        sideSkirts: false,
        fenderFlares: true,
        roofRails: true,
        spareWheel: false,
        cargoBed: false,
        convertibleTop: false,
        roundHeadlamps: false,
        wideGrille: true,
        fogLamps: true,
        rearSpoiler: false,
        chromeBumpers: false,
        doorHandles: true,
        sideMirrors: true,
        licensePlates: true,
        interiorSeats: true,
        dashboard: true,
        steeringWheel: true,
        exhaustTips: false,
      },
    },
    'Mazda CX-5': {
      name: 'Mazda CX-5',
      type: 'suv',
      width: 1.9, height: 1.35, length: 4.6,
      color: '#b32a2b', maxSpeed: 460, acceleration: 7.2,
      proportions: {
        hoodLength: 0.24,
        cabinLength: 0.43,
        trunkLength: 0.28,
        hoodHeight: 0.94,
        roofHeight: 1.0,
        cabinWidth: 0.82,
        wheelBase: 0.64,
        wheelRadius: 0.43,
        wheelWidth: 0.27,
        groundClearance: 0.42,
      },
      styling: {
        frontOverhang: 0.72,
        rearOverhang: 0.42,
        bumperDepth: 0.26,
        windowInset: 0.16,
        lampSize: 0.12,
        trimThickness: 0.04,
        archRadius: 0.1,
        grilleStyle: 'upright',
        roofStyle: 'high',
        wheelStyle: 'utility',
      },
      features: {
        frontSplitter: false,
        rearDiffuser: false,
        sideSkirts: false,
        fenderFlares: true,
        roofRails: true,
        spareWheel: false,
        cargoBed: false,
        convertibleTop: false,
        roundHeadlamps: false,
        wideGrille: true,
        fogLamps: true,
        rearSpoiler: false,
        chromeBumpers: false,
        doorHandles: true,
        sideMirrors: true,
        licensePlates: true,
        interiorSeats: true,
        dashboard: true,
        steeringWheel: true,
        exhaustTips: false,
      },
    },
        sideMirrors: true,
        licensePlates: true,
        interiorSeats: true,
        dashboard: true,
        steeringWheel: true,
        exhaustTips: false,
      },
    },
    'Mercedes G-Class': {
      name: 'Mercedes G-Class',
      type: 'box',
      width: 2.0, height: 1.8, length: 4.7,
      color: '#b8b8b8', maxSpeed: 500, acceleration: 7.5,
      proportions: {
        hoodLength: 0.24,
        cabinLength: 0.43,
        trunkLength: 0.28,
        hoodHeight: 0.94,
        roofHeight: 1.0,
        cabinWidth: 0.82,
        wheelBase: 0.64,
        wheelRadius: 0.43,
        wheelWidth: 0.27,
        groundClearance: 0.42,
      },
      styling: {
        frontOverhang: 0.78,
        rearOverhang: 0.48,
        bumperDepth: 0.28,
        windowInset: 0.14,
        lampSize: 0.12,
        trimThickness: 0.045,
        archRadius: 0.12,
        grilleStyle: 'upright',
        roofStyle: 'high',
        wheelStyle: 'utility',
      },
      features: {
        frontSplitter: false,
        rearDiffuser: false,
        sideSkirts: false,
        fenderFlares: true,
        roofRails: false,
        spareWheel: true,
        cargoBed: false,
        convertibleTop: false,
        roundHeadlamps: false,
        wideGrille: true,
        fogLamps: true,
        rearSpoiler: false,
        chromeBumpers: false,
        doorHandles: true,
        sideMirrors: true,
        licensePlates: true,
        interiorSeats: true,
        dashboard: true,
        steeringWheel: true,
        exhaustTips: false,
      },
    },
    'Jeep Wrangler': {
      name: 'Jeep Wrangler',
      type: 'box',
      width: 1.95, height: 1.75, length: 4.3,
      color: '#536b43', maxSpeed: 440, acceleration: 8.0,
      proportions: {
        hoodLength: 0.24,
        cabinLength: 0.43,
        trunkLength: 0.28,
        hoodHeight: 0.94,
        roofHeight: 1.0,
        cabinWidth: 0.82,
        wheelBase: 0.64,
        wheelRadius: 0.43,
        wheelWidth: 0.27,
        groundClearance: 0.42,
      },
      styling: {
        frontOverhang: 0.78,
        rearOverhang: 0.48,
        bumperDepth: 0.28,
        windowInset: 0.14,
        lampSize: 0.12,
        trimThickness: 0.045,
        archRadius: 0.12,
        grilleStyle: 'upright',
        roofStyle: 'high',
        wheelStyle: 'utility',
      },
      features: {
        frontSplitter: false,
        rearDiffuser: false,
        sideSkirts: false,
        fenderFlares: true,
        roofRails: false,
        spareWheel: true,
        cargoBed: false,
        convertibleTop: false,
        roundHeadlamps: false,
        wideGrille: true,
        fogLamps: true,
        rearSpoiler: false,
        chromeBumpers: false,
        doorHandles: true,
        sideMirrors: true,
        licensePlates: true,
        interiorSeats: true,
        dashboard: true,
        steeringWheel: true,
        exhaustTips: false,
      },
    },
    'Land Rover Defender': {
      name: 'Land Rover Defender',
      type: 'box',
      width: 2.0, height: 1.7, length: 4.8,
      color: '#65715e', maxSpeed: 490, acceleration: 7.6,
      proportions: {
        hoodLength: 0.24,
        cabinLength: 0.43,
        trunkLength: 0.28,
        hoodHeight: 0.94,
        roofHeight: 1.0,
        cabinWidth: 0.82,
        wheelBase: 0.64,
        wheelRadius: 0.43,
        wheelWidth: 0.27,
        groundClearance: 0.42,
      },
      styling: {
        frontOverhang: 0.78,
        rearOverhang: 0.48,
        bumperDepth: 0.28,
        windowInset: 0.14,
        lampSize: 0.12,
        trimThickness: 0.045,
        archRadius: 0.12,
        grilleStyle: 'upright',
        roofStyle: 'high',
        wheelStyle: 'utility',
      },
      features: {
        frontSplitter: false,
        rearDiffuser: false,
        sideSkirts: false,
        fenderFlares: true,
        roofRails: false,
        spareWheel: true,
        cargoBed: false,
        convertibleTop: false,
        roundHeadlamps: false,
        wideGrille: true,
        fogLamps: true,
        rearSpoiler: false,
        chromeBumpers: false,
        doorHandles: true,
        sideMirrors: true,
        licensePlates: true,
        interiorSeats: true,
        dashboard: true,
        steeringWheel: true,
        exhaustTips: false,
      },
    },
    'Toyota Land Cruiser': {
      name: 'Toyota Land Cruiser',
      type: 'suv',
      width: 2.0, height: 1.7, length: 5.0,
      color: '#d0c9b6', maxSpeed: 520, acceleration: 8.0,
      proportions: {
        hoodLength: 0.24,
        cabinLength: 0.43,
        trunkLength: 0.28,
        hoodHeight: 0.94,
        roofHeight: 1.0,
        cabinWidth: 0.82,
        wheelBase: 0.64,
        wheelRadius: 0.43,
        wheelWidth: 0.27,
        groundClearance: 0.42,
      },
      styling: {
        frontOverhang: 0.72,
        rearOverhang: 0.42,
        bumperDepth: 0.26,
        windowInset: 0.16,
        lampSize: 0.12,
        trimThickness: 0.04,
        archRadius: 0.1,
        grilleStyle: 'upright',
        roofStyle: 'high',
        wheelStyle: 'utility',
      },
      features: {
        frontSplitter: false,
        rearDiffuser: false,
        sideSkirts: false,
        fenderFlares: true,
        roofRails: true,
        spareWheel: false,
        cargoBed: false,
        convertibleTop: false,
        roundHeadlamps: false,
        wideGrille: true,
        fogLamps: true,
        rearSpoiler: false,
        chromeBumpers: false,
        doorHandles: true,
        sideMirrors: true,
        licensePlates: true,
        interiorSeats: true,
        dashboard: true,
        steeringWheel: true,
        exhaustTips: false,
      },
    },
    'Land Cruiser 70': {
      name: 'Land Cruiser 70',
      type: 'box',
      width: 1.9, height: 1.8, length: 4.8,
      color: '#8b927b', maxSpeed: 430, acceleration: 9.0,
      proportions: {
        hoodLength: 0.24,
        cabinLength: 0.43,
        trunkLength: 0.28,
        hoodHeight: 0.94,
        roofHeight: 1.0,
        cabinWidth: 0.82,
        wheelBase: 0.64,
        wheelRadius: 0.43,
        wheelWidth: 0.27,
        groundClearance: 0.42,
      },
      styling: {
        frontOverhang: 0.78,
        rearOverhang: 0.48,
        bumperDepth: 0.28,
        windowInset: 0.14,
        lampSize: 0.12,
        trimThickness: 0.045,
        archRadius: 0.12,
        grilleStyle: 'upright',
        roofStyle: 'high',
        wheelStyle: 'utility',
      },
        archRadius: 0.12,
        grilleStyle: 'upright',
        roofStyle: 'high',
        wheelStyle: 'utility',
      },
      features: {
        frontSplitter: false,
        rearDiffuser: false,
        sideSkirts: false,
        fenderFlares: true,
        roofRails: false,
        spareWheel: true,
        cargoBed: false,
        convertibleTop: false,
        roundHeadlamps: false,
        wideGrille: true,
        fogLamps: true,
        rearSpoiler: false,
        chromeBumpers: false,
        doorHandles: true,
        sideMirrors: true,
        licensePlates: true,
        interiorSeats: true,
        dashboard: true,
        steeringWheel: true,
        exhaustTips: false,
      },
    },
    'FJ Cruiser': {
      name: 'FJ Cruiser',
      type: 'box',
      width: 1.9, height: 1.65, length: 4.6,
      color: '#d58b2d', maxSpeed: 450, acceleration: 8.2,
      // Proportion controls are consumed by the body and cabin builders.
      proportions: {
        hoodLength: 0.24,
        cabinLength: 0.43,
        trunkLength: 0.28,
        hoodHeight: 0.94,
        roofHeight: 1.0,
        cabinWidth: 0.82,
        wheelBase: 0.64,
        wheelRadius: 0.43,
        wheelWidth: 0.27,
        groundClearance: 0.42,
      },
      styling: {
        frontOverhang: 0.78,
        rearOverhang: 0.48,
        bumperDepth: 0.28,
        windowInset: 0.14,
        lampSize: 0.12,
        trimThickness: 0.045,
        archRadius: 0.12,
        grilleStyle: 'upright',
        roofStyle: 'high',
        wheelStyle: 'utility',
      },
      features: {
        frontSplitter: false,
        rearDiffuser: false,
        sideSkirts: false,
        fenderFlares: true,
        roofRails: false,
        spareWheel: true,
        cargoBed: false,
        convertibleTop: false,
        roundHeadlamps: false,
        wideGrille: true,
        fogLamps: true,
        rearSpoiler: false,
        chromeBumpers: false,
        doorHandles: true,
        sideMirrors: true,
        licensePlates: true,
        interiorSeats: true,
        dashboard: true,
        steeringWheel: true,
        exhaustTips: false,
      },
    },
    'Mitsubishi Delica D:5': {
      name: 'Mitsubishi Delica D:5',
      type: 'van',
      width: 1.85, height: 1.75, length: 4.8,
      color: '#68727d', maxSpeed: 420, acceleration: 9.5,
      proportions: {
        hoodLength: 0.24,
        cabinLength: 0.43,
        trunkLength: 0.28,
        hoodHeight: 0.94,
        roofHeight: 1.0,
        cabinWidth: 0.82,
        wheelBase: 0.64,
        wheelRadius: 0.43,
        wheelWidth: 0.27,
        groundClearance: 0.3,
      },
      styling: {
        frontOverhang: 0.8,
        rearOverhang: 0.5,
        bumperDepth: 0.3,
        windowInset: 0.12,
        lampSize: 0.1,
        trimThickness: 0.04,
        archRadius: 0.1,
        grilleStyle: 'upright',
        roofStyle: 'high',
        wheelStyle: 'classic',
      },
      features: {
        frontSplitter: false,
        rearDiffuser: false,
        sideSkirts: false,
        fenderFlares: false,
        roofRails: true,
        spareWheel: false,
        cargoBed: false,
        convertibleTop: false,
        roundHeadlamps: false,
        wideGrille: true,
        fogLamps: false,
        rearSpoiler: false,
        chromeBumpers: false,
        doorHandles: true,
        sideMirrors: true,
        licensePlates: true,
        interiorSeats: true,
        dashboard: true,
        steeringWheel: true,
        exhaustTips: false,
      },
    },
    'Cadillac Escalade': {
      name: 'Cadillac Escalade',
      type: 'suv',
      width: 2.1, height: 1.85, length: 5.3,
      color: '#20252b', maxSpeed: 560, acceleration: 8.5,
      proportions: {
        hoodLength: 0.24,
        cabinLength: 0.43,
        trunkLength: 0.28,
        hoodHeight: 0.94,
        roofHeight: 1.0,
        cabinWidth: 0.82,
        wheelBase: 0.64,
        wheelRadius: 0.43,
        wheelWidth: 0.27,
        groundClearance: 0.42,
      },
      styling: {
        frontOverhang: 0.72,
        rearOverhang: 0.42,
        bumperDepth: 0.26,
        windowInset: 0.16,
        lampSize: 0.12,
        trimThickness: 0.04,
        archRadius: 0.1,
        grilleStyle: 'upright',
        roofStyle: 'high',
        wheelStyle: 'utility',
      },
      features: {
        frontSplitter: false,
        rearDiffuser: false,
        sideSkirts: false,
        fenderFlares: true,
        roofRails: true,
        spareWheel: false,
        cargoBed: false,
        convertibleTop: false,
        roundHeadlamps: false,
        wideGrille: true,
        fogLamps: true,
        rearSpoiler: false,
        chromeBumpers: false,
        doorHandles: true,
        sideMirrors: true,
        licensePlates: true,
        interiorSeats: true,
        dashboard: true,
        steeringWheel: true,
        exhaustTips: false,
      },
    },
    'Toyota Vellfire': {
      name: 'Toyota Vellfire',
      type: 'van',
      width: 1.85, height: 1.8, length: 4.9,
      color: '#252a31', maxSpeed: 470, acceleration: 8.0,
      proportions: {
        hoodLength: 0.24,
        cabinLength: 0.43,
        trunkLength: 0.28,
        hoodHeight: 0.94,
        roofHeight: 1.0,
        cabinWidth: 0.82,
        wheelBase: 0.64,
        wheelRadius: 0.43,
        wheelWidth: 0.27,
        groundClearance: 0.3,
      },
      styling: {
        frontOverhang: 0.8,
        rearOverhang: 0.5,
        bumperDepth: 0.3,
        windowInset: 0.12,
        lampSize: 0.1,
        trimThickness: 0.04,
        archRadius: 0.1,
        grilleStyle: 'upright',
        roofStyle: 'high',
        wheelStyle: 'classic',
      },
      features: {
        frontSplitter: false,
        rearDiffuser: false,
        sideSkirts: false,
        fenderFlares: false,
        roofRails: true,
        spareWheel: false,
        cargoBed: false,
        convertibleTop: false,
        roundHeadlamps: false,
        wideGrille: true,
        fogLamps: false,
        rearSpoiler: false,
        chromeBumpers: false,
        doorHandles: true,
        sideMirrors: true,
        licensePlates: true,
        interiorSeats: true,
        dashboard: true,
        steeringWheel: true,
        exhaustTips: false,
      },
    },
      proportions: {
        hoodLength: 0.24,
        cabinLength: 0.43,
        trunkLength: 0.28,
        hoodHeight: 0.94,
        roofHeight: 1.0,
        cabinWidth: 0.86,
        wheelBase: 0.64,
        wheelRadius: 0.43,
        wheelWidth: 0.27,
        groundClearance: 0.3,
      },
      // Styling values: each preset has a distinct stance and trim treatment.
      styling: {
        frontOverhang: 0.58,
        rearOverhang: 0.35,
        bumperDepth: 0.22,
        windowInset: 0.18,
        lampSize: 0.12,
        trimThickness: 0.035,
        archRadius: 0.09,
        grilleStyle: 'classic',
        roofStyle: 'high',
        wheelStyle: 'classic',
      },
      features: {
        frontSplitter: false,
        rearDiffuser: false,
        sideSkirts: false,
        fenderFlares: false,
        roofRails: false,
        spareWheel: false,
        cargoBed: false,
        convertibleTop: false,
        roundHeadlamps: true,
        wideGrille: false,
        fogLamps: false,
        rearSpoiler: false,
        chromeBumpers: true,
        doorHandles: true,
        sideMirrors: true,
        licensePlates: true,
        interiorSeats: true,
        dashboard: true,
        steeringWheel: true,
        exhaustTips: false,
      },
    },
    'Citroen 2CV': {
      name: 'Citroen 2CV',
      type: 'classic',
      width: 1.5, height: 1.4, length: 3.8,
      color: '#d8c6a2', maxSpeed: 180, acceleration: 13.0,
      // Proportion controls are consumed by the body and cabin builders.
      proportions: {
        hoodLength: 0.24,
        cabinLength: 0.43,
        trunkLength: 0.28,
        hoodHeight: 0.94,
        roofHeight: 1.0,
        cabinWidth: 0.86,
        wheelBase: 0.64,
        wheelRadius: 0.43,
        wheelWidth: 0.27,
        groundClearance: 0.3,
      },
      // Styling values: each preset has a distinct stance and trim treatment.
      styling: {
        frontOverhang: 0.58,
        rearOverhang: 0.35,
        bumperDepth: 0.22,
        windowInset: 0.18,
        lampSize: 0.12,
        trimThickness: 0.035,
        archRadius: 0.09,
        grilleStyle: 'classic',
        roofStyle: 'high',
        wheelStyle: 'classic',
      },
      features: {
        frontSplitter: false,
        rearDiffuser: false,
        sideSkirts: false,
        fenderFlares: false,
        roofRails: false,
        spareWheel: false,
        cargoBed: false,
        convertibleTop: false,
        roundHeadlamps: true,
        wideGrille: false,
        fogLamps: false,
        rearSpoiler: false,
        chromeBumpers: true,
        doorHandles: true,
        sideMirrors: true,
        licensePlates: true,
        interiorSeats: true,
        dashboard: true,
        steeringWheel: true,
        exhaustTips: false,
      },
    },
    'VW Beetle': {
      name: 'VW Beetle',
      type: 'beetle',
      width: 1.75, height: 1.45, length: 4.1,
      color: '#f0d94b', maxSpeed: 250, acceleration: 10.0,
      // Proportion controls are consumed by the body and cabin builders.
      proportions: {
        hoodLength: 0.24,
        cabinLength: 0.43,
        trunkLength: 0.28,
        hoodHeight: 0.94,
        roofHeight: 1.0,
        cabinWidth: 0.82,
        wheelBase: 0.64,
        wheelRadius: 0.43,
        wheelWidth: 0.27,
        groundClearance: 0.3,
      },
      // Styling values: each preset has a distinct stance and trim treatment.
      styling: {
        frontOverhang: 0.62,
        rearOverhang: 0.38,
        bumperDepth: 0.24,
        windowInset: 0.16,
        lampSize: 0.11,
        trimThickness: 0.035,
        archRadius: 0.09,
        grilleStyle: 'classic',
        roofStyle: 'high',
        wheelStyle: 'classic',
      },
      features: {
        frontSplitter: false,
        rearDiffuser: false,
        sideSkirts: false,
        fenderFlares: false,
        roofRails: false,
        spareWheel: false,
        cargoBed: false,
        convertibleTop: false,
        roundHeadlamps: true,
        wideGrille: false,
        fogLamps: false,
        rearSpoiler: false,
        chromeBumpers: true,
        doorHandles: true,
        sideMirrors: true,
        licensePlates: true,
        interiorSeats: true,
        dashboard: true,
        steeringWheel: true,
        exhaustTips: false,
      },
    },
    'Isuzu 117 Coupe': {
      name: 'Isuzu 117 Coupe',
      type: 'classic',
      width: 1.75, height: 0.95, length: 4.3,
      color: '#b7a17b', maxSpeed: 300, acceleration: 8.5,
      // Proportion controls are consumed by the body and cabin builders.
      proportions: {
        hoodLength: 0.24,
        cabinLength: 0.43,
        trunkLength: 0.28,
        hoodHeight: 0.94,
        roofHeight: 1.0,
        cabinWidth: 0.86,
        wheelBase: 0.64,
        wheelRadius: 0.43,
        wheelWidth: 0.27,
        groundClearance: 0.3,
      },
      // Styling values: each preset has a distinct stance and trim treatment.
      styling: {
        frontOverhang: 0.58,
        rearOverhang: 0.35,
        bumperDepth: 0.22,
        windowInset: 0.18,
        lampSize: 0.12,
        trimThickness: 0.035,
        archRadius: 0.09,
        grilleStyle: 'classic',
        roofStyle: 'high',
        wheelStyle: 'classic',
      },
      features: {
        frontSplitter: false,
        rearDiffuser: false,
        sideSkirts: false,
        fenderFlares: false,
        roofRails: false,
        spareWheel: false,
        cargoBed: false,
        convertibleTop: false,
        roundHeadlamps: true,
        wideGrille: false,
        fogLamps: false,
        rearSpoiler: false,
        chromeBumpers: true,
        doorHandles: true,
        sideMirrors: true,
        licensePlates: true,
        interiorSeats: true,
        dashboard: true,
        steeringWheel: true,
        exhaustTips: false,
      },
    },
    'Nissan Pao': {
      name: 'Nissan Pao',
      type: 'classic',
      width: 1.6, height: 1.35, length: 3.7,
      color: '#9bb4a1', maxSpeed: 210, acceleration: 11.0,
      // Proportion controls are consumed by the body and cabin builders.
      proportions: {
        hoodLength: 0.24,
        cabinLength: 0.43,
        trunkLength: 0.28,
        hoodHeight: 0.94,
        roofHeight: 1.0,
        cabinWidth: 0.86,
        wheelBase: 0.64,
        wheelRadius: 0.43,
        wheelWidth: 0.27,
        groundClearance: 0.3,
      },
      // Styling values: each preset has a distinct stance and trim treatment.
      styling: {
        frontOverhang: 0.58,
        rearOverhang: 0.35,
        bumperDepth: 0.22,
        windowInset: 0.18,
        lampSize: 0.12,
        trimThickness: 0.035,
        archRadius: 0.09,
        grilleStyle: 'classic',
        roofStyle: 'high',
        wheelStyle: 'classic',
      },
      features: {
        frontSplitter: false,
        rearDiffuser: false,
        sideSkirts: false,
        fenderFlares: false,
        roofRails: false,
        spareWheel: false,
        cargoBed: false,
        convertibleTop: false,
        roundHeadlamps: true,
        wideGrille: false,
        fogLamps: false,
        rearSpoiler: false,
        chromeBumpers: true,
        doorHandles: true,
        sideMirrors: true,
        licensePlates: true,
        interiorSeats: true,
        dashboard: true,
        steeringWheel: true,
        exhaustTips: false,
      },
    },
    'Nissan Figaro': {
      name: 'Nissan Figaro',
      type: 'classic',
      width: 1.65, height: 1.3, length: 3.7,
      color: '#9bc8c7', maxSpeed: 220, acceleration: 10.5,
      // Proportion controls are consumed by the body and cabin builders.
      proportions: {
        hoodLength: 0.24,
        cabinLength: 0.43,
        trunkLength: 0.28,
        hoodHeight: 0.94,
        roofHeight: 1.0,
        cabinWidth: 0.86,
        wheelBase: 0.64,
        wheelRadius: 0.43,
        wheelWidth: 0.27,
        groundClearance: 0.3,
      },
      // Styling values: each preset has a distinct stance and trim treatment.
      styling: {
        frontOverhang: 0.58,
        rearOverhang: 0.35,
        bumperDepth: 0.22,
        windowInset: 0.18,
        lampSize: 0.12,
        trimThickness: 0.035,
        archRadius: 0.09,
        grilleStyle: 'classic',
        roofStyle: 'high',
        wheelStyle: 'classic',
      },
      features: {
        frontSplitter: false,
        rearDiffuser: false,
        sideSkirts: false,
        fenderFlares: false,
        roofRails: false,
        spareWheel: false,
        cargoBed: false,
        convertibleTop: false,
        roundHeadlamps: true,
        wideGrille: false,
        fogLamps: false,
        rearSpoiler: false,
        chromeBumpers: true,
        doorHandles: true,
        sideMirrors: true,
        licensePlates: true,
        interiorSeats: true,
        dashboard: true,
        steeringWheel: true,
        exhaustTips: false,
      },
    },
    'Nissan Sunny Truck': {
      name: 'Nissan Sunny Truck',
      type: 'truck',
      width: 1.65, height: 1.3, length: 4.1,
      color: '#d7d1c3', maxSpeed: 240, acceleration: 11.0,
      // Proportion controls are consumed by the body and cabin builders.
      proportions: {
        hoodLength: 0.24,
        cabinLength: 0.43,
        trunkLength: 0.28,
        hoodHeight: 0.94,
        roofHeight: 1.0,
        cabinWidth: 0.82,
        wheelBase: 0.64,
        wheelRadius: 0.43,
        wheelWidth: 0.27,
        groundClearance: 0.3,
      },
      // Styling values: each preset has a distinct stance and trim treatment.
      styling: {
        frontOverhang: 0.64,
        rearOverhang: 0.36,
        bumperDepth: 0.2,
        windowInset: 0.18,
        lampSize: 0.12,
        trimThickness: 0.035,
        archRadius: 0.1,
        grilleStyle: 'classic',
        roofStyle: 'high',
        wheelStyle: 'utility',
      },
      features: {
        frontSplitter: false,
        rearDiffuser: false,
        sideSkirts: false,
        fenderFlares: true,
        roofRails: false,
        spareWheel: false,
        cargoBed: true,
        convertibleTop: false,
        roundHeadlamps: false,
        wideGrille: false,
        fogLamps: false,
        rearSpoiler: false,
        chromeBumpers: false,
        doorHandles: true,
        sideMirrors: true,
        licensePlates: true,
        interiorSeats: true,
        dashboard: true,
        steeringWheel: true,
        exhaustTips: false,
      },
    },
    'Volvo 240 Estate': {
      name: 'Volvo 240 Estate',
      type: 'wagon',
      width: 1.8, height: 1.4, length: 4.8,
      color: '#55718a', maxSpeed: 360, acceleration: 8.0,
      // Proportion controls are consumed by the body and cabin builders.
      proportions: {
        hoodLength: 0.24,
        cabinLength: 0.43,
        trunkLength: 0.28,
        hoodHeight: 0.94,
        roofHeight: 1.0,
        cabinWidth: 0.82,
        wheelBase: 0.64,
        wheelRadius: 0.43,
        wheelWidth: 0.27,
        groundClearance: 0.3,
      },
      // Styling values: each preset has a distinct stance and trim treatment.
      styling: {
        frontOverhang: 0.7,
        rearOverhang: 0.43,
        bumperDepth: 0.25,
        windowInset: 0.16,
        lampSize: 0.12,
        trimThickness: 0.04,
        archRadius: 0.1,
        grilleStyle: 'classic',
        roofStyle: 'high',
        wheelStyle: 'classic',
      },
      features: {
        frontSplitter: false,
        rearDiffuser: false,
        sideSkirts: false,
        fenderFlares: false,
        roofRails: true,
        spareWheel: false,
        cargoBed: false,
        convertibleTop: false,
        roundHeadlamps: false,
        wideGrille: false,
        fogLamps: false,
        rearSpoiler: false,
        chromeBumpers: false,
        doorHandles: true,
        sideMirrors: true,
        licensePlates: true,
        interiorSeats: true,
        dashboard: true,
        steeringWheel: true,
        exhaustTips: false,
      },
    },
  };

  // ---------- Materials ----------
  function makeMaterial(color, roughness, metalness) {
    return new THREE.MeshStandardMaterial({
      color: color === undefined ? 0xffffff : color,
      roughness: roughness === undefined ? 0.48 : roughness,
      metalness: metalness === undefined ? 0.16 : metalness
    });
  }

  function makeGlass() {
    return new THREE.MeshPhysicalMaterial({
      color: 0x263c4c, roughness: 0.12, metalness: 0.18,
      transparent: true, opacity: 0.78, clearcoat: 0.9,
      clearcoatRoughness: 0.08, side: THREE.DoubleSide
    });
  }

  function addMesh(parent, geometry, material, position, scale, name) {
    const mesh = new THREE.Mesh(geometry, material);
    if (position) mesh.position.set(position[0], position[1], position[2]);
    if (scale) mesh.scale.set(scale[0], scale[1], scale[2]);
    mesh.name = name || 'vehicle-part';
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  function addBox(parent, material, x, y, z, sx, sy, sz, name) {
    return addMesh(parent, new THREE.BoxGeometry(sx, sy, sz), material, [x,y,z], null, name);
  }

  function addSphere(parent, material, x, y, z, sx, sy, sz, name) {
    return addMesh(parent, new THREE.SphereGeometry(1, 28, 18), material, [x,y,z], [sx,sy,sz], name);
  }

  function addCylinder(parent, material, x, y, z, radiusTop, radiusBottom, depth, radial) {
    const mesh = addMesh(parent, new THREE.CylinderGeometry(radiusTop, radiusBottom, depth, radial || 24), material, [x,y,z]);
    mesh.rotation.z = Math.PI / 2;
    return mesh;
  }

  function addTorus(parent, material, x, y, z, radius, tube) {
    return addMesh(parent, new THREE.TorusGeometry(radius, tube, 10, 32), material, [x,y,z]);
  }

  // ---------- Body construction ----------
  function addWheelArch(parent, paint, x, z, radius, width) {
    const arch = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.075, 10, 32, Math.PI), paint);
    arch.position.set(x, 0.50, z);
    arch.rotation.z = Math.PI;
    arch.scale.set(1, 0.78, Math.max(0.5, width / 0.18));
    arch.castShadow = true;
    parent.add(arch);
  }

  function buildWheel(parent, x, z, spec, mats) {
    const wheel = new THREE.Group();
    wheel.name = 'wheel-' + (x < 0 ? 'left-' : 'right-') + (z > 0 ? 'front' : 'rear');
    wheel.position.set(x, spec.proportions.groundClearance + 0.18, z);
    const tire = new THREE.Mesh(new THREE.CylinderGeometry(spec.proportions.wheelRadius, spec.proportions.wheelRadius, spec.proportions.wheelWidth, 32), mats.tire);
    tire.rotation.z = Math.PI / 2; tire.castShadow = true; wheel.add(tire);
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(spec.proportions.wheelRadius * 0.66, spec.proportions.wheelRadius * 0.66, spec.proportions.wheelWidth * 1.03, 32), mats.rim);
    rim.rotation.z = Math.PI / 2; wheel.add(rim);
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, spec.proportions.wheelWidth * 1.08, 20), mats.chrome);
    hub.rotation.z = Math.PI / 2; wheel.add(hub);
    for (let i=0;i<10;i++) {
      const a = i * TAU / 10;
      const spoke = addBox(wheel, mats.rim, Math.cos(a)*0.20, Math.sin(a)*0.20, 0, 0.045, 0.32, spec.proportions.wheelWidth*1.06, 'rim-spoke');
      spoke.rotation.z = -a;
    }
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.29,0.29,0.035,32), mats.brake);
        disc.rotation.z = Math.PI/2;
    disc.position.x = x < 0 ? -0.04 : 0.04;
    wheel.add(disc);

    const caliper = addBox(
      wheel,
      mats.caliper,
      x < 0 ? -0.07 : 0.07,
      0.12,
      0.02,
      0.12,
      0.22,
      0.10,
      'brake-caliper'
    );

    caliper.rotation.z = 0.18;
    parent.add(wheel);
    return wheel;
  }

  function buildBody(parent, spec, mats) {
    const w = spec.width;
    const h = spec.height;
    const l = spec.length;

    const p = spec.proportions;
    const f = spec.features;
    const s = spec.styling;

    const bodyY = p.groundClearance + h * 0.38;
    const bodyH = Math.max(0.48, h * 0.55);

    addBox(
      parent, mats.paint,
      0, bodyY, 0,
      w, bodyH, l,
      'main-body'
    );

    // Front hood and rear deck
    addBox(
      parent, mats.paint,
      0, bodyY + bodyH * 0.10, l * 0.29,
      w * 0.96, bodyH * 0.48, l * 0.38,
      'hood'
    );

    addBox(
      parent, mats.paint,
      0, bodyY + bodyH * 0.08, -l * 0.31,
      w * 0.96, bodyH * 0.46, l * 0.34,
      'rear-deck'
    );

    if (spec.type === 'beetle') {
      addSphere(
        parent, mats.paint,
        0, bodyY + 0.20, 0,
        w * 0.51, h * 0.48, l * 0.46,
        'beetle-rounded-body'
      );

      addSphere(
        parent, mats.paint,
        0, bodyY + 0.44, -l * 0.05,
        w * 0.43, h * 0.43, l * 0.34,
        'beetle-dome'
      );
    }

    if (spec.type === 'classic') {
      addSphere(
        parent, mats.paint,
        0, bodyY + 0.10, 0,
        w * 0.50, h * 0.30, l * 0.45,
        'classic-rounded-body'
      );
    }

    if (spec.type === 'truck') {
      addBox(
        parent, mats.paint,
        0, bodyY + 0.28, -l * 0.30,
        w * 0.91, 0.45, l * 0.34,
        'pickup-bed-walls'
      );

      addBox(
        parent, mats.dark,
        0, bodyY + 0.30, -l * 0.30,
        w * 0.78, 0.035, l * 0.27,
        'pickup-bed-floor'
      );
    }

    // Cabin and windows
    const cabinW = w * p.cabinWidth;
    const cabinL = l * p.cabinLength;
    const cabinY = bodyY + bodyH * 0.53;
    const cabinZ = -l * 0.04;
    const roofH = Math.max(0.28, h * p.roofHeight * 0.35);

    if (spec.type !== 'open') {
      addBox(
        parent, mats.paint,
        0, cabinY + roofH * 0.68, cabinZ,
        cabinW, 0.16, cabinL,
        'roof'
      );

      addBox(
        parent, mats.glass,
        0, cabinY + roofH * 0.32, cabinZ + l * 0.13,
        cabinW * 0.94, roofH * 0.68, cabinL * 0.25,
        'windshield'
      );

      addBox(
        parent, mats.glass,
        0, cabinY + roofH * 0.32, cabinZ - l * 0.29,
        cabinW * 0.94, roofH * 0.68, cabinL * 0.20,
        'rear-window'
      );

      [-1, 1].forEach(side => {
        addBox(
          parent, mats.glass,
          side * (cabinW * 0.49),
          cabinY + roofH * 0.32,
          cabinZ - l * 0.07,
          0.035, roofH * 0.65, cabinL * 0.53,
          'side-window'
        );

        addBox(
          parent, mats.paint,
          side * (cabinW * 0.50),
          cabinY + roofH * 0.32,
          cabinZ + l * 0.21,
          0.07, roofH * 0.76, 0.09,
          'A-pillar'
        );

        addBox(
          parent, mats.paint,
          side * (cabinW * 0.50),
          cabinY + roofH * 0.32,
          cabinZ - l * 0.31,
          0.07, roofH * 0.76, 0.09,
          'C-pillar'
        );
      });
    }

    // Bumpers and grille
    addBox(
      parent, mats.chrome,
      0, p.groundClearance + 0.25, l * 0.505,
      w * 0.91, 0.13, 0.12,
      'front-bumper'
    );

    addBox(
      parent, mats.chrome,
      0, p.groundClearance + 0.25, -l * 0.505,
      w * 0.91, 0.13, 0.12,
      'rear-bumper'
    );

    addBox(
      parent, mats.dark,
      0, bodyY + 0.02, l * 0.506,
      w * 0.52, 0.20, 0.025,
      'front-grille'
    );

    // Headlights, taillights and mirrors
    [-1, 1].forEach(side => {
      const lampX = side * w * 0.36;

      addBox(
        parent, mats.headlamp,
        lampX, bodyY + 0.15, l * 0.493,
        0.25, 0.12, 0.045,
        'headlamp'
      );

      addBox(
        parent, mats.taillamp,
        lampX, bodyY + 0.14, -l * 0.493,
        0.22, 0.13, 0.045,
        'tail-lamp'
      );

      addSphere(
        parent, mats.indicator,
        side * w * 0.44, bodyY + 0.13, l * 0.49,
        0.045, 0.045, 0.035,
        'indicator'
      );

      addBox(
        parent, mats.dark,
        side * w * 0.52, cabinY + 0.10, l * 0.15,
        0.16, 0.08, 0.20,
        'side-mirror'
      );
    });

    // Optional aerodynamic parts
    if (f.frontSplitter) {
      addBox(
        parent, mats.dark,
        0, p.groundClearance + 0.13, l * 0.49,
        w * 1.02, 0.06, 0.28,
        'front-splitter'
      );
    }

    if (f.rearDiffuser) {
      addBox(
        parent, mats.dark,
        0, p.groundClearance + 0.14, -l * 0.49,
        w * 0.72, 0.08, 0.30,
        'rear-diffuser'
      );
    }

    if (f.sideSkirts) {
      [-1, 1].forEach(side => {
        addBox(
          parent, mats.dark,
          side * w * 0.49,
          p.groundClearance + 0.15,
          0,
          0.08, 0.12, l * 0.52,
          'side-skirt'
        );
      });
    }

    if (f.rearSpoiler) {
      addBox(
        parent, mats.dark,
        0, bodyY + bodyH * 0.62, -l * 0.43,
        w * 0.70, 0.06, 0.18,
        'spoiler-wing'
      );
    }

    // License plates
    addBox(
      parent, mats.plate,
      0, bodyY - 0.03, l * 0.515,
      w * 0.27, 0.08, 0.018,
      'front-license-plate'
    );

    addBox(
      parent, mats.plate,
      0, bodyY - 0.03, -l * 0.515,
      w * 0.27, 0.08, 0.018,
      'rear-license-plate'
    );
  }

  function buildInterior(parent, spec, mats) {
    const w = spec.width;
    const l = spec.length;
    const y = spec.height * 0.68 + 0.55;

    [-1, 1].forEach(side => {
      addBox(
        parent, mats.seat,
        side * w * 0.22, y, -0.02,
        w * 0.25, 0.48, 0.30,
        'front-seat'
      );

      addBox(
        parent, mats.seat,
        side * w * 0.22, y + 0.25, -0.16,
        w * 0.25, 0.48, 0.12,
        'front-seat-back'
      );
    });

    addBox(
      parent, mats.dark,
      0, y + 0.30, l * 0.12,
      w * 0.88, 0.08, 0.18,
      'dashboard'
    );
  }

  function makeMaterials(color) {
    const paintColor =
      color === undefined || color === null
        ? DEFAULT_COLOR
        : (
          typeof color === 'string'
            ? Number.parseInt(color.replace('#', ''), 16)
            : color
        );

    return {
      paint: makeMaterial(paintColor, 0.24, 0.42),
      dark: makeMaterial(0x171a1e, 0.82, 0.08),
      glass: makeGlass(),
      chrome: makeMaterial(0xbfc7ce, 0.22, 0.82),
      tire: makeMaterial(0x111214, 0.96, 0.02),
      rim: makeMaterial(0xc6cbd0, 0.24, 0.88),
      brake: makeMaterial(0x555b62, 0.72, 0.45),
      caliper: makeMaterial(0xc52b25, 0.42, 0.32),
      headlamp: new THREE.MeshStandardMaterial({
        color: 0xfff4d0,
        emissive: 0x665522
      }),
      taillamp: new THREE.MeshStandardMaterial({
        color: 0x9e1018,
        emissive: 0x650000
      }),
      plate: makeMaterial(0xe7e9e9, 0.6, 0.05),
      seat: makeMaterial(0x292d32, 0.88, 0.02)
    };
  }

  function createCar(name, color) {
    const spec = CARS[name];

    if (!spec) {
      console.warn('GTQHICars: Unknown vehicle:', name);
      return null;
    }

    const mats = makeMaterials(
      color === undefined ? spec.color : color
    );

    const root = new THREE.Group();
    root.name = name;

    root.userData.vehicleName = name;
    root.userData.vehicleSpec = spec;
    root.userData.maxSpeed = spec.maxSpeed;
    root.userData.acceleration = spec.acceleration;
    root.userData.speed = 0;
    root.userData.wheels = [];

    buildBody(root, spec, mats);
    buildInterior(root, spec, mats);

    const x = spec.width * 0.49;
    const z = spec.length * spec.proportions.wheelBase * 0.5;

    [-x, x].forEach(side => {
      [-z, z].forEach(axle => {
        root.userData.wheels.push(
          buildWheel(root, side, axle, spec, mats)
        );
      });
    });

    root.userData.setColor = function(nextColor) {
      const value =
        typeof nextColor === 'string'
          ? Number.parseInt(nextColor.replace('#', ''), 16)
          : nextColor;

      root.traverse(object => {
        if (object.isMesh && object.material === mats.paint) {
          object.material.color.setHex(value);
        }
      });
    };

    root.userData.dispose = function() {
      root.traverse(object => {
        if (object.geometry) object.geometry.dispose();
      });

      Object.values(mats).forEach(material => {
        if (material && material.dispose) {
          material.dispose();
        }
      });
    };

    return root;
  }

  function getSpec(name) {
    return CARS[name] || null;
  }

  function getPerformance(name) {
    const spec = CARS[name];

    return spec
      ? {
          maxSpeed: spec.maxSpeed,
          acceleration: spec.acceleration,
          type: spec.type
        }
      : null;
  }

  global.GTQHICars = {
    version: VERSION,
    list: Object.keys(CARS),
    specs: CARS,
    create: createCar,
    getSpec: getSpec,
    getPerformance: getPerformance
  };

  console.log(
    'GTQHICars v' + VERSION +
    ' loaded: ' + Object.keys(CARS).length + ' vehicles'
  );

})(window);


/* ============================================================
   GTQHI v5.0
   ADVANCED VEHICLE ENGINE
   PART 1 - CORE / DATA / PHYSICS FOUNDATION
   ============================================================ */

(function (global) {
"use strict";

const VERSION = "5.0.0";

const CONFIG = {
    debug: false,
    maxVehicles: 64,
    fixedTimeStep: 1 / 60,
    maxSubSteps: 5,
    gravity: 9.81,
    airDensity: 1.225,
    defaultColor: "#e53935",
    defaultMass: 1450,
    defaultWheelRadius: 0.34,
    defaultWheelWidth: 0.22,
    maxEngineRPM: 8500,
    idleRPM: 850,
    transmissionEfficiency: 0.88,
    tireGrip: 1.0,
    damageEnabled: true
};

const UTILS = {
    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    },

    lerp(a, b, t) {
        return a + (b - a) * t;
    },

    smoothStep(a, b, x) {
        const t = this.clamp((x - a) / (b - a), 0, 1);
        return t * t * (3 - 2 * t);
    },

    degToRad(deg) {
        return deg * Math.PI / 180;
    },

    radToDeg(rad) {
        return rad * 180 / Math.PI;
    },

    kmhToMs(kmh) {
        return kmh / 3.6;
    },

    msToKmh(ms) {
        return ms * 3.6;
    },

    clamp01(value) {
        return this.clamp(value, 0, 1);
    },

    approach(current, target, speed, dt) {
        const amount = speed * dt;
        if (current < target) {
            return Math.min(current + amount, target);
        }
        return Math.max(current - amount, target);
    },

    distance2D(a, b) {
        const dx = a.x - b.x;
        const dz = a.z - b.z;
        return Math.sqrt(dx * dx + dz * dz);
    },

    randomRange(min, max) {
        return min + Math.random() * (max - min);
    },

    deepClone(value) {
        return JSON.parse(JSON.stringify(value));
    },

    createId() {
        return "GTQHI_" +
            Date.now().toString(36) + "_" +
            Math.random().toString(36).slice(2, 9);
    }
};

/* ============================================================
   VEHICLE DATABASE
   ============================================================ */

const VEHICLE_DATABASE = [

{
    name: "Nissan Fairlady Z",
    manufacturer: "Nissan",
    type: "sports",
    year: 2023,
    mass: 1580,
    power: 405,
    torque: 475,
    maxSpeed: 250,
    acceleration: 7.8,
    braking: 1.05,
    handling: 0.91,
    grip: 1.02,
    wheelbase: 2.55,
    width: 1.85,
    length: 4.38,
    height: 1.31,
    dragCoefficient: 0.30,
    color: "#e53935"
},

{
    name: "Toyota Supra",
    manufacturer: "Toyota",
    type: "sports",
    year: 2023,
    mass: 1520,
    power: 387,
    torque: 500,
    maxSpeed: 250,
    acceleration: 8.2,
    braking: 1.08,
    handling: 0.94,
    grip: 1.05,
    wheelbase: 2.47,
    width: 1.86,
    length: 4.38,
    height: 1.29,
    dragCoefficient: 0.30,
    color: "#ff9800"
},

{
    name: "Porsche 911",
    manufacturer: "Porsche",
    type: "sports",
    year: 2024,
    mass: 1500,
    power: 450,
    torque: 530,
    maxSpeed: 293,
    acceleration: 9.1,
    braking: 1.15,
    handling: 0.97,
    grip: 1.12,
    wheelbase: 2.45,
    width: 1.85,
    length: 4.52,
    height: 1.30,
    dragCoefficient: 0.29,
    color: "#eeeeee"
},

{
    name: "Lamborghini Revuelto",
    manufacturer: "Lamborghini",
    type: "supercar",
    year: 2024,
    mass: 1772,
    power: 1015,
    torque: 807,
    maxSpeed: 350,
    acceleration: 10.0,
    braking: 1.25,
    handling: 0.98,
    grip: 1.20,
    wheelbase: 2.78,
    width: 2.03,
    length: 4.95,
    height: 1.16,
    dragCoefficient: 0.30,
    color: "#d4ff00"
},

{
    name: "Mazda Roadster",
    manufacturer: "Mazda",
    type: "roadster",
    year: 2024,
    mass: 1100,
    power: 136,
    torque: 152,
    maxSpeed: 204,
    acceleration: 5.5,
    braking: 0.95,
    handling: 0.96,
    grip: 0.98,
    wheelbase: 2.31,
    width: 1.73,
    length: 3.91,
    height: 1.24,
    dragCoefficient: 0.33,
    color: "#2196f3"
},

{
    name: "Alpine A110",
    manufacturer: "Alpine",
    type: "sports",
    year: 2023,
    mass: 1100,
    power: 300,
    torque: 340,
    maxSpeed: 260,
    acceleration: 7.0,
    braking: 1.10,
    handling: 0.99,
    grip: 1.10,
    wheelbase: 2.42,
    width: 1.80,
    length: 4.18,
    height: 1.25,
    dragCoefficient: 0.32,
    color: "#1565c0"
},

{
    name: "Audi TT",
    manufacturer: "Audi",
    type: "sports",
    year: 2022,
    mass: 1400,
    power: 245,
    torque: 370,
    maxSpeed: 250,
    acceleration: 6.8,
    braking: 1.03,
    handling: 0.90,
    grip: 1.00,
    wheelbase: 2.51,
    width: 1.83,
    length: 4.19,
    height: 1.35,
    dragCoefficient: 0.30,
    color: "#eeeeee"
},

{
    name: "Toyota Harrier",
    manufacturer: "Toyota",
    type: "suv",
    year: 2024,
    mass: 1650,
    power: 178,
    torque: 221,
    maxSpeed: 180,
    acceleration: 5.5,
    braking: 0.85,
    handling: 0.75,
    grip: 0.91,
    wheelbase: 2.69,
    width: 1.85,
    length: 4.74,
    height: 1.66,
    dragCoefficient: 0.33,
    color: "#212121"
},

{
    name: "Mazda CX-5",
    manufacturer: "Mazda",
    type: "suv",
    year: 2024,
    mass: 1600,
    power: 190,
    torque: 252,
    maxSpeed: 195,
    acceleration: 5.8,
    braking: 0.88,
    handling: 0.79,
    grip: 0.93,
    wheelbase: 2.70,
    width: 1.84,
    length: 4.57,
    height: 1.69,
    dragCoefficient: 0.33,
    color: "#555555"
},

{
    name: "Mercedes G-Class",
    manufacturer: "Mercedes-Benz",
    type: "offroad",
    year: 2024,
    mass: 2485,
    power: 585,
    torque: 850,
    maxSpeed: 220,
    acceleration: 7.2,
    braking: 0.92,
    handling: 0.70,
    grip: 1.05,
    wheelbase: 2.89,
    width: 1.98,
    length: 4.82,
    height: 1.97,
    dragCoefficient: 0.54,
    color: "#424242"
},

{
    name: "Jeep Wrangler",
    manufacturer: "Jeep",
    type: "offroad",
    year: 2023,
    mass: 2050,
    power: 272,
    torque: 400,
    maxSpeed: 180,
    acceleration: 5.2,
    braking: 0.85,
    handling: 0.68,
    grip: 1.15,
    wheelbase: 3.01,
    width: 1.89,
    length: 4.88,
    height: 1.84,
    dragCoefficient: 0.50,
    color: "#4caf50"
},

{
    name: "Land Rover Defender",
    manufacturer: "Land Rover",
    type: "offroad",
    year: 2024,
    mass: 2250,
    power: 300,
    torque: 400,
    maxSpeed: 191,
    acceleration: 5.4,
    braking: 0.90,
    handling: 0.73,
    grip: 1.13,
    wheelbase: 3.02,
    width: 2.01,
    length: 5.02,
    height: 1.97,
    dragCoefficient: 0.40,
    color: "#616b50"
},

{
    name: "Toyota Land Cruiser",
    manufacturer: "Toyota",
    type: "offroad",
    year: 2024,
    mass: 2450,
    power: 305,
    torque: 700,
    maxSpeed: 210,
    acceleration: 5.8,
    braking: 0.91,
    handling: 0.72,
    grip: 1.16,
    wheelbase: 2.85,
    width: 1.98,
    length: 4.92,
    height: 1.87,
    dragCoefficient: 0.39,
    color: "#795548"
},

{
    name: "Land Cruiser 70",
    manufacturer: "Toyota",
    type: "offroad",
    year: 2024,
    mass: 2300,
    power: 204,
    torque: 500,
    maxSpeed: 170,
    acceleration: 4.8,
    braking: 0.82,
    handling: 0.65,
    grip: 1.12,
    wheelbase: 2.73,
    width: 1.87,
    length: 4.89,
    height: 1.94,
    dragCoefficient: 0.48,
    color: "#9e9e9e"
},

{
    name: "FJ Cruiser",
    manufacturer: "Toyota",
    type: "offroad",
    year: 2016,
    mass: 1940,
    power: 276,
    torque: 380,
    maxSpeed: 180,
    acceleration: 5.0,
    braking: 0.84,
    handling: 0.70,
    grip: 1.10,
    wheelbase: 2.69,
    width: 1.90,
    length: 4.67,
    height: 1.83,
    dragCoefficient: 0.45,
    color: "#ff9800"
},

{
    name: "Mitsubishi Delica D:5",
    manufacturer: "Mitsubishi",
    type: "minivan",
    year: 2024,
    mass: 1950,
    power: 145,
    torque: 380,
    maxSpeed: 180,
    acceleration: 4.5,
    braking: 0.80,
    handling: 0.70,
    grip: 0.98,
    wheelbase: 2.85,
    width: 1.79,
    length: 4.80,
    height: 1.87,
    dragCoefficient: 0.35,
    color: "#263238"
},

{
    name: "Cadillac Escalade",
    manufacturer: "Cadillac",
    type: "suv",
    year: 2024,
    mass: 2700,
    power: 420,
    torque: 624,
    maxSpeed: 210,
    acceleration: 6.0,
    braking: 0.90,
    handling: 0.68,
    grip: 1.00,
    wheelbase: 3.07,
    width: 2.06,
    length: 5.38,
    height: 1.95,
    dragCoefficient: 0.36,
    color: "#212121"
},

{
    name: "Toyota Vellfire",
    manufacturer: "Toyota",
    type: "minivan",
    year: 2024,
    mass: 2200,
    power: 279,
    torque: 430,
    maxSpeed: 180,
    acceleration: 5.0,
    braking: 0.82,
    handling: 0.71,
    grip: 0.95,
    wheelbase: 3.00,
    width: 1.85,
    length: 4.99,
    height: 1.94,
    dragCoefficient: 0.33,
    color: "#212121"
},

{
    name: "Rover Mini",
    manufacturer: "Rover",
    type: "classic",
    year: 1999,
    mass: 720,
    power: 63,
    torque: 95,
    maxSpeed: 145,
    acceleration: 3.5,
    braking: 0.72,
    handling: 0.84,
    grip: 0.90,
    wheelbase: 2.04,
    width: 1.41,
    length: 3.05,
    height: 1.35,
    dragCoefficient: 0.46,
    color: "#e53935"
},

{
    name: "Citroen 2CV",
    manufacturer: "Citroen",
    type: "classic",
    year: 1980,
    mass: 600,
    power: 29,
    torque: 39,
    maxSpeed: 115,
    acceleration: 2.2,
    braking: 0.55,
    handling: 0.70,
    grip: 0.75,
    wheelbase: 2.40,
    width: 1.48,
    length: 3.83,
    height: 1.60,
    dragCoefficient: 0.50,
    color: "#eeeeee"
},

{
    name: "VW Beetle",
    manufacturer: "Volkswagen",
    type: "classic",
    year: 1970,
    mass: 850,
    power: 50,
    torque: 105,
    maxSpeed: 140,
    acceleration: 2.8,
    braking: 0.62,
    handling: 0.72,
    grip: 0.80,
    wheelbase: 2.40,
    width: 1.54,
    length: 4.08,
    height: 1.50,
    dragCoefficient: 0.48,
    color: "#ffeb3b"
},

{
    name: "Isuzu 117 Coupe",
    manufacturer: "Isuzu",
    type: "classic",
    year: 1978,
    mass: 1100,
    power: 135,
    torque: 185,
    maxSpeed: 190,
    acceleration: 4.0,
    braking: 0.78,
    handling: 0.82,
    grip: 0.86,
    wheelbase: 2.50,
    width: 1.60,
    length: 4.31,
    height: 1.32,
    dragCoefficient: 0.42,
    color: "#795548"
},

{
    name: "Nissan Pao",
    manufacturer: "Nissan",
    type: "classic",
    year: 1990,
    mass: 750,
    power: 52,
    torque: 75,
    maxSpeed: 140,
    acceleration: 2.5,
    braking: 0.60,
    handling: 0.70,
    grip: 0.78,
    wheelbase: 2.30,
    width: 1.59,
    length: 3.74,
    height: 1.47,
    dragCoefficient: 0.45,
    color: "#a5d6a7"
},

{
    name: "Nissan Figaro",
    manufacturer: "Nissan",
    type: "classic",
    year: 1991,
    mass: 810,
    power: 76,
    torque: 106,
    maxSpeed: 160,
    acceleration: 3.0,
    braking: 0.66,
    handling: 0.75,
    grip: 0.80,
    wheelbase: 2.30,
    width: 1.63,
    length: 3.74,
    height: 1.36,
    dragCoefficient: 0.43,
    color: "#80cbc4"
},

{
    name: "Nissan Sunny Truck",
    manufacturer: "Nissan",
    type: "truck",
    year: 1989,
    mass: 900,
    power: 85,
    torque: 130,
    maxSpeed: 150,
    acceleration: 3.0,
    braking: 0.65,
    handling: 0.72,
    grip: 0.82,
    wheelbase: 2.30,
    width: 1.50,
    length: 3.85,
    height: 1.45,
    dragCoefficient: 0.48,
    color: "#eeeeee"
},

{
    name: "Volvo 240 Estate",
    manufacturer: "Volvo",
    type: "wagon",
    year: 1993,
    mass: 1450,
    power: 130,
    torque: 210,
    maxSpeed: 185,
    acceleration: 4.2,
    braking: 0.82,
    handling: 0.78,
    grip: 0.90,
    wheelbase: 2.77,
    width: 1.71,
    length: 4.79,
    height: 1.46,
    dragCoefficient: 0.42,
    color: "#1565c0"
}

];

/* ============================================================
   END OF PART 1 DATA
   PART 2 CONTINUES WITH PERFORMANCE ENGINE
   ============================================================ */

/* ============================================================
   GTQHI v5.0
   PART 2 - ENGINE / TRANSMISSION / TIRE PHYSICS
   ============================================================ */

/* ENGINE TORQUE CURVE */

const ENGINE_SYSTEM = {

    calculateRPM(speed, gear, ratios, finalDrive, radius) {
        const ratio = ratios[gear];

        if (!ratio || radius <= 0) {
            return CONFIG.idleRPM;
        }

        const wheelRPM =
            (speed / (2 * Math.PI * radius)) * 60;

        const rpm =
            wheelRPM * ratio * finalDrive;

        return UTILS.clamp(
            rpm,
            CONFIG.idleRPM,
            CONFIG.maxEngineRPM
        );
    },

    calculateTorque(rpm, power, maxTorque) {
        const normalized =
            UTILS.clamp01(
                (rpm - CONFIG.idleRPM) /
                (CONFIG.maxEngineRPM - CONFIG.idleRPM)
            );

        const peak = 0.55 + 0.45 *
            Math.sin(normalized * Math.PI);

        const powerTorque =
            rpm > 100
                ? (power * 9550) / rpm
                : maxTorque;

        return Math.min(
            maxTorque * peak,
            powerTorque
        );
    },

    calculatePower(torque, rpm) {
        return torque * rpm / 9550;
    },

    calculateEngineForce(
        torque,
        gearRatio,
        finalDrive,
        efficiency,
        wheelRadius
    ) {
        if (wheelRadius <= 0) return 0;

        return (
            torque *
            gearRatio *
            finalDrive *
            efficiency
        ) / wheelRadius;
    }
};

/* ============================================================
   TRANSMISSION SYSTEM
   ============================================================ */

const TRANSMISSION_SYSTEM = {

    defaultRatios: [
        -3.20,
        3.80,
        2.60,
        1.90,
        1.50,
        1.20,
        1.00,
        0.84,
        0.70
    ],

    create(type = "automatic") {
        return {
            type,
            gear: 1,
            maxGear: 8,
            ratios: [...this.defaultRatios],
            finalDrive: 3.42,
            shiftTimer: 0,
            shiftCooldown: 0.25,
            automatic: type === "automatic"
        };
    },

    shiftUp(transmission) {
        if (transmission.gear < transmission.maxGear) {
            transmission.gear++;
            transmission.shiftTimer = 0.15;
            return true;
        }

        return false;
    },

    shiftDown(transmission) {
        if (transmission.gear > 1) {
            transmission.gear--;
            transmission.shiftTimer = 0.15;
            return true;
        }

        return false;
    },

    reverse(transmission) {
        transmission.gear = -1;
    },

    neutral(transmission) {
        transmission.gear = 0;
    },

    updateAutomatic(transmission, rpm, dt) {
        if (!transmission.automatic) return;

        transmission.shiftTimer = Math.max(
            0,
            transmission.shiftTimer - dt
        );

        if (transmission.shiftTimer > 0) return;

        if (
            rpm > 7600 &&
            transmission.gear < transmission.maxGear
        ) {
            this.shiftUp(transmission);
        }

        if (
            rpm < 2100 &&
            transmission.gear > 1
        ) {
            this.shiftDown(transmission);
        }
    },

    getRatio(transmission) {
        if (transmission.gear === 0) return 0;

        return transmission.ratios[
            transmission.gear
        ] || 0;
    }
};

/* ============================================================
   TIRE PHYSICS
   ============================================================ */

const TIRE_SYSTEM = {

    calculateGrip(
        baseGrip,
        surfaceGrip,
        temperature,
        wear,
        wetness
    ) {
        const temperatureFactor =
            UTILS.clamp(
                1 - Math.abs(temperature - 85) / 120,
                0.55,
                1.08
            );

        const wearFactor =
            1 - UTILS.clamp01(wear) * 0.35;

        const wetFactor =
            1 - UTILS.clamp01(wetness) * 0.55;

        return (
            baseGrip *
            surfaceGrip *
            temperatureFactor *
            wearFactor *
            wetFactor *
            CONFIG.tireGrip
        );
    },

    calculateSlipAngle(
        lateralVelocity,
        forwardVelocity
    ) {
        return Math.atan2(
            lateralVelocity,
            Math.max(0.1, Math.abs(forwardVelocity))
        );
    },

    calculateLateralForce(
        slipAngle,
        grip,
        mass,
        normalLoad
    ) {
        const stiffness = 8.5;

        const force =
            -slipAngle *
            stiffness *
            normalLoad;

        const maxForce =
            grip *
            normalLoad;

        return UTILS.clamp(
            force,
            -maxForce,
            maxForce
        );
    },

    calculateLongitudinalForce(
        throttle,
        brake,
        grip,
        normalLoad
    ) {
        const driveForce =
            throttle * normalLoad * grip;

        const brakeForce =
            brake * normalLoad * grip;

        return driveForce - brakeForce;
    },

    calculateCombinedGrip(
        longitudinal,
        lateral,
        maxForce
    ) {
        const total = Math.sqrt(
            longitudinal * longitudinal +
            lateral * lateral
        );

        if (total <= maxForce) {
            return {
                longitudinal,
                lateral,
                limited: false
            };
        }

        const scale = maxForce / total;

        return {
            longitudinal: longitudinal * scale,
            lateral: lateral * scale,
            limited: true
        };
    }
};

/* ============================================================
   AERODYNAMICS
   ============================================================ */

const AERODYNAMIC_SYSTEM = {

    calculateDrag(
        velocity,
        dragCoefficient,
        frontalArea
    ) {
        return (
            0.5 *
            CONFIG.airDensity *
            dragCoefficient *
            frontalArea *
            velocity *
            Math.abs(velocity)
        );
    },

    calculateDownforce(
        velocity,
        downforceCoefficient,
        frontalArea
    ) {
        return (
            0.5 *
            CONFIG.airDensity *
            downforceCoefficient *
            frontalArea *
            velocity *
            velocity
        );
    },

    calculateRollingResistance(
        mass,
        coefficient = 0.015
    ) {
        return mass * CONFIG.gravity * coefficient;
    },

    calculateTotalResistance(
        velocity,
        vehicle,
        frontalArea = 2.2
    ) {
        const drag = this.calculateDrag(
            velocity,
            vehicle.dragCoefficient,
            frontalArea
        );

        const rolling =
            this.calculateRollingResistance(
                vehicle.mass
            );

        return drag + rolling;
    }
};

/* ============================================================
   BRAKE SYSTEM
   ============================================================ */

const BRAKE_SYSTEM = {

    calculateForce(
        input,
        mass,
        brakingPower,
        grip
    ) {
        const requested =
            input *
            mass *
            brakingPower *
            CONFIG.gravity;

        const maximum =
            mass *
            CONFIG.gravity *
            grip;

        return UTILS.clamp(
            requested,
            0,
            maximum
        );
    },

    calculateABS(
        wheelSlip,
        enabled = true
    ) {
        if (!enabled) return 1;

        const threshold = 0.20;

        if (wheelSlip > threshold) {
            return UTILS.clamp(
                1 - (wheelSlip - threshold) * 2,
                0.25,
                1
            );
        }

        return 1;
    },

    calculateStoppingDistance(speed, deceleration) {
        if (deceleration <= 0) {
            return Infinity;
        }

        return (
            speed * speed
        ) / (2 * deceleration);
    }
};

/* ============================================================
   DRIFT SYSTEM
   ============================================================ */

const DRIFT_SYSTEM = {

    calculateDriftFactor(
        speed,
        steering,
        handbrake,
        grip
    ) {
        const speedFactor =
            UTILS.clamp01(speed / 20);

        const steeringFactor =
            Math.abs(steering);

        const drift =
            speedFactor *
            steeringFactor *
            (0.5 + handbrake * 0.8);

        return UTILS.clamp01(
            drift * (1.2 - grip * 0.3)
        );
    },

    calculateDriftGrip(baseGrip, driftFactor) {
        return baseGrip * (
            1 - UTILS.clamp01(driftFactor) * 0.45
        );
    },

    calculateCounterSteering(
        velocityAngle,
        heading
    ) {
        let difference = velocityAngle - heading;

        while (difference > Math.PI) {
            difference -= Math.PI * 2;
        }

        while (difference < -Math.PI) {
            difference += Math.PI * 2;
        }

        return UTILS.clamp(
            -difference * 1.5,
            -1,
            1
        );
    }
};

/* ============================================================
   VEHICLE PERFORMANCE CALCULATOR
   ============================================================ */

const PERFORMANCE_SYSTEM = {

    calculate(vehicle) {
        const mass = vehicle.mass;
        const power = vehicle.power;

        const powerToWeight =
            power / (mass / 1000);

        const estimatedAcceleration =
            UTILS.clamp(
                powerToWeight / 35,
                1,
                12
            );

        const estimatedTopSpeed =
            Math.sqrt(
                (power * 745.7) /
                (
                    0.5 *
                    CONFIG.airDensity *
                    vehicle.dragCoefficient *
                    2.2
                )
            ) * 3.6;

        return {
            powerToWeight,
            estimatedAcceleration,
            estimatedTopSpeed: Math.min(
                estimatedTopSpeed,
                vehicle.maxSpeed
            ),
            brakingRating: vehicle.braking,
            handlingRating: vehicle.handling,
            gripRating: vehicle.grip
        };
    },

    compare(vehicleA, vehicleB) {
        const a = this.calculate(vehicleA);
        const b = this.calculate(vehicleB);

        return {
            powerToWeight:
                a.powerToWeight - b.powerToWeight,

            acceleration:
                a.estimatedAcceleration -
                b.estimatedAcceleration,

            topSpeed:
                a.estimatedTopSpeed -
                b.estimatedTopSpeed,

            handling:
                a.handlingRating -
                b.handlingRating
        };
    }
};

/* ============================================================
   PART 2 END
   NEXT: PART 3 - VEHICLE STATE / SUSPENSION / DAMAGE
   ============================================================ */

/* ============================================================
   GTQHI v5.0
   PART 3 - VEHICLE STATE / SUSPENSION / DAMAGE
   ============================================================ */

/* ============================================================
   VEHICLE DEFAULT PARAMETERS
   ============================================================ */

const VEHICLE_DEFAULTS = {
    mass: 1450,
    centerOfMass: {
        x: 0,
        y: 0.48,
        z: 0
    },

    weightDistribution: {
        front: 0.52,
        rear: 0.48
    },

    suspension: {
        stiffness: 32000,
        damping: 4200,
        travel: 0.22,
        restLength: 0.32,
        antiRoll: 8500
    },

    tires: {
        pressure: 2.3,
        temperature: 25,
        wear: 0,
        grip: 1
    },

    damage: {
        body: 0,
        engine: 0,
        transmission: 0,
        suspension: 0,
        tires: 0
    }
};

/* ============================================================
   WHEEL STATE SYSTEM
   ============================================================ */

const WHEEL_SYSTEM = {

    positions: [
        { x: -0.85, y: 0, z: 1.25, axle: "front", side: "left" },
        { x:  0.85, y: 0, z: 1.25, axle: "front", side: "right" },
        { x: -0.85, y: 0, z: -1.25, axle: "rear", side: "left" },
        { x:  0.85, y: 0, z: -1.25, axle: "rear", side: "right" }
    ],

    createWheel(index, vehicle) {
        const position = this.positions[index];

        return {
            index,
            position: { ...position },

            rotation: 0,
            steeringAngle: 0,

            angularVelocity: 0,
            linearVelocity: 0,

            suspensionLength:
                vehicle.suspension.restLength,

            suspensionVelocity: 0,

            normalLoad: vehicle.mass *
                CONFIG.gravity / 4,

            temperature: 25,
            pressure: 2.3,
            wear: 0,

            grip: vehicle.grip,

            slipRatio: 0,
            slipAngle: 0,

            damaged: false,
            punctured: false,

            brakeTemperature: 25,
            brakeWear: 0
        };
    },

    createAll(vehicle) {
        return [
            this.createWheel(0, vehicle),
            this.createWheel(1, vehicle),
            this.createWheel(2, vehicle),
            this.createWheel(3, vehicle)
        ];
    },

    calculateLoadTransfer(
        vehicle,
        acceleration,
        lateralAcceleration
    ) {
        const wheelbase = vehicle.wheelbase;

        const frontTransfer =
            vehicle.mass *
            acceleration *
            0.5 /
            Math.max(wheelbase, 0.1);

        const sideTransfer =
            vehicle.mass *
            lateralAcceleration *
            0.5 /
            Math.max(vehicle.width, 0.1);

        return {
            front: frontTransfer,
            side: sideTransfer
        };
    },

    updateWheelTemperature(wheel, speed, braking, dt) {
        const frictionHeat =
            Math.abs(speed) * 0.025 +
            braking * 0.8;

        const cooling =
            (wheel.temperature - 25) *
            0.025;

        wheel.temperature +=
            (frictionHeat - cooling) * dt;

        wheel.temperature = UTILS.clamp(
            wheel.temperature,
            15,
            180
        );
    },

    updateWear(wheel, slip, speed, dt) {
        const wearRate =
            Math.abs(slip) *
            Math.abs(speed) *
            0.0000008;

        wheel.wear = UTILS.clamp01(
            wheel.wear + wearRate * dt
        );

        if (wheel.wear >= 0.98) {
            wheel.damaged = true;
        }
    }
};

/* ============================================================
   SUSPENSION SYSTEM
   ============================================================ */

const SUSPENSION_SYSTEM = {

    calculateSpringForce(
        displacement,
        velocity,
        stiffness,
        damping
    ) {
        return (
            -displacement * stiffness -
            velocity * damping
        );
    },

    calculateCompression(
        wheel,
        roadHeight,
        chassisHeight,
        suspension
    ) {
        const desiredLength =
            chassisHeight -
            roadHeight;

        return UTILS.clamp(
            suspension.restLength - desiredLength,
            -suspension.travel,
            suspension.travel
        );
    },

    calculateDamping(
        velocity,
        damping,
        compression
    ) {
        const direction =
            compression >= 0 ? 1 : -1;

        return -velocity * damping * direction;
    },

    calculateAntiRoll(
        leftCompression,
        rightCompression,
        antiRoll
    ) {
        const difference =
            leftCompression - rightCompression;

        return difference * antiRoll;
    },

    update(
        wheel,
        compression,
        dt,
        suspension
    ) {
        const velocity =
            (compression - wheel.suspensionLength) /
            Math.max(dt, 0.0001);

        const springForce =
            this.calculateSpringForce(
                compression,
                velocity,
                suspension.stiffness,
                suspension.damping
            );

        wheel.suspensionVelocity = velocity;

        wheel.suspensionLength = UTILS.clamp(
            compression,
            -suspension.travel,
            suspension.travel
        );

        return {
            springForce,
            compression,
            velocity
        };
    }
};

/* ============================================================
   WEIGHT DISTRIBUTION
   ============================================================ */

const WEIGHT_SYSTEM = {

    calculateStaticLoad(vehicle) {
        const total =
            vehicle.mass * CONFIG.gravity;

        const front =
            total *
            vehicle.weightDistribution.front;

        const rear =
            total *
            vehicle.weightDistribution.rear;

        return {
            frontTotal: front,
            rearTotal: rear,
            frontEach: front / 2,
            rearEach: rear / 2
        };
    },

    calculateDynamicLoad(
        vehicle,
        acceleration,
        lateralAcceleration
    ) {
        const staticLoad =
            this.calculateStaticLoad(vehicle);

        const transfer =
            WHEEL_SYSTEM.calculateLoadTransfer(
                vehicle,
                acceleration,
                lateralAcceleration
            );

        return {
            frontLeft:
                staticLoad.frontEach -
                transfer.front / 2 +
                transfer.side / 2,

            frontRight:
                staticLoad.frontEach -
                transfer.front / 2 -
                transfer.side / 2,

            rearLeft:
                staticLoad.rearEach +
                transfer.front / 2 +
                transfer.side / 2,

            rearRight:
                staticLoad.rearEach +
                transfer.front / 2 -
                transfer.side / 2
        };
    }
};

/* ============================================================
   DAMAGE SYSTEM
   ============================================================ */

const DAMAGE_SYSTEM = {

    create() {
        return {
            body: 0,
            engine: 0,
            transmission: 0,
            suspension: 0,
            tires: 0,

            impactCount: 0,
            lastImpact: 0,

            repairCost: 0
        };
    },

    calculateImpact(
        mass,
        relativeVelocity
    ) {
        const energy =
            0.5 *
            mass *
            relativeVelocity *
            relativeVelocity;

        return energy;
    },

    applyImpact(vehicle, impactEnergy, location) {
        if (!CONFIG.damageEnabled) return;

        const damageAmount =
            UTILS.clamp(
                impactEnergy / 180000,
                0,
                0.65
            );

        const damage = vehicle.damage;

        damage.impactCount++;
        damage.lastImpact = impactEnergy;

        if (location === "front") {
            damage.body += damageAmount;
            damage.engine += damageAmount * 0.25;
        }

        else if (location === "rear") {
            damage.body += damageAmount;
            damage.transmission +=
                damageAmount * 0.20;
        }

        else if (location === "left" ||
                 location === "right") {
            damage.body += damageAmount * 0.8;
            damage.suspension +=
                damageAmount * 0.3;
        }

        else {
            damage.body += damageAmount;
        }

        this.clampDamage(damage);

        vehicle.health = this.calculateHealth(damage);
    },

    applyEngineDamage(vehicle, amount) {
        vehicle.damage.engine += amount;
        this.clampDamage(vehicle.damage);
        vehicle.health =
            this.calculateHealth(vehicle.damage);
    },

    applyTireDamage(vehicle, wheelIndex, amount) {
        const wheel = vehicle.wheels[wheelIndex];

        if (!wheel) return;

        wheel.wear = UTILS.clamp01(
            wheel.wear + amount
        );

        if (wheel.wear >= 0.95) {
            wheel.damaged = true;
        }

        vehicle.damage.tires += amount;
        this.clampDamage(vehicle.damage);
    },

    clampDamage(damage) {
        for (const key of [
            "body",
            "engine",
            "transmission",
            "suspension",
            "tires"
        ]) {
            damage[key] = UTILS.clamp01(
                damage[key]
            );
        }
    },

    calculateHealth(damage) {
        const average =
            (
                damage.body +
                damage.engine +
                damage.transmission +
                damage.suspension +
                damage.tires
            ) / 5;

        return UTILS.clamp01(1 - average);
    },

    calculateEngineEfficiency(vehicle) {
        return UTILS.clamp(
            1 - vehicle.damage.engine * 0.75,
            0.15,
            1
        );
    },

    calculateHandlingEfficiency(vehicle) {
        return UTILS.clamp(
            1 - vehicle.damage.suspension * 0.65,
            0.2,
            1
        );
    },

    calculateTransmissionEfficiency(vehicle) {
        return UTILS.clamp(
            1 - vehicle.damage.transmission * 0.7,
            0.2,
            1
        );
    },

    calculateRepairCost(vehicle) {
        const damage = vehicle.damage;

        return Math.round(
            damage.body * 800 +
            damage.engine * 2500 +
            damage.transmission * 1800 +
            damage.suspension * 1500 +
            damage.tires * 700
        );
    },

    repair(vehicle) {
        vehicle.damage = this.create();

        vehicle.health = 1;

        vehicle.wheels.forEach(wheel => {
            wheel.damaged = false;
            wheel.punctured = false;
            wheel.wear = 0;
            wheel.temperature = 25;
            wheel.brakeWear = 0;
        });

        return true;
    }
};

/* ============================================================
   VEHICLE STATE FACTORY
   ============================================================ */

const VEHICLE_STATE_SYSTEM = {

    create(spec) {
        const vehicle = {
            id: UTILS.createId(),

            name: spec.name,
            manufacturer: spec.manufacturer,
            type: spec.type,

            mass: spec.mass,
            power: spec.power,
            torque: spec.torque,

            maxSpeed: spec.maxSpeed,
            acceleration: spec.acceleration,
            braking: spec.braking,
            handling: spec.handling,
            grip: spec.grip,

            wheelbase: spec.wheelbase,
            width: spec.width,
            length: spec.length,
            height: spec.height,

            dragCoefficient: spec.dragCoefficient,

            color: spec.color,

            health: 1,

            position: {
                x: 0,
                y: 0,
                z: 0
            },

            velocity: {
                x: 0,
                y: 0,
                z: 0
            },

            accelerationVector: {
                x: 0,
                y: 0,
                z: 0
            },

            heading: 0,

            angularVelocity: 0,

            steering: 0,
            throttle: 0,
            brake: 0,
            handbrake: 0,

            speed: 0,

            engineRPM: CONFIG.idleRPM,

            engineRunning: true,

            gear: TRANSMISSION_SYSTEM.create(),

            wheels: [],

            suspension: {
                ...VEHICLE_DEFAULTS.suspension
            },

            weightDistribution: {
                ...VEHICLE_DEFAULTS.weightDistribution
            },

            damage: DAMAGE_SYSTEM.create(),

            driftFactor: 0,

            fuel: 100,

            odometer: 0,

            lap: 0,

            isGrounded: true,

            isDestroyed: false,

            createdAt: Date.now()
        };

        vehicle.wheels =
            WHEEL_SYSTEM.createAll(vehicle);

        return vehicle;
    },

    reset(vehicle) {
        vehicle.position.x = 0;
        vehicle.position.y = 0;
        vehicle.position.z = 0;

        vehicle.velocity.x = 0;
        vehicle.velocity.y = 0;
        vehicle.velocity.z = 0;

        vehicle.heading = 0;

        vehicle.angularVelocity = 0;

        vehicle.steering = 0;
        vehicle.throttle = 0;
        vehicle.brake = 0;
        vehicle.handbrake = 0;

        vehicle.speed = 0;

        vehicle.engineRPM = CONFIG.idleRPM;

        vehicle.driftFactor = 0;

        vehicle.gear.gear = 1;

        vehicle.isGrounded = true;

        return vehicle;
    }
};

/* ============================================================
   VEHICLE CONDITION SYSTEM
   ============================================================ */

const CONDITION_SYSTEM = {

    getCondition(vehicle) {
        const health =
            vehicle.health * 100;

        if (health >= 95) return "Excellent";
        if (health >= 80) return "Good";
        if (health >= 60) return "Normal";
        if (health >= 35) return "Damaged";
        if (health >= 15) return "Critical";

        return "Destroyed";
    },

    getConditionJapanese(vehicle) {
        const condition =
            this.getCondition(vehicle);

        const labels = {
            Excellent: "新品同様",
            Good: "良好",
            Normal: "通常",
            Damaged: "損傷",
            Critical: "危険",
            Destroyed: "大破"
        };

        return labels[condition];
    },

    getSummary(vehicle) {
        return {
            name: vehicle.name,
            health: Math.round(
                vehicle.health * 100
            ),

            condition:
                this.getConditionJapanese(vehicle),

            engineEfficiency:
                DAMAGE_SYSTEM.calculateEngineEfficiency(
                    vehicle
                ),

            handlingEfficiency:
                DAMAGE_SYSTEM.calculateHandlingEfficiency(
                    vehicle
                ),

            transmissionEfficiency:
                DAMAGE_SYSTEM.calculateTransmissionEfficiency(
                    vehicle
                ),

            repairCost:
                DAMAGE_SYSTEM.calculateRepairCost(
                    vehicle
                )
        };
    }
};

/* ============================================================
   PART 3 END
   NEXT: PART 4 - VEHICLE DYNAMICS / DRIVING PHYSICS
   ============================================================ */

/* ============================================================
   GTQHI v5.0
   PART 4 - ADVANCED DRIVING PHYSICS
   ============================================================ */

/* ============================================================
   TRANSMISSION PATCH
   Reverse gear correction
   ============================================================ */

TRANSMISSION_SYSTEM.getRatio = function(transmission) {
    if (transmission.gear === 0) return 0;

    if (transmission.gear === -1) {
        return this.defaultRatios[0];
    }

    return transmission.ratios[
        transmission.gear
    ] || 0;
};

/* ============================================================
   VEHICLE INPUT SYSTEM
   ============================================================ */

const INPUT_SYSTEM = {

    create() {
        return {
            throttle: 0,
            brake: 0,
            steering: 0,
            handbrake: 0,

            shiftUp: false,
            shiftDown: false,

            reverse: false,
            neutral: false
        };
    },

    setThrottle(input, value) {
        input.throttle =
            UTILS.clamp(value, 0, 1);
    },

    setBrake(input, value) {
        input.brake =
            UTILS.clamp(value, 0, 1);
    },

    setSteering(input, value) {
        input.steering =
            UTILS.clamp(value, -1, 1);
    },

    setHandbrake(input, value) {
        input.handbrake =
            UTILS.clamp(value, 0, 1);
    },

    clear(input) {
        input.throttle = 0;
        input.brake = 0;
        input.steering = 0;
        input.handbrake = 0;
        input.shiftUp = false;
        input.shiftDown = false;
        input.reverse = false;
        input.neutral = false;
    }
};

/* ============================================================
   VEHICLE DYNAMICS
   ============================================================ */

const VEHICLE_DYNAMICS = {

    calculateForwardVector(heading) {
        return {
            x: Math.sin(heading),
            z: Math.cos(heading)
        };
    },

    calculateRightVector(heading) {
        return {
            x: Math.cos(heading),
            z: -Math.sin(heading)
        };
    },

    calculateLocalVelocity(vehicle) {
        const forward =
            this.calculateForwardVector(
                vehicle.heading
            );

        const right =
            this.calculateRightVector(
                vehicle.heading
            );

        return {
            forward:
                vehicle.velocity.x * forward.x +
                vehicle.velocity.z * forward.z,

            lateral:
                vehicle.velocity.x * right.x +
                vehicle.velocity.z * right.z
        };
    },

    calculateWorldVelocity(
        heading,
        forwardSpeed,
        lateralSpeed
    ) {
        const forward =
            this.calculateForwardVector(heading);

        const right =
            this.calculateRightVector(heading);

        return {
            x:
                forward.x * forwardSpeed +
                right.x * lateralSpeed,

            z:
                forward.z * forwardSpeed +
                right.z * lateralSpeed
        };
    },

    calculateYawRate(
        vehicle,
        forwardSpeed,
        steering,
        grip
    ) {
        const wheelbase =
            Math.max(vehicle.wheelbase, 0.5);

        const maxSteeringAngle =
            UTILS.degToRad(34);

        const steeringAngle =
            steering * maxSteeringAngle;

        const speedFactor =
            UTILS.clamp(
                1 - Math.abs(forwardSpeed) / 180,
                0.35,
                1
            );

        return (
            forwardSpeed *
            Math.tan(steeringAngle) /
            wheelbase
        ) * speedFactor * grip;
    },

    calculateLateralAcceleration(
        forwardSpeed,
        yawRate
    ) {
        return forwardSpeed * yawRate;
    }
};

/* ============================================================
   ENGINE FORCE SYSTEM
   ============================================================ */

const ENGINE_FORCE_SYSTEM = {

    calculate(vehicle, transmission) {
        const ratio =
            TRANSMISSION_SYSTEM.getRatio(
                transmission
            );

        if (ratio === 0) return 0;

        const engineEfficiency =
            DAMAGE_SYSTEM.calculateEngineEfficiency(
                vehicle
            );

        const torque =
            ENGINE_SYSTEM.calculateTorque(
                vehicle.engineRPM,
                vehicle.power,
                vehicle.torque
            );

        const force =
            ENGINE_SYSTEM.calculateEngineForce(
                torque * engineEfficiency,
                Math.abs(ratio),
                transmission.finalDrive,
                CONFIG.transmissionEfficiency,
                CONFIG.defaultWheelRadius
            );

        return Math.sign(ratio) * force;
    },

    calculateThrottleForce(
        vehicle,
        throttle,
        transmission
    ) {
        const engineForce =
            this.calculate(
                vehicle,
                transmission
            );

        return engineForce * throttle;
    }
};

/* ============================================================
   RESISTANCE SYSTEM
   ============================================================ */

const RESISTANCE_SYSTEM = {

    calculate(vehicle, speed) {
        const aerodynamic =
            AERODYNAMIC_SYSTEM.calculateDrag(
                speed,
                vehicle.dragCoefficient,
                vehicle.width * vehicle.height * 0.82
            );

        const rolling =
            AERODYNAMIC_SYSTEM.calculateRollingResistance(
                vehicle.mass
            );

        const direction =
            speed === 0 ? 0 : Math.sign(speed);

        return {
            aerodynamic:
                aerodynamic,

            rolling:
                rolling * direction,

            total:
                aerodynamic +
                rolling * direction
        };
    }
};

/* ============================================================
   STEERING SYSTEM
   ============================================================ */

const STEERING_SYSTEM = {

    update(vehicle, input, dt) {
        const target =
            UTILS.clamp(
                input.steering,
                -1,
                1
            );

        const steeringSpeed = 3.5;

        vehicle.steering =
            UTILS.approach(
                vehicle.steering,
                target,
                steeringSpeed,
                dt
            );

        const frontAngle =
            vehicle.steering *
            UTILS.degToRad(34);

        vehicle.wheels[0].steeringAngle =
            frontAngle;

        vehicle.wheels[1].steeringAngle =
            frontAngle;

        vehicle.wheels[2].steeringAngle = 0;
        vehicle.wheels[3].steeringAngle = 0;
    }
};

/* ============================================================
   DRIFT PHYSICS
   ============================================================ */

const DRIFT_PHYSICS = {

    update(vehicle, localVelocity, input, dt) {
        const speed =
            Math.abs(localVelocity.forward);

        const driftFactor =
            DRIFT_SYSTEM.calculateDriftFactor(
                speed,
                vehicle.steering,
                input.handbrake,
                vehicle.grip
            );

        vehicle.driftFactor =
            UTILS.lerp(
                vehicle.driftFactor,
                driftFactor,
                UTILS.clamp01(dt * 4)
            );

        const normalGrip =
            vehicle.grip *
            DAMAGE_SYSTEM.calculateHandlingEfficiency(
                vehicle
            );

        const effectiveGrip =
            DRIFT_SYSTEM.calculateDriftGrip(
                normalGrip,
                vehicle.driftFactor
            );

        const lateralRetention =
            UTILS.clamp(
                1 - effectiveGrip * dt * 2.2,
                0,
                1
            );

        let lateralSpeed =
            localVelocity.lateral *
            lateralRetention;

        if (input.handbrake > 0) {
            lateralSpeed *=
                1 - input.handbrake * dt * 0.35;
        }

        return {
            lateralSpeed,
            effectiveGrip,
            driftFactor: vehicle.driftFactor
        };
    }
};

/* ============================================================
   BRAKING PHYSICS
   ============================================================ */

const BRAKING_PHYSICS = {

    update(vehicle, input, forwardSpeed, dt) {
        const braking =
            UTILS.clamp(input.brake, 0, 1);

        const handbrake =
            UTILS.clamp(input.handbrake, 0, 1);

        const grip =
            vehicle.grip *
            DAMAGE_SYSTEM.calculateHandlingEfficiency(
                vehicle
            );

        const normalForce =
            BRAKE_SYSTEM.calculateForce(
                braking,
                vehicle.mass,
                vehicle.braking,
                grip
            );

        const handbrakeForce =
            handbrake *
            vehicle.mass *
            CONFIG.gravity *
            0.8;

        const totalForce =
            normalForce + handbrakeForce;

        const deceleration =
            totalForce / vehicle.mass;

        if (Math.abs(forwardSpeed) < 0.15) {
            return 0;
        }

        return (
            -Math.sign(forwardSpeed) *
            deceleration *
            dt
        );
    }
};

/* ============================================================
   AUTOMATIC GEAR CONTROL
   ============================================================ */

const GEAR_CONTROL_SYSTEM = {

    update(vehicle, input, dt) {
        const transmission = vehicle.gear;

        if (input.neutral) {
            TRANSMISSION_SYSTEM.neutral(
                transmission
            );
        }

        if (input.reverse) {
            if (Math.abs(vehicle.speed) < 1) {
                TRANSMISSION_SYSTEM.reverse(
                    transmission
                );
            }
        }

        if (
            !input.reverse &&
            transmission.gear === -1 &&
            Math.abs(vehicle.speed) < 1
        ) {
            transmission.gear = 1;
        }

        if (input.shiftUp) {
            TRANSMISSION_SYSTEM.shiftUp(
                transmission
            );
        }

        if (input.shiftDown) {
            TRANSMISSION_SYSTEM.shiftDown(
                transmission
            );
        }

        const ratio =
            Math.abs(
                TRANSMISSION_SYSTEM.getRatio(
                    transmission
                )
            );

        const local =
            VEHICLE_DYNAMICS.calculateLocalVelocity(
                vehicle
            );

        const calculatedRPM =
            ENGINE_SYSTEM.calculateRPM(
                Math.abs(local.forward),
                transmission.gear === -1
                    ? 1
                    : transmission.gear,
                transmission.ratios,
                transmission.finalDrive,
                CONFIG.defaultWheelRadius
            );

        vehicle.engineRPM =
            UTILS.lerp(
                vehicle.engineRPM,
                Math.max(
                    CONFIG.idleRPM,
                    calculatedRPM
                ),
                UTILS.clamp01(dt * 5)
            );

        TRANSMISSION_SYSTEM.updateAutomatic(
            transmission,
            vehicle.engineRPM,
            dt
        );
    }
};

/* ============================================================
   FOUR WHEEL UPDATE
   ============================================================ */

const FOUR_WHEEL_PHYSICS = {

    update(vehicle, dt) {
        const local =
            VEHICLE_DYNAMICS.calculateLocalVelocity(
                vehicle
            );

        vehicle.wheels.forEach((wheel, index) => {
            const isFront = index < 2;

            const wheelSpeed =
                local.forward;

            wheel.linearVelocity =
                wheelSpeed;

            wheel.angularVelocity =
                wheelSpeed /
                CONFIG.defaultWheelRadius;

            wheel.rotation +=
                wheel.angularVelocity * dt;

            const braking =
                isFront
                    ? vehicle.brake
                    : vehicle.brake +
                      vehicle.handbrake * 0.5;

            WHEEL_SYSTEM.updateWheelTemperature(
                wheel,
                wheelSpeed,
                braking,
                dt
            );

            WHEEL_SYSTEM.updateWear(
                wheel,
                wheel.slipRatio,
                wheelSpeed,
                dt
            );

            const baseGrip =
                TIRE_SYSTEM.calculateGrip(
                    vehicle.grip,
                    1,
                    wheel.temperature,
                    wheel.wear,
                    0
                );

            wheel.grip = wheel.damaged
                ? baseGrip * 0.25
                : baseGrip;
        });
    }
};

/* ============================================================
   MAIN DRIVING PHYSICS
   ============================================================ */

const DRIVING_PHYSICS = {

    update(vehicle, input, dt) {
        if (!vehicle || vehicle.isDestroyed) {
            return vehicle;
        }

        dt = UTILS.clamp(dt, 0, 0.05);

        vehicle.throttle =
            UTILS.clamp(input.throttle, 0, 1);

        vehicle.brake =
            UTILS.clamp(input.brake, 0, 1);

        vehicle.handbrake =
            UTILS.clamp(input.handbrake, 0, 1);

        STEERING_SYSTEM.update(
            vehicle,
            input,
            dt
        );

        GEAR_CONTROL_SYSTEM.update(
            vehicle,
            input,
            dt
        );

        let local =
            VEHICLE_DYNAMICS.calculateLocalVelocity(
                vehicle
            );

        const engineForce =
            ENGINE_FORCE_SYSTEM.calculateThrottleForce(
                vehicle,
                vehicle.throttle,
                vehicle.gear
            );

        const resistance =
            RESISTANCE_SYSTEM.calculate(
                vehicle,
                local.forward
            );

        const brakeDelta =
            BRAKING_PHYSICS.update(
                vehicle,
                input,
                local.forward,
                dt
            );

        const totalForce =
            engineForce -
            resistance.total;

        const acceleration =
            totalForce /
            vehicle.mass;

        let forwardSpeed =
            local.forward +
            acceleration * dt +
            brakeDelta;

        const maxSpeed =
            UTILS.kmhToMs(
                vehicle.maxSpeed
            );

        forwardSpeed =
            UTILS.clamp(
                forwardSpeed,
                -maxSpeed * 0.25,
                maxSpeed
            );

        if (
            vehicle.throttle === 0 &&
            vehicle.brake === 0 &&
            Math.abs(forwardSpeed) < 0.08
        ) {
            forwardSpeed = 0;
        }

        local =
            VEHICLE_DYNAMICS.calculateLocalVelocity(
                vehicle
            );

        const drift =
            DRIFT_PHYSICS.update(
                vehicle,
                local,
                input,
                dt
            );

        const yawGrip =
            UTILS.clamp(
                drift.effectiveGrip,
                0.2,
                1.3
            );

        const yawRate =
            VEHICLE_DYNAMICS.calculateYawRate(
                vehicle,
                forwardSpeed,
                vehicle.steering,
                yawGrip
            );

        vehicle.angularVelocity =
            UTILS.lerp(
                vehicle.angularVelocity,
                yawRate,
                UTILS.clamp01(dt * 5)
            );

        vehicle.heading +=
            vehicle.angularVelocity * dt;

        const worldVelocity =
            VEHICLE_DYNAMICS.calculateWorldVelocity(
                vehicle.heading,
                forwardSpeed,
                drift.lateralSpeed
            );

        vehicle.velocity.x =
            worldVelocity.x;

        vehicle.velocity.z =
            worldVelocity.z;

        vehicle.position.x +=
            vehicle.velocity.x * dt;

        vehicle.position.z +=
            vehicle.velocity.z * dt;

        vehicle.accelerationVector.x =
            acceleration *
            Math.sin(vehicle.heading);

        vehicle.accelerationVector.z =
            acceleration *
            Math.cos(vehicle.heading);

        vehicle.speed =
            UTILS.msToKmh(
                Math.abs(forwardSpeed)
            );

        vehicle.odometer +=
            Math.abs(forwardSpeed) * dt;

        FOUR_WHEEL_PHYSICS.update(
            vehicle,
            dt
        );

        if (vehicle.health <= 0.02) {
            vehicle.isDestroyed = true;
        }

        return vehicle;
    }
};

/* ============================================================
   VEHICLE UPDATE WRAPPER
   ============================================================ */

const VEHICLE_UPDATE_SYSTEM = {

    update(vehicle, input, dt) {
        return DRIVING_PHYSICS.update(
            vehicle,
            input,
            dt
        );
    },

    updateMultiple(vehicles, inputs, dt) {
        vehicles.forEach((vehicle, index) => {
            const input =
                inputs[index] || INPUT_SYSTEM.create();

            this.update(vehicle, input, dt);
        });

        return vehicles;
    }
};

/* ============================================================
   PART 4 END
   NEXT: PART 5 - COLLISION / CRASH / DAMAGE PHYSICS
   ============================================================ */

/* ============================================================
   GTQHI v5.0
   PART 5 - COLLISION / CRASH ENGINE
   ============================================================ */

/* ============================================================
   COLLISION CONFIG
   ============================================================ */

const COLLISION_CONFIG = {
    enabled: true,

    defaultRestitution: 0.25,
    minimumImpactSpeed: 1.5,

    separationStrength: 0.8,
    positionCorrection: 0.65,

    maximumDamage: 100,
    damageMultiplier: 0.035,

    wallRestitution: 0.18,
    vehicleRestitution: 0.28,

    collisionCooldown: 0.12
};

/* ============================================================
   COLLISION GEOMETRY
   ============================================================ */

const COLLISION_GEOMETRY = {

    getRadius(vehicle) {
        const width =
            vehicle.width || 2;

        const length =
            vehicle.length || 4;

        return Math.sqrt(
            width * width +
            length * length
        ) * 0.5;
    },

    getDistance(a, b) {
        const dx =
            b.position.x - a.position.x;

        const dz =
            b.position.z - a.position.z;

        return Math.sqrt(
            dx * dx + dz * dz
        );
    },

    getNormal(a, b) {
        const dx =
            b.position.x - a.position.x;

        const dz =
            b.position.z - a.position.z;

        const length =
            Math.sqrt(dx * dx + dz * dz);

        if (length < 0.0001) {
            return {
                x: 1,
                z: 0
            };
        }

        return {
            x: dx / length,
            z: dz / length
        };
    },

    checkCircleCollision(a, b) {
        const distance =
            this.getDistance(a, b);

        const radiusA =
            this.getRadius(a);

        const radiusB =
            this.getRadius(b);

        const penetration =
            radiusA + radiusB - distance;

        if (penetration <= 0) {
            return null;
        }

        return {
            normal: this.getNormal(a, b),
            penetration,
            distance,
            radiusA,
            radiusB
        };
    }
};

/* ============================================================
   RELATIVE VELOCITY
   ============================================================ */

const RELATIVE_VELOCITY_SYSTEM = {

    calculate(a, b) {
        return {
            x:
                b.velocity.x -
                a.velocity.x,

            z:
                b.velocity.z -
                a.velocity.z
        };
    },

    calculateNormalSpeed(a, b, normal) {
        const relative =
            this.calculate(a, b);

        return (
            relative.x * normal.x +
            relative.z * normal.z
        );
    },

    calculateImpactSpeed(a, b, normal) {
        return Math.max(
            0,
            -this.calculateNormalSpeed(
                a,
                b,
                normal
            )
        );
    }
};

/* ============================================================
   MASS SYSTEM
   ============================================================ */

const COLLISION_MASS_SYSTEM = {

    getInverseMass(vehicle) {
        const mass =
            Math.max(vehicle.mass || 1000, 1);

        return 1 / mass;
    },

    calculateCombinedInverseMass(a, b) {
        return (
            this.getInverseMass(a) +
            this.getInverseMass(b)
        );
    }
};

/* ============================================================
   COLLISION IMPULSE
   ============================================================ */

const COLLISION_IMPULSE_SYSTEM = {

    calculate(a, b, normal, restitution) {
        const relative =
            RELATIVE_VELOCITY_SYSTEM.calculate(
                a,
                b
            );

        const velocityAlongNormal =
            relative.x * normal.x +
            relative.z * normal.z;

        if (velocityAlongNormal > 0) {
            return 0;
        }

        const inverseMass =
            COLLISION_MASS_SYSTEM
                .calculateCombinedInverseMass(
                    a,
                    b
                );

        if (inverseMass <= 0) {
            return 0;
        }

        return (
            -(1 + restitution) *
            velocityAlongNormal /
            inverseMass
        );
    },

    apply(a, b, normal, impulse) {
        if (impulse <= 0) return;

        const inverseA =
            COLLISION_MASS_SYSTEM.getInverseMass(a);

        const inverseB =
            COLLISION_MASS_SYSTEM.getInverseMass(b);

        a.velocity.x -=
            normal.x * impulse * inverseA;

        a.velocity.z -=
            normal.z * impulse * inverseA;

        b.velocity.x +=
            normal.x * impulse * inverseB;

        b.velocity.z +=
            normal.z * impulse * inverseB;
    }
};

/* ============================================================
   POSITION CORRECTION
   ============================================================ */

const COLLISION_CORRECTION_SYSTEM = {

    separate(a, b, normal, penetration) {
        const inverseA =
            COLLISION_MASS_SYSTEM.getInverseMass(a);

        const inverseB =
            COLLISION_MASS_SYSTEM.getInverseMass(b);

        const total =
            inverseA + inverseB;

        if (total <= 0) return;

        const correction =
            Math.max(
                penetration - 0.02,
                0
            ) *
            COLLISION_CONFIG.positionCorrection /
            total;

        a.position.x -=
            normal.x * correction * inverseA;

        a.position.z -=
            normal.z * correction * inverseA;

        b.position.x +=
            normal.x * correction * inverseB;

        b.position.z +=
            normal.z * correction * inverseB;
    }
};

/* ============================================================
   CRASH DAMAGE
   ============================================================ */

const CRASH_DAMAGE_SYSTEM = {

    calculateDamage(impactSpeed, mass) {
        if (
            impactSpeed <
            COLLISION_CONFIG.minimumImpactSpeed
        ) {
            return 0;
        }

        const energy =
            0.5 *
            mass *
            impactSpeed *
            impactSpeed;

        const damage =
            energy *
            COLLISION_CONFIG.damageMultiplier /
            100000;

        return UTILS.clamp(
            damage,
            0,
            COLLISION_CONFIG.maximumDamage
        );
    },

    apply(vehicle, damage, impactSpeed) {
        if (!vehicle || damage <= 0) {
            return;
        }

        if (
            typeof DAMAGE_SYSTEM !== "undefined" &&
            typeof DAMAGE_SYSTEM.applyImpact === "function"
        ) {
            DAMAGE_SYSTEM.applyImpact(
                vehicle,
                damage
            );
        }

        vehicle.lastImpactSpeed =
            impactSpeed;

        vehicle.lastDamage =
            damage;

        vehicle.crashCount =
            (vehicle.crashCount || 0) + 1;
    },

    applyVehicleCollision(a, b, impactSpeed) {
        const damageA =
            this.calculateDamage(
                impactSpeed,
                b.mass || 1000
            );

        const damageB =
            this.calculateDamage(
                impactSpeed,
                a.mass || 1000
            );

        this.apply(a, damageA, impactSpeed);
        this.apply(b, damageB, impactSpeed);

        return {
            damageA,
            damageB
        };
    }
};

/* ============================================================
   COLLISION EVENT SYSTEM
   ============================================================ */

const COLLISION_EVENT_SYSTEM = {

    events: [],

    create(type, a, b, impactSpeed, damage) {
        return {
            id: UTILS.createId(),
            type,
            vehicleA: a ? a.id : null,
            vehicleB: b ? b.id : null,
            impactSpeed,
            damage,
            timestamp: Date.now()
        };
    },

    emit(event) {
        this.events.push(event);

        if (this.events.length > 200) {
            this.events.shift();
        }

        return event;
    },

    getRecent(count = 20) {
        return this.events.slice(-count);
    },

    clear() {
        this.events.length = 0;
    }
};

/* ============================================================
   VEHICLE COLLISION SYSTEM
   ============================================================ */

const VEHICLE_COLLISION_SYSTEM = {

    check(a, b) {
        if (!a || !b || a === b) {
            return null;
        }

        if (
            a.isDestroyed &&
            b.isDestroyed
        ) {
            return null;
        }

        return COLLISION_GEOMETRY
            .checkCircleCollision(a, b);
    },

    resolve(a, b, collision) {
        if (!collision) return null;

        const normal =
            collision.normal;

        const impactSpeed =
            RELATIVE_VELOCITY_SYSTEM
                .calculateImpactSpeed(
                    a,
                    b,
                    normal
                );

        COLLISION_CORRECTION_SYSTEM.separate(
            a,
            b,
            normal,
            collision.penetration
        );

        const impulse =
            COLLISION_IMPULSE_SYSTEM.calculate(
                a,
                b,
                normal,
                COLLISION_CONFIG.vehicleRestitution
            );

        COLLISION_IMPULSE_SYSTEM.apply(
            a,
            b,
            normal,
            impulse
        );

        const damage =
            CRASH_DAMAGE_SYSTEM
                .applyVehicleCollision(
                    a,
                    b,
                    impactSpeed
                );

        const event =
            COLLISION_EVENT_SYSTEM.create(
                "vehicle",
                a,
                b,
                impactSpeed,
                damage
            );

        COLLISION_EVENT_SYSTEM.emit(event);

        return {
            impactSpeed,
            impulse,
            damage,
            event
        };
    }
};

/* ============================================================
   WALL COLLISION SYSTEM
   ============================================================ */

const WALL_COLLISION_SYSTEM = {

    resolve(vehicle, bounds) {
        if (!vehicle || !bounds) {
            return [];
        }

        const events = [];

        const radius =
            COLLISION_GEOMETRY.getRadius(vehicle);

        const walls = [
            {
                name: "left",
                hit: vehicle.position.x - radius < bounds.minX,
                normal: { x: 1, z: 0 }
            },
            {
                name: "right",
                hit: vehicle.position.x + radius > bounds.maxX,
                normal: { x: -1, z: 0 }
            },
            {
                name: "top",
                hit: vehicle.position.z - radius < bounds.minZ,
                normal: { x: 0, z: 1 }
            },
            {
                name: "bottom",
                hit: vehicle.position.z + radius > bounds.maxZ,
                normal: { x: 0, z: -1 }
            }
        ];

        walls.forEach(wall => {
            if (!wall.hit) return;

            const normal = wall.normal;

            const speed = Math.max(
                0,
                -(
                    vehicle.velocity.x * normal.x +
                    vehicle.velocity.z * normal.z
                )
            );

            if (wall.name === "left") {
                vehicle.position.x =
                    bounds.minX + radius;
            }

            if (wall.name === "right") {
                vehicle.position.x =
                    bounds.maxX - radius;
            }

            if (wall.name === "top") {
                vehicle.position.z =
                    bounds.minZ + radius;
            }

            if (wall.name === "bottom") {
                vehicle.position.z =
                    bounds.maxZ - radius;
            }

            const normalSpeed =
                vehicle.velocity.x * normal.x +
                vehicle.velocity.z * normal.z;

            if (normalSpeed < 0) {
                const impulse =
                    -(1 + COLLISION_CONFIG.wallRestitution) *
                    normalSpeed;

                vehicle.velocity.x +=
                    normal.x * impulse;

                vehicle.velocity.z +=
                    normal.z * impulse;
            }

            const damage =
                CRASH_DAMAGE_SYSTEM.calculateDamage(
                    speed,
                    vehicle.mass || 1000
                );

            CRASH_DAMAGE_SYSTEM.apply(
                vehicle,
                damage,
                speed
            );

            const event =
                COLLISION_EVENT_SYSTEM.create(
                    "wall",
                    vehicle,
                    null,
                    speed,
                    damage
                );

            COLLISION_EVENT_SYSTEM.emit(event);

            events.push(event);
        });

        return events;
    }
};

/* ============================================================
   COLLISION MANAGER
   ============================================================ */

const COLLISION_MANAGER = {

    enabled: true,

    updateVehicles(vehicles) {
        if (!this.enabled) return [];

        const results = [];

        for (
            let i = 0;
            i < vehicles.length;
            i++
        ) {
            for (
                let j = i + 1;
                j < vehicles.length;
                j++
            ) {
                const a = vehicles[i];
                const b = vehicles[j];

                const collision =
                    VEHICLE_COLLISION_SYSTEM.check(
                        a,
                        b
                    );

                if (!collision) continue;

                const result =
                    VEHICLE_COLLISION_SYSTEM.resolve(
                        a,
                        b,
                        collision
                    );

                if (result) {
                    results.push(result);
                }
            }
        }

        return results;
    },

    updateWalls(vehicles, bounds) {
        if (!this.enabled) return [];

        const results = [];

        vehicles.forEach(vehicle => {
            const events =
                WALL_COLLISION_SYSTEM.resolve(
                    vehicle,
                    bounds
                );

            results.push(...events);
        });

        return results;
    },

    setEnabled(value) {
        this.enabled = Boolean(value);
    }
};

/* ============================================================
   PART 5 END
   NEXT: PART 6 - NPC AI / TRAFFIC SYSTEM
   ============================================================ */

/* ============================================================
   GTQHI v5.0
   PART 6 - NPC AI / TRAFFIC SYSTEM
   ============================================================ */

/* ============================================================
   NPC AI CONFIG
   ============================================================ */

const NPC_AI_CONFIG = {
    enabled: true,

    defaultSpeed: 18,
    minimumSpeed: 4,
    maximumSpeed: 42,

    acceleration: 12,
    braking: 22,
    steeringStrength: 8,

    detectionDistance: 28,
    safeDistance: 9,

    laneChangeCooldown: 3,
    laneChangeDuration: 1.5,

    playerDetectionDistance: 45,
    playerFollowDistance: 12,

    avoidanceStrength: 1.5,
    collisionAvoidance: true,

    trafficEnabled: true,
    followEnabled: true,
    laneChangeEnabled: true
};

/* ============================================================
   NPC AI UTILITIES
   ============================================================ */

const NPC_AI_UTILS = {

    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    },

    distance(a, b) {
        const dx = b.position.x - a.position.x;
        const dz = b.position.z - a.position.z;

        return Math.sqrt(dx * dx + dz * dz);
    },

    normalize(x, z) {
        const length = Math.sqrt(x * x + z * z);

        if (length < 0.0001) {
            return { x: 0, z: 1 };
        }

        return {
            x: x / length,
            z: z / length
        };
    },

    getForward(vehicle) {
        const speed = Math.sqrt(
            vehicle.velocity.x ** 2 +
            vehicle.velocity.z ** 2
        );

        if (speed > 0.5) {
            return this.normalize(
                vehicle.velocity.x,
                vehicle.velocity.z
            );
        }

        const angle = vehicle.rotation?.y || 0;

        return {
            x: Math.sin(angle),
            z: Math.cos(angle)
        };
    },

    getRight(vehicle) {
        const forward = this.getForward(vehicle);

        return {
            x: forward.z,
            z: -forward.x
        };
    }
};

/* ============================================================
   NPC AI INITIALIZER
   ============================================================ */

const NPC_AI_INITIALIZER = {

    initialize(vehicle, options = {}) {
        if (!vehicle) return null;

        vehicle.isNPC = true;
        vehicle.aiEnabled = true;

        vehicle.ai = {
            mode: options.mode || "traffic",

            targetSpeed:
                options.speed ||
                NPC_AI_CONFIG.defaultSpeed,

            currentLane:
                options.lane || 0,

            targetLane:
                options.lane || 0,

            laneChangeTimer: 0,
            laneChangeProgress: 0,

            targetPosition: null,

            reactionTime: 0.25,

            state: "driving",

            playerTarget: null,

            lastSteering: 0,
            lastAcceleration: 0,

            stuckTimer: 0,

            enabled: true
        };

        return vehicle.ai;
    }
};

/* ============================================================
   NPC PERCEPTION SYSTEM
   ============================================================ */

const NPC_PERCEPTION_SYSTEM = {

    getNearbyVehicles(npc, vehicles, maxDistance) {
        return vehicles.filter(vehicle => {
            if (!vehicle || vehicle === npc) {
                return false;
            }

            return (
                NPC_AI_UTILS.distance(npc, vehicle) <=
                maxDistance
            );
        });
    },

    getFrontVehicle(npc, vehicles) {
        const forward =
            NPC_AI_UTILS.getForward(npc);

        let closest = null;
        let closestDistance =
            NPC_AI_CONFIG.detectionDistance;

        vehicles.forEach(vehicle => {
            if (!vehicle || vehicle === npc) return;

            const dx =
                vehicle.position.x - npc.position.x;

            const dz =
                vehicle.position.z - npc.position.z;

            const distance =
                Math.sqrt(dx * dx + dz * dz);

            if (distance <= 0.001) return;

            const direction =
                NPC_AI_UTILS.normalize(dx, dz);

            const dot =
                direction.x * forward.x +
                direction.z * forward.z;

            if (dot < 0.65) return;

            if (distance < closestDistance) {
                closest = vehicle;
                closestDistance = distance;
            }
        });

        return closest
            ? {
                vehicle: closest,
                distance: closestDistance
            }
            : null;
    },

    getPlayer(npc, player) {
        if (!player || !player.position) {
            return null;
        }

        const distance =
            NPC_AI_UTILS.distance(npc, player);

        if (
            distance >
            NPC_AI_CONFIG.playerDetectionDistance
        ) {
            return null;
        }

        return {
            vehicle: player,
            distance
        };
    }
};

/* ============================================================
   NPC STEERING SYSTEM
   ============================================================ */

const NPC_STEERING_SYSTEM = {

    calculate(npc, targetX, targetZ) {
        const desired =
            NPC_AI_UTILS.normalize(
                targetX,
                targetZ
            );

        const forward =
            NPC_AI_UTILS.getForward(npc);

        const cross =
            forward.x * desired.z -
            forward.z * desired.x;

        return NPC_AI_UTILS.clamp(
            cross * NPC_AI_CONFIG.steeringStrength,
            -1,
            1
        );
    },

    apply(npc, steering, dt) {
        if (!npc.velocity) return;

        const forward =
            NPC_AI_UTILS.getForward(npc);

        const right =
            NPC_AI_UTILS.getRight(npc);

        const steeringForce =
            steering *
            NPC_AI_CONFIG.acceleration *
            dt;

        npc.velocity.x +=
            right.x * steeringForce;

        npc.velocity.z +=
            right.z * steeringForce;

        if (npc.rotation) {
            npc.rotation.y +=
                steering *
                NPC_AI_CONFIG.steeringStrength *
                dt * 0.08;
        }
    }
};

/* ============================================================
   NPC SPEED CONTROL
   ============================================================ */

const NPC_SPEED_SYSTEM = {

    getSpeed(vehicle) {
        return Math.sqrt(
            vehicle.velocity.x ** 2 +
            vehicle.velocity.z ** 2
        );
    },

    accelerate(npc, targetSpeed, dt) {
        const speed = this.getSpeed(npc);

        const difference =
            targetSpeed - speed;

        const force =
            difference > 0
                ? NPC_AI_CONFIG.acceleration
                : NPC_AI_CONFIG.braking;

        const change =
            NPC_AI_UTILS.clamp(
                difference,
                -force * dt,
                force * dt
            );

        if (speed < 0.001) {
            const forward =
                NPC_AI_UTILS.getForward(npc);

            npc.velocity.x =
                forward.x * Math.max(0, change);

            npc.velocity.z =
                forward.z * Math.max(0, change);

            return;
        }

        const scale =
            NPC_AI_UTILS.clamp(
                (speed + change) / speed,
                0,
                1.5
            );

        npc.velocity.x *= scale;
        npc.velocity.z *= scale;
    },

    brake(npc, dt) {
        const speed = this.getSpeed(npc);

        if (speed < 0.1) {
            npc.velocity.x = 0;
            npc.velocity.z = 0;
            return;
        }

        const newSpeed = Math.max(
            0,
            speed - NPC_AI_CONFIG.braking * dt
        );

        const scale = newSpeed / speed;

        npc.velocity.x *= scale;
        npc.velocity.z *= scale;
    }
};

/* ============================================================
   TRAFFIC FOLLOW SYSTEM
   ============================================================ */

const NPC_TRAFFIC_FOLLOW_SYSTEM = {

    update(npc, vehicles, dt) {
        const front =
            NPC_PERCEPTION_SYSTEM.getFrontVehicle(
                npc,
                vehicles
            );

        let targetSpeed =
            npc.ai.targetSpeed;

        if (front) {
            const frontSpeed =
                NPC_SPEED_SYSTEM.getSpeed(
                    front.vehicle
                );

            if (
                front.distance <
                NPC_AI_CONFIG.safeDistance
            ) {
                targetSpeed = Math.min(
                    targetSpeed,
                    frontSpeed * 0.65
                );

                npc.ai.state = "braking";
            } else if (
                front.distance <
                NPC_AI_CONFIG.detectionDistance
            ) {
                targetSpeed = Math.min(
                    targetSpeed,
                    frontSpeed + 2
                );

                npc.ai.state = "following";
            }
        }

        NPC_SPEED_SYSTEM.accelerate(
            npc,
            targetSpeed,
            dt
        );

        return {
            frontVehicle: front?.vehicle || null,
            targetSpeed
        };
    }
};

/* ============================================================
   LANE CHANGE SYSTEM
   ============================================================ */

const NPC_LANE_CHANGE_SYSTEM = {

    update(npc, vehicles, dt, laneWidth = 4) {
        if (!NPC_AI_CONFIG.laneChangeEnabled) {
            return;
        }

        const ai = npc.ai;

        ai.laneChangeTimer = Math.max(
            0,
            ai.laneChangeTimer - dt
        );

        const front =
            NPC_PERCEPTION_SYSTEM.getFrontVehicle(
                npc,
                vehicles
            );

        if (
            front &&
            front.distance < 13 &&
            ai.laneChangeTimer <= 0
        ) {
            const direction =
                Math.random() < 0.5 ? -1 : 1;

            const newLane =
                ai.currentLane + direction;

            if (
                this.isLaneSafe(
                    npc,
                    vehicles,
                    newLane,
                    laneWidth
                )
            ) {
                ai.targetLane = newLane;
                ai.laneChangeTimer =
                    NPC_AI_CONFIG.laneChangeCooldown;

                ai.laneChangeProgress = 0;
                ai.state = "changing_lane";
            }
        }

        if (ai.targetLane !== ai.currentLane) {
            ai.laneChangeProgress = Math.min(
                1,
                ai.laneChangeProgress +
                dt / NPC_AI_CONFIG.laneChangeDuration
            );

            if (ai.laneChangeProgress >= 1) {
                ai.currentLane = ai.targetLane;
                ai.state = "driving";
            }
        }
    },

    isLaneSafe(npc, vehicles, lane, laneWidth) {
        const right =
            NPC_AI_UTILS.getRight(npc);

        const currentLane =
            npc.ai.currentLane;

        const offset =
            (lane - currentLane) * laneWidth;

        const targetX =
            npc.position.x + right.x * offset;

        const targetZ =
            npc.position.z + right.z * offset;

        return !vehicles.some(vehicle => {
            if (!vehicle || vehicle === npc) {
                return false;
            }

            const dx =
                vehicle.position.x - targetX;

            const dz =
                vehicle.position.z - targetZ;

            return (
                Math.sqrt(dx * dx + dz * dz) <
                NPC_AI_CONFIG.safeDistance
            );
        });
    },

    getLaneTarget(npc, laneWidth = 4) {
        const right =
            NPC_AI_UTILS.getRight(npc);

        const ai = npc.ai;

        const lane =
            ai.currentLane +
            (ai.targetLane - ai.currentLane) *
            ai.laneChangeProgress;

        return {
            x: right.x * lane * laneWidth,
            z: right.z * lane * laneWidth
        };
    }
};

/* ============================================================
   PLAYER FOLLOW AI
   ============================================================ */

const NPC_PLAYER_FOLLOW_SYSTEM = {

    update(npc, player, dt) {
        if (!player) return false;

        const dx =
            player.position.x - npc.position.x;

        const dz =
            player.position.z - npc.position.z;

        const distance =
            Math.sqrt(dx * dx + dz * dz);

        if (distance > NPC_AI_CONFIG.playerDetectionDistance) {
            return false;
        }

        const forward =
            NPC_AI_UTILS.normalize(dx, dz);

        const desiredSpeed =
            distance >
            NPC_AI_CONFIG.playerFollowDistance
                ? npc.ai.targetSpeed
                : 0;

        if (distance > NPC_AI_CONFIG.playerFollowDistance) {
            NPC_STEERING_SYSTEM.apply(
                npc,
                NPC_STEERING_SYSTEM.calculate(
                    npc,
                    forward.x,
                    forward.z
                ),
                dt
            );

            NPC_SPEED_SYSTEM.accelerate(
                npc,
                desiredSpeed,
                dt
            );

            npc.ai.state = "following_player";
        } else {
            NPC_SPEED_SYSTEM.brake(npc, dt);
            npc.ai.state = "near_player";
        }

        return true;
    }
};

/* ============================================================
   NPC AVOIDANCE SYSTEM
   ============================================================ */

const NPC_AVOIDANCE_SYSTEM = {

    update(npc, vehicles, dt) {
        if (!NPC_AI_CONFIG.collisionAvoidance) {
            return;
        }

        const nearby =
            NPC_PERCEPTION_SYSTEM.getNearbyVehicles(
                npc,
                vehicles,
                NPC_AI_CONFIG.safeDistance
            );

        if (nearby.length === 0) return;

        const right =
            NPC_AI_UTILS.getRight(npc);

        let force = 0;

        nearby.forEach(vehicle => {
            const dx =
                vehicle.position.x - npc.position.x;

            const dz =
                vehicle.position.z - npc.position.z;

            const side =
                dx * right.x + dz * right.z;

            force +=
                side > 0 ? -1 : 1;
        });

        force = NPC_AI_UTILS.clamp(
            force * NPC_AI_CONFIG.avoidanceStrength,
            -1,
            1
        );

        NPC_STEERING_SYSTEM.apply(
            npc,
            force,
            dt
        );
    }
};

/* ============================================================
   NPC MAIN AI
   ============================================================ */

const NPC_AI_SYSTEM = {

    update(npc, context, dt) {
        if (
            !NPC_AI_CONFIG.enabled ||
            !npc ||
            !npc.ai ||
            !npc.ai.enabled ||
            !npc.position ||
            !npc.velocity
        ) {
            return null;
        }

        dt = NPC_AI_UTILS.clamp(
            Number(dt) || 0,
            0,
            0.05
        );

        if (dt <= 0) return null;

        const vehicles =
            context.vehicles || [];

        const mode =
            npc.ai.mode;

        if (mode === "parked") {
            NPC_SPEED_SYSTEM.brake(npc, dt);
            npc.ai.state = "parked";
            return npc.ai.state;
        }

        if (
            mode === "follow_player" &&
            context.player &&
            NPC_PLAYER_FOLLOW_SYSTEM.update(
                npc,
                context.player,
                dt
            )
        ) {
            NPC_AVOIDANCE_SYSTEM.update(
                npc,
                vehicles,
                dt
            );

            return npc.ai.state;
        }

        if (
            mode === "aggressive" &&
            context.player
        ) {
            NPC_PLAYER_FOLLOW_SYSTEM.update(
                npc,
                context.player,
                dt
            );

            NPC_AVOIDANCE_SYSTEM.update(
                npc,
                vehicles,
                dt
            );

            return npc.ai.state;
        }

        if (NPC_AI_CONFIG.laneChangeEnabled) {
            NPC_LANE_CHANGE_SYSTEM.update(
                npc,
                vehicles,
                dt,
                context.laneWidth || 4
            );
        }

        const laneTarget =
            NPC_LANE_CHANGE_SYSTEM.getLaneTarget(
                npc,
                context.laneWidth || 4
            );

        NPC_STEERING_SYSTEM.apply(
            npc,
            NPC_STEERING_SYSTEM.calculate(
                npc,
                laneTarget.x,
                laneTarget.z
            ),
            dt
        );

        if (NPC_AI_CONFIG.trafficEnabled) {
            NPC_TRAFFIC_FOLLOW_SYSTEM.update(
                npc,
                vehicles,
                dt
            );
        } else {
            NPC_SPEED_SYSTEM.accelerate(
                npc,
                npc.ai.targetSpeed,
                dt
            );
        }

        NPC_AVOIDANCE_SYSTEM.update(
            npc,
            vehicles,
            dt
        );

        const speed =
            NPC_SPEED_SYSTEM.getSpeed(npc);

        if (speed < 0.5) {
            npc.ai.stuckTimer += dt;
        } else {
            npc.ai.stuckTimer = 0;
        }

        if (npc.ai.stuckTimer > 5) {
            npc.ai.state = "stuck";
        }

        return npc.ai.state;
    },

    setMode(npc, mode) {
        if (!npc || !npc.ai) return;

        const allowed = [
            "traffic",
            "follow_player",
            "aggressive",
            "parked"
        ];

        if (allowed.includes(mode)) {
            npc.ai.mode = mode;
        }
    },

    setSpeed(npc, speed) {
        if (!npc || !npc.ai) return;

        npc.ai.targetSpeed =
            NPC_AI_UTILS.clamp(
                speed,
                NPC_AI_CONFIG.minimumSpeed,
                NPC_AI_CONFIG.maximumSpeed
            );
    },

    setEnabled(npc, enabled) {
        if (!npc || !npc.ai) return;

        npc.ai.enabled = Boolean(enabled);
    }
};

/* ============================================================
   TRAFFIC MANAGER
   ============================================================ */

const TRAFFIC_MANAGER = {

    enabled: true,

    update(vehicles, player, dt, options = {}) {
        if (!this.enabled) return [];

        const results = [];

        const context = {
            vehicles,
            player,
            laneWidth: options.laneWidth || 4
        };

        vehicles.forEach(npc => {
            if (
                !npc ||
                !npc.isNPC ||
                !npc.ai
            ) {
                return;
            }

            const state =
                NPC_AI_SYSTEM.update(
                    npc,
                    context,
                    dt
                );

            results.push({
                vehicleId: npc.id,
                state,
                speed:
                    NPC_SPEED_SYSTEM.getSpeed(npc),
                mode: npc.ai.mode
            });
        });

        return results;
    },

    register(vehicle, options = {}) {
        return NPC_AI_INITIALIZER.initialize(
            vehicle,
            options
        );
    },

    setEnabled(value) {
        this.enabled = Boolean(value);
    },

    getNPCs(vehicles) {
        return vehicles.filter(vehicle =>
            vehicle &&
            vehicle.isNPC &&
            vehicle.ai
        );
    }
};

/* ============================================================
   NPC AI DEBUG SYSTEM
   ============================================================ */

const NPC_AI_DEBUG = {

    getStatus(vehicle) {
        if (!vehicle || !vehicle.ai) {
            return null;
        }

        return {
            id: vehicle.id,
            mode: vehicle.ai.mode,
            state: vehicle.ai.state,
            speed:
                NPC_SPEED_SYSTEM.getSpeed(vehicle),
            targetSpeed: vehicle.ai.targetSpeed,
            lane: vehicle.ai.currentLane,
            targetLane: vehicle.ai.targetLane,
            enabled: vehicle.ai.enabled
        };
    },

    getAll(vehicles) {
        return TRAFFIC_MANAGER
            .getNPCs(vehicles)
            .map(vehicle =>
                this.getStatus(vehicle)
            );
    }
};

/* ============================================================
   PART 6 END
   NEXT: PART 7 - VEHICLE DAMAGE / REPAIR SYSTEM
   ============================================================ */

/* ============================================================
   GTQHI v5.0
   PART 7 - VEHICLE DAMAGE / REPAIR SYSTEM
   ============================================================ */

/* ============================================================
   DAMAGE CONFIG
   ============================================================ */

const DAMAGE_CONFIG = {
    enabled: true,

    maximumHealth: 100,
    minimumHealth: 0,

    impactScale: 100,

    engineDamageThreshold: 35,
    criticalDamageThreshold: 70,
    destroyedThreshold: 100,

    repairAmount: 25,
    repairDuration: 3,

    enginePowerMinimum: 0.25,
    maximumSpeedMinimum: 0.30,

    damageRecoveryEnabled: false,
    repairEnabled: true
};

/* ============================================================
   DAMAGE UTILITIES
   ============================================================ */

const DAMAGE_UTILS = {

    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    },

    getHealth(vehicle) {
        return vehicle.damageData
            ? vehicle.damageData.health
            : DAMAGE_CONFIG.maximumHealth;
    },

    getPercentage(vehicle) {
        return this.getHealth(vehicle) /
            DAMAGE_CONFIG.maximumHealth * 100;
    }
};

/* ============================================================
   VEHICLE DAMAGE INITIALIZER
   ============================================================ */

const DAMAGE_INITIALIZER = {

    initialize(vehicle, options = {}) {
        if (!vehicle) return null;

        vehicle.damageData = {
            health: options.health ?? 100,
            maximumHealth: options.maximumHealth ?? 100,

            engineHealth: 100,
            bodyHealth: 100,
            suspensionHealth: 100,

            totalDamage: 0,
            impactCount: 0,

            isDamaged: false,
            isCritical: false,
            isDestroyed: false,

            repairProgress: 0,
            repairing: false,

            lastDamage: 0,
            lastImpactTime: 0
        };

        return vehicle.damageData;
    }
};

/* ============================================================
   DAMAGE CALCULATOR
   ============================================================ */

const DAMAGE_CALCULATOR = {

    calculateImpact(impactDamage) {
        return Math.max(
            0,
            Number(impactDamage) || 0
        ) * DAMAGE_CONFIG.impactScale;
    },

    calculateEngineDamage(damage) {
        return damage * 0.65;
    },

    calculateBodyDamage(damage) {
        return damage * 0.85;
    },

    calculateSuspensionDamage(damage) {
        return damage * 0.35;
    }
};

/* ============================================================
   VEHICLE DAMAGE SYSTEM
   ============================================================ */

const DAMAGE_SYSTEM = {

    initialize(vehicle, options = {}) {
        return DAMAGE_INITIALIZER.initialize(
            vehicle,
            options
        );
    },

    ensure(vehicle) {
        if (!vehicle) return null;

        if (!vehicle.damageData) {
            this.initialize(vehicle);
        }

        return vehicle.damageData;
    },

    applyImpact(vehicle, impactDamage) {
        if (
            !DAMAGE_CONFIG.enabled ||
            !vehicle
        ) {
            return null;
        }

        const data = this.ensure(vehicle);

        if (
            !data ||
            data.isDestroyed ||
            data.repairing
        ) {
            return null;
        }

        const damage =
            DAMAGE_CALCULATOR.calculateImpact(
                impactDamage
            );

        if (damage <= 0) return null;

        data.health = DAMAGE_UTILS.clamp(
            data.health - damage,
            0,
            data.maximumHealth
        );

        data.engineHealth = DAMAGE_UTILS.clamp(
            data.engineHealth -
            DAMAGE_CALCULATOR.calculateEngineDamage(damage),
            0,
            100
        );

        data.bodyHealth = DAMAGE_UTILS.clamp(
            data.bodyHealth -
            DAMAGE_CALCULATOR.calculateBodyDamage(damage),
            0,
            100
        );

        data.suspensionHealth = DAMAGE_UTILS.clamp(
            data.suspensionHealth -
            DAMAGE_CALCULATOR.calculateSuspensionDamage(damage),
            0,
            100
        );

        data.totalDamage += damage;
        data.impactCount++;

        data.lastDamage = damage;
        data.lastImpactTime = Date.now();

        data.isDamaged = data.health < 100;

        data.isCritical =
            data.health <=
            DAMAGE_CONFIG.criticalDamageThreshold;

        data.isDestroyed =
            data.health <=
            DAMAGE_CONFIG.minimumHealth;

        vehicle.isDestroyed = data.isDestroyed;

        this.updatePerformance(vehicle);

        return {
            damage,
            health: data.health,
            engineHealth: data.engineHealth,
            destroyed: data.isDestroyed
        };
    },

    updatePerformance(vehicle) {
        const data = this.ensure(vehicle);

        if (!data) return null;

        const engineRatio =
            data.engineHealth / 100;

        const suspensionRatio =
            data.suspensionHealth / 100;

        const healthRatio =
            data.health / data.maximumHealth;

        data.enginePower = DAMAGE_UTILS.clamp(
            engineRatio,
            DAMAGE_CONFIG.enginePowerMinimum,
            1
        );

        data.speedMultiplier = DAMAGE_UTILS.clamp(
            engineRatio * (0.75 + suspensionRatio * 0.25),
            DAMAGE_CONFIG.maximumSpeedMinimum,
            1
        );

        data.handlingMultiplier = DAMAGE_UTILS.clamp(
            suspensionRatio,
            0.35,
            1
        );

        data.damageLevel =
            healthRatio > 0.7
                ? "good"
                : healthRatio > 0.35
                    ? "damaged"
                    : healthRatio > 0
                        ? "critical"
                        : "destroyed";

        return data;
    },

    getPerformance(vehicle) {
        const data = this.ensure(vehicle);

        if (!data) return null;

        this.updatePerformance(vehicle);

        return {
            enginePower: data.enginePower,
            speedMultiplier: data.speedMultiplier,
            handlingMultiplier: data.handlingMultiplier,
            damageLevel: data.damageLevel
        };
    },

    getSpeedLimit(vehicle, originalMaximum) {
        const performance =
            this.getPerformance(vehicle);

        if (!performance) {
            return originalMaximum;
        }

        return originalMaximum *
            performance.speedMultiplier;
    },

    getAcceleration(vehicle, originalAcceleration) {
        const performance =
            this.getPerformance(vehicle);

        if (!performance) {
            return originalAcceleration;
        }

        return originalAcceleration *
            performance.enginePower;
    },

    getHandling(vehicle, originalHandling) {
        const performance =
            this.getPerformance(vehicle);

        if (!performance) {
            return originalHandling;
        }

        return originalHandling *
            performance.handlingMultiplier;
    },

    getStatus(vehicle) {
        const data = this.ensure(vehicle);

        if (!data) return null;

        this.updatePerformance(vehicle);

        return {
            health: data.health,
            maximumHealth: data.maximumHealth,

            engineHealth: data.engineHealth,
            bodyHealth: data.bodyHealth,
            suspensionHealth: data.suspensionHealth,

            totalDamage: data.totalDamage,
            impactCount: data.impactCount,

            damageLevel: data.damageLevel,
            isDamaged: data.isDamaged,
            isCritical: data.isCritical,
            isDestroyed: data.isDestroyed
        };
    }
};

/* ============================================================
   VEHICLE REPAIR SYSTEM
   ============================================================ */

const VEHICLE_REPAIR_SYSTEM = {

    repair(vehicle, amount = 25) {
        if (!vehicle) return false;

        if (!DAMAGE_CONFIG.repairEnabled) {
            return false;
        }

        const data = DAMAGE_SYSTEM.ensure(vehicle);

        if (!data || data.repairing) {
            return false;
        }

        data.health = DAMAGE_UTILS.clamp(
            data.health + amount,
            0,
            data.maximumHealth
        );

        data.engineHealth = DAMAGE_UTILS.clamp(
            data.engineHealth + amount * 0.8,
            0,
            100
        );

        data.bodyHealth = DAMAGE_UTILS.clamp(
            data.bodyHealth + amount,
            0,
            100
        );

        data.suspensionHealth = DAMAGE_UTILS.clamp(
            data.suspensionHealth + amount * 0.7,
            0,
            100
        );

        data.isDestroyed = data.health <= 0;
        data.isCritical = data.health <= 35;
        data.isDamaged = data.health < 100;

        vehicle.isDestroyed = data.isDestroyed;

        DAMAGE_SYSTEM.updatePerformance(vehicle);

        return true;
    },

    fullRepair(vehicle) {
        if (!vehicle) return false;

        const data = DAMAGE_SYSTEM.ensure(vehicle);

        if (!data) return false;

        data.health = data.maximumHealth;
        data.engineHealth = 100;
        data.bodyHealth = 100;
        data.suspensionHealth = 100;

        data.isDamaged = false;
        data.isCritical = false;
        data.isDestroyed = false;

        data.repairing = false;
        data.repairProgress = 0;

        vehicle.isDestroyed = false;

        DAMAGE_SYSTEM.updatePerformance(vehicle);

        return true;
    },

    repairEngine(vehicle) {
        if (!vehicle) return false;

        const data = DAMAGE_SYSTEM.ensure(vehicle);

        if (!data) return false;

        data.engineHealth = 100;

        DAMAGE_SYSTEM.updatePerformance(vehicle);

        return true;
    },

    repairBody(vehicle) {
        if (!vehicle) return false;

        const data = DAMAGE_SYSTEM.ensure(vehicle);

        if (!data) return false;

        data.bodyHealth = 100;

        return true;
    },

    repairSuspension(vehicle) {
        if (!vehicle) return false;

        const data = DAMAGE_SYSTEM.ensure(vehicle);

        if (!data) return false;

        data.suspensionHealth = 100;

        DAMAGE_SYSTEM.updatePerformance(vehicle);

        return true;
    }
};

/* ============================================================
   REPAIR ANIMATION SYSTEM
   ============================================================ */

const REPAIR_ANIMATION_SYSTEM = {

    start(vehicle, duration = 3) {
        if (!vehicle) return false;

        const data = DAMAGE_SYSTEM.ensure(vehicle);

        if (
            !data ||
            data.repairing ||
            data.isDestroyed
        ) {
            return false;
        }

        data.repairing = true;
        data.repairProgress = 0;

        data.repairStartHealth = data.health;
        data.repairStartEngine = data.engineHealth;
        data.repairStartBody = data.bodyHealth;
        data.repairStartSuspension = data.suspensionHealth;

        data.repairDuration = Math.max(
            duration,
            0.1
        );

        return true;
    },

    update(vehicle, dt) {
        if (!vehicle || !vehicle.damageData) {
            return false;
        }

        const data = vehicle.damageData;

        if (!data.repairing) return false;

        data.repairProgress = Math.min(
            1,
            data.repairProgress +
            dt / data.repairDuration
        );

        const progress = data.repairProgress;

        data.health =
            data.repairStartHealth +
            (data.maximumHealth - data.repairStartHealth) *
            progress;

        data.engineHealth =
            data.repairStartEngine +
            (100 - data.repairStartEngine) *
            progress;

        data.bodyHealth =
            data.repairStartBody +
            (100 - data.repairStartBody) *
            progress;

        data.suspensionHealth =
            data.repairStartSuspension +
            (100 - data.repairStartSuspension) *
            progress;

        if (progress >= 1) {
            data.repairing = false;

            data.isDamaged = false;
            data.isCritical = false;
            data.isDestroyed = false;

            vehicle.isDestroyed = false;
        }

        DAMAGE_SYSTEM.updatePerformance(vehicle);

        return true;
    },

    cancel(vehicle) {
        if (!vehicle || !vehicle.damageData) {
            return false;
        }

        vehicle.damageData.repairing = false;
        return true;
    }
};

/* ============================================================
   DAMAGE RECOVERY SYSTEM
   ============================================================ */

const DAMAGE_RECOVERY_SYSTEM = {

    update(vehicle, dt) {
        if (
            !vehicle ||
            !DAMAGE_CONFIG.damageRecoveryEnabled
        ) {
            return;
        }

        const data = DAMAGE_SYSTEM.ensure(vehicle);

        if (!data || data.isDestroyed) return;

        const recovery = 0.5 * dt;

        data.health = Math.min(
            data.maximumHealth,
            data.health + recovery
        );

        DAMAGE_SYSTEM.updatePerformance(vehicle);
    }
};

/* ============================================================
   DAMAGE MANAGER
   ============================================================ */

const DAMAGE_MANAGER = {

    initializeVehicles(vehicles) {
        vehicles.forEach(vehicle => {
            if (vehicle && !vehicle.damageData) {
                DAMAGE_SYSTEM.initialize(vehicle);
            }
        });
    },

    update(vehicles, dt) {
        if (!DAMAGE_CONFIG.enabled) return [];

        const results = [];

        vehicles.forEach(vehicle => {
            if (!vehicle) return;

            REPAIR_ANIMATION_SYSTEM.update(
                vehicle,
                dt
            );

            DAMAGE_RECOVERY_SYSTEM.update(
                vehicle,
                dt
            );

            results.push(
                DAMAGE_SYSTEM.getStatus(vehicle)
            );
        });

        return results;
    },

    repairAll(vehicles) {
        vehicles.forEach(vehicle => {
            if (vehicle) {
                VEHICLE_REPAIR_SYSTEM.fullRepair(
                    vehicle
                );
            }
        });
    },

    getDamagedVehicles(vehicles) {
        return vehicles.filter(vehicle =>
            vehicle &&
            vehicle.damageData &&
            vehicle.damageData.isDamaged
        );
    },

    getDestroyedVehicles(vehicles) {
        return vehicles.filter(vehicle =>
            vehicle &&
            vehicle.damageData &&
            vehicle.damageData.isDestroyed
        );
    }
};

/* ============================================================
   PART 7 END
   NEXT: PART 8 - GARAGE / VEHICLE CUSTOMIZATION SYSTEM
   ============================================================ */

GARAGE_MANAGER.initialize(vehicles);

/* ============================================================
   GTQHI - PART 9
   GARAGE UI SYSTEM
   PART 8 の下に追加
============================================================ */

/* =========================
   1. UI CONFIG
========================= */

const GARAGE_UI_CONFIG = {
    title: "GTQHI GARAGE",

    accentColor: "#00d9ff",
    backgroundColor: "rgba(8, 13, 24, 0.97)",

    maxEngineLevel: 5,
    maxHandlingLevel: 5,
    maxBrakeLevel: 5,

    autoSave: true
};


/* =========================
   2. UI STATE
========================= */

const GARAGE_UI_DATA = {
    initialized: false,
    visible: false,
    root: null,
    selectedColor: 0xffffff,
    selectedWheel: "normal"
};


/* =========================
   3. UI UTILITIES
========================= */

const GARAGE_UI_UTILS = {

    element(tag, className, text) {
        const el = document.createElement(tag);

        if (className) {
            el.className = className;
        }

        if (text !== undefined) {
            el.textContent = text;
        }

        return el;
    },

    button(text, className, callback) {
        const button = this.element(
            "button",
            className,
            text
        );

        button.type = "button";
        button.addEventListener("click", callback);

        return button;
    },

    section(title) {
        const section = this.element("section", "gtqhi-section");

        const heading = this.element(
            "div",
            "gtqhi-section-title",
            title
        );

        section.appendChild(heading);

        return section;
    },

    notify(message) {
        const toast = document.getElementById(
            "gtqhi-garage-toast"
        );

        if (!toast) return;

        toast.textContent = message;
        toast.classList.add("show");

        clearTimeout(GARAGE_UI_DATA.toastTimer);

        GARAGE_UI_DATA.toastTimer = setTimeout(() => {
            toast.classList.remove("show");
        }, 2200);
    },

    formatNumber(value) {
        if (!Number.isFinite(Number(value))) {
            return "-";
        }

        return Number(value).toFixed(1);
    },

    getColorHex(color) {
        return "#" +
            Number(color).toString(16).padStart(6, "0");
    }
};


/* =========================
   4. CSS
========================= */

const GARAGE_UI_STYLE = `

#gtqhi-garage-root {
    position: fixed;
    inset: 0;
    z-index: 99990;
    display: none;
    color: white;
    font-family: Arial, sans-serif;
    pointer-events: none;
}

#gtqhi-garage-root.gtqhi-open {
    display: block;
}

#gtqhi-garage-panel {
    pointer-events: auto;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: min(920px, 94vw);
    max-height: 88vh;
    overflow-y: auto;
    background: ${GARAGE_UI_CONFIG.backgroundColor};
    border: 1px solid rgba(0,217,255,0.45);
    border-radius: 18px;
    box-shadow: 0 0 40px rgba(0,0,0,0.7);
    padding: 20px;
    box-sizing: border-box;
}

#gtqhi-garage-panel * {
    box-sizing: border-box;
}

.gtqhi-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    border-bottom: 1px solid rgba(255,255,255,0.15);
    padding-bottom: 14px;
    margin-bottom: 16px;
}

.gtqhi-title {
    font-size: 25px;
    font-weight: 900;
    letter-spacing: 2px;
    color: ${GARAGE_UI_CONFIG.accentColor};
}

.gtqhi-close {
    background: #a52c36 !important;
    min-width: 42px;
}

.gtqhi-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 16px;
}

.gtqhi-section {
    background: rgba(255,255,255,0.045);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 12px;
    padding: 13px;
    margin-bottom: 13px;
}

.gtqhi-section-title {
    font-size: 14px;
    font-weight: bold;
    color: ${GARAGE_UI_CONFIG.accentColor};
    margin-bottom: 12px;
    letter-spacing: 1px;
}

.gtqhi-button {
    color: white;
    background: #172a3c;
    border: 1px solid rgba(0,217,255,0.3);
    border-radius: 8px;
    padding: 10px 12px;
    font-size: 13px;
    font-weight: bold;
    cursor: pointer;
    transition: 0.15s;
}

.gtqhi-button:hover {
    background: #14506a;
    border-color: ${GARAGE_UI_CONFIG.accentColor};
}

.gtqhi-button:disabled {
    opacity: 0.35;
    cursor: not-allowed;
}

.gtqhi-button.selected {
    background: #006b83;
    border-color: #00eaff;
}

.gtqhi-car-list {
    display: grid;
    gap: 8px;
}

.gtqhi-car-button {
    text-align: left;
    width: 100%;
}

.gtqhi-color-list,
.gtqhi-wheel-list,
.gtqhi-upgrade-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.gtqhi-color-button {
    width: 35px;
    height: 35px;
    padding: 0;
    border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.35);
    cursor: pointer;
}

.gtqhi-color-button.selected {
    outline: 3px solid ${GARAGE_UI_CONFIG.accentColor};
    outline-offset: 3px;
}

.gtqhi-stats {
    display: grid;
    gap: 9px;
}

.gtqhi-stat {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    font-size: 13px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
    padding-bottom: 7px;
}

.gtqhi-stat-value {
    color: #00eaff;
    font-weight: bold;
    text-align: right;
}

.gtqhi-level {
    color: #ffd45c;
    font-weight: bold;
}

.gtqhi-save {
    background: #087a50;
    border-color: #19d994;
}

.gtqhi-repair {
    background: #8b5a13;
    border-color: #ffc04d;
}

#gtqhi-garage-open-button {
    position: fixed;
    right: 18px;
    bottom: 18px;
    z-index: 99989;
    pointer-events: auto;
    padding: 13px 18px;
    color: white;
    background: #06384a;
    border: 1px solid #00d9ff;
    border-radius: 12px;
    font-weight: bold;
    font-size: 14px;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(0,0,0,0.45);
}

#gtqhi-garage-toast {
    position: fixed;
    bottom: 75px;
    left: 50%;
    transform: translateX(-50%);
    background: #101d2b;
    border: 1px solid #00d9ff;
    color: white;
    border-radius: 10px;
    padding: 11px 18px;
    opacity: 0;
    transition: opacity 0.2s;
    pointer-events: none;
}

#gtqhi-garage-toast.show {
    opacity: 1;
}

@media (max-width: 650px) {
    #gtqhi-garage-panel {
        width: 96vw;
        max-height: 90vh;
        padding: 12px;
    }

    .gtqhi-layout {
        grid-template-columns: 1fr;
    }

    .gtqhi-title {
        font-size: 20px;
    }

    .gtqhi-button {
        padding: 10px;
    }
}

`;


/* =========================
   5. BUILD UI
========================= */

const GARAGE_UI_BUILDER = {

    create() {
        if (GARAGE_UI_DATA.root) {
            return GARAGE_UI_DATA.root;
        }

        const style = document.createElement("style");
        style.id = "gtqhi-garage-style";
        style.textContent = GARAGE_UI_STYLE;

        document.head.appendChild(style);

        const root = GARAGE_UI_UTILS.element(
            "div",
            "",
        );

        root.id = "gtqhi-garage-root";

        const panel = GARAGE_UI_UTILS.element(
            "div",
            ""
        );

        panel.id = "gtqhi-garage-panel";

        const header = GARAGE_UI_UTILS.element(
            "div",
            "gtqhi-header"
        );

        const title = GARAGE_UI_UTILS.element(
            "div",
            "gtqhi-title",
            GARAGE_UI_CONFIG.title
        );

        const close = GARAGE_UI_UTILS.button(
            "✕",
            "gtqhi-button gtqhi-close",
            () => GARAGE_UI_SYSTEM.close()
        );

        header.append(title, close);

        const layout = GARAGE_UI_UTILS.element(
            "div",
            "gtqhi-layout"
        );

        const left = GARAGE_UI_UTILS.element("div");
        const right = GARAGE_UI_UTILS.element("div");

        left.appendChild(this.createVehicleSection());
        left.appendChild(this.createColorSection());
        left.appendChild(this.createWheelSection());

        right.appendChild(this.createUpgradeSection());
        right.appendChild(this.createStatsSection());
        right.appendChild(this.createActionSection());

        layout.append(left, right);
        panel.append(header, layout);
        root.appendChild(panel);

        const toast = GARAGE_UI_UTILS.element("div");
        toast.id = "gtqhi-garage-toast";

        root.appendChild(toast);
        document.body.appendChild(root);

        const openButton = GARAGE_UI_UTILS.button(
            "🚗 GARAGE",
            "",
            () => GARAGE_UI_SYSTEM.toggle()
        );

        openButton.id = "gtqhi-garage-open-button";

        document.body.appendChild(openButton);

        GARAGE_UI_DATA.root = root;

        return root;
    },


    createVehicleSection() {
        const section = GARAGE_UI_UTILS.section(
            "🚘 VEHICLE SELECT"
        );

        const list = GARAGE_UI_UTILS.element(
            "div",
            "gtqhi-car-list"
        );

        list.id = "gtqhi-car-list";

        section.appendChild(list);

        return section;
    },


    createColorSection() {
        const section = GARAGE_UI_UTILS.section(
            "🎨 BODY COLOR"
        );

        const list = GARAGE_UI_UTILS.element(
            "div",
            "gtqhi-color-list"
        );

        list.id = "gtqhi-color-list";

        section.appendChild(list);

        return section;
    },


    createWheelSection() {
        const section = GARAGE_UI_UTILS.section(
            "🛞 WHEEL STYLE"
        );

        const list = GARAGE_UI_UTILS.element(
            "div",
            "gtqhi-wheel-list"
        );

        list.id = "gtqhi-wheel-list";

        section.appendChild(list);

        return section;
    },


    createUpgradeSection() {
        const section = GARAGE_UI_UTILS.section(
            "⚙️ PERFORMANCE UPGRADE"
        );

        const list = GARAGE_UI_UTILS.element(
            "div",
            "gtqhi-upgrade-list"
        );

        list.id = "gtqhi-upgrade-list";

        section.appendChild(list);

        return section;
    },


    createStatsSection() {
        const section = GARAGE_UI_UTILS.section(
            "📊 VEHICLE PERFORMANCE"
        );

        const stats = GARAGE_UI_UTILS.element(
            "div",
            "gtqhi-stats"
        );

        stats.id = "gtqhi-stats";

        section.appendChild(stats);

        return section;
    },


    createActionSection() {
        const section = GARAGE_UI_UTILS.section(
            "💾 GARAGE ACTIONS"
        );

        const save = GARAGE_UI_UTILS.button(
            "💾 SAVE CUSTOMIZATION",
            "gtqhi-button gtqhi-save",
            () => GARAGE_UI_SYSTEM.save()
        );

        const repair = GARAGE_UI_UTILS.button(
            "🔧 REPAIR VEHICLE",
            "gtqhi-button gtqhi-repair",
            () => GARAGE_UI_SYSTEM.repair()
        );

        section.append(save, repair);

        return section;
    }
};


/* =========================
   6. VEHICLE LIST RENDER
========================= */

const GARAGE_UI_VEHICLE_RENDERER = {

    render() {
        const list = document.getElementById(
            "gtqhi-car-list"
        );

        if (!list) return;

        list.replaceChildren();

        const vehicles = GARAGE_SELECTION_SYSTEM.getVehicleList();

        if (vehicles.length === 0) {
            list.appendChild(
                GARAGE_UI_UTILS.element(
                    "div",
                    "",
                    "車両が登録されていません。"
                )
            );

            return;
        }

        vehicles.forEach(vehicle => {
            const selected =
                vehicle.id === GARAGE_DATA.selectedVehicleId;

            const button = GARAGE_UI_UTILS.button(
                (selected ? "✓ " : "🚗 ") + vehicle.name,
                "gtqhi-button gtqhi-car-button" +
                    (selected ? " selected" : ""),
                () => GARAGE_UI_SYSTEM.selectVehicle(vehicle.id)
            );

            list.appendChild(button);
        });
    }
};


/* =========================
   7. COLOR RENDER
========================= */

const GARAGE_UI_COLOR_RENDERER = {

    render() {
        const list = document.getElementById(
            "gtqhi-color-list"
        );

        if (!list) return;

        list.replaceChildren();

        GARAGE_CONFIG.colors.forEach(color => {
            const button = GARAGE_UI_UTILS.element(
                "button",
                "gtqhi-color-button"
            );

            button.type = "button";
            button.title = color.name;
            button.style.background =
                GARAGE_UI_UTILS.getColorHex(color.value);

            if (
                GARAGE_UI_DATA.selectedColor === color.value
            ) {
                button.classList.add("selected");
            }

            button.addEventListener("click", () => {
                GARAGE_UI_SYSTEM.setColor(color.value);
            });

            list.appendChild(button);
        });
    }
};


/* =========================
   8. WHEEL RENDER
========================= */

const GARAGE_UI_WHEEL_RENDERER = {

    render() {
        const list = document.getElementById(
            "gtqhi-wheel-list"
        );

        if (!list) return;

        list.replaceChildren();

        const styles = [
            { id: "normal", name: "NORMAL" },
            { id: "sport", name: "SPORT" },
            { id: "racing", name: "RACING" }
        ];

        styles.forEach(style => {
            const selected =
                GARAGE_UI_DATA.selectedWheel === style.id;

            const button = GARAGE_UI_UTILS.button(
                style.name,
                "gtqhi-button" +
                    (selected ? " selected" : ""),
                () => GARAGE_UI_SYSTEM.setWheel(style.id)
            );

            list.appendChild(button);
        });
    }
};


/* =========================
   9. UPGRADE RENDER
========================= */

const GARAGE_UI_UPGRADE_RENDERER = {

    render() {
        const list = document.getElementById(
            "gtqhi-upgrade-list"
        );

        if (!list) return;

        list.replaceChildren();

        const id = GARAGE_DATA.selectedVehicleId;

        const data = GARAGE_DATA.customization[id];

        if (!data) return;

        const upgrades = [
            {
                name: "⚡ ENGINE",
                level: data.engineLevel,
                max: GARAGE_UI_CONFIG.maxEngineLevel,
                action: () => GTQHI_GARAGE.upgradeEngine()
            },
            {
                name: "🌀 HANDLING",
                level: data.handlingLevel,
                max: GARAGE_UI_CONFIG.maxHandlingLevel,
                action: () => GTQHI_GARAGE.upgradeHandling()
            },
            {
                name: "🛑 BRAKES",
                level: data.brakeLevel,
                max: GARAGE_UI_CONFIG.maxBrakeLevel,
                action: () => GTQHI_GARAGE.upgradeBrakes()
            }
        ];

        upgrades.forEach(upgrade => {
            const button = GARAGE_UI_UTILS.button(
                upgrade.name +
                "  Lv." + upgrade.level +
                "/" + upgrade.max,

                "gtqhi-button",

                () => {
                    if (upgrade.level >= upgrade.max) {
                        GARAGE_UI_UTILS.notify(
                            "最大レベルに到達しています！"
                        );
                        return;
                    }

                    const success = upgrade.action();

                    if (success) {
                        GARAGE_UI_UTILS.notify(
                            upgrade.name + " 強化成功！"
                        );

                        GARAGE_UI_SYSTEM.refresh();
                    } else {
                        GARAGE_UI_UTILS.notify(
                            "強化できませんでした。"
                        );
                    }
                }
            );

            button.disabled =
                upgrade.level >= upgrade.max;

            list.appendChild(button);
        });
    }
};


/* =========================
   10. STATS RENDER
========================= */

const GARAGE_UI_STATS_RENDERER = {

    render() {
        const container = document.getElementById(
            "gtqhi-stats"
        );

        if (!container) return;

        container.replaceChildren();

        const stats = GTQHI_GARAGE.stats();

        if (!stats) {
            container.textContent =
                "車両を選択してください。";

            return;
        }

        const rows = [
            ["車両", stats.name],
            ["最高速度", GARAGE_UI_UTILS.formatNumber(
                stats.maxSpeed
            )],
            ["加速性能", GARAGE_UI_UTILS.formatNumber(
                stats.acceleration
            )],
            ["操作性能", GARAGE_UI_UTILS.formatNumber(
                stats.handling
            )],
            ["ブレーキ性能", GARAGE_UI_UTILS.formatNumber(
                stats.braking
            )],
            ["エンジンLv", stats.engineLevel],
            ["ハンドリングLv", stats.handlingLevel],
            ["ブレーキLv", stats.brakeLevel]
        ];

        rows.forEach(([label, value]) => {
            const row = GARAGE_UI_UTILS.element(
                "div",
                "gtqhi-stat"
            );

            const name = GARAGE_UI_UTILS.element(
                "span",
                "",
                label
            );

            const result = GARAGE_UI_UTILS.element(
                "span",
                "gtqhi-stat-value",
                String(value)
            );

            row.append(name, result);
            container.appendChild(row);
        });
    }
};


/* =========================
   11. MAIN UI SYSTEM
========================= */

const GARAGE_UI_SYSTEM = {

    initialize() {
        if (GARAGE_UI_DATA.initialized) {
            this.refresh();
            return true;
        }

        if (
            typeof GTQHI_GARAGE === "undefined" ||
            typeof GARAGE_MANAGER === "undefined"
        ) {
            console.error(
                "PART 8 のガレージシステムが見つかりません。"
            );

            return false;
        }

        GARAGE_UI_BUILDER.create();

        GARAGE_UI_DATA.initialized = true;

        this.refresh();

        return true;
    },


    open() {
        if (!GARAGE_UI_DATA.initialized) {
            this.initialize();
        }

        if (!GARAGE_UI_DATA.root) return;

        GARAGE_UI_DATA.root.classList.add(
            "gtqhi-open"
        );

        GARAGE_UI_DATA.visible = true;

        this.refresh();
    },


    close() {
        if (!GARAGE_UI_DATA.root) return;

        GARAGE_UI_DATA.root.classList.remove(
            "gtqhi-open"
        );

        GARAGE_UI_DATA.visible = false;
    },


    toggle() {
        if (GARAGE_UI_DATA.visible) {
            this.close();
        } else {
            this.open();
        }
    },


    selectVehicle(id) {
        const success = GTQHI_GARAGE.select(id);

        if (!success) {
            GARAGE_UI_UTILS.notify(
                "車両を選択できませんでした。"
            );

            return false;
        }

        const data = GARAGE_DATA.customization[id];

        if (data) {
            GARAGE_UI_DATA.selectedColor = data.color;
            GARAGE_UI_DATA.selectedWheel = data.wheelStyle;
        }

        /*
         * ゲーム本体側へ車両変更を通知する。
         * ゲーム側でこのイベントを受け取って、
         * 実際のプレイヤー車両を切り替える。
         */

        window.dispatchEvent(
            new CustomEvent("gtqhi:garage-vehicle-selected", {
                detail: {
                    id,
                    vehicle: GARAGE_SELECTION_SYSTEM.getSelected()
                }
            })
        );

        this.refresh();

        GARAGE_UI_UTILS.notify(
            "車両を選択しました！"
        );

        return true;
    },


    setColor(color) {
        const success = GTQHI_GARAGE.paint(color);

        if (!success) {
            GARAGE_UI_UTILS.notify(
                "カラーを変更できませんでした。"
            );

            return false;
        }

        GARAGE_UI_DATA.selectedColor = color;

        if (GARAGE_UI_CONFIG.autoSave) {
            GTQHI_GARAGE.save();
        }

        this.refresh();

        GARAGE_UI_UTILS.notify(
            "ボディカラーを変更しました！"
        );

        return true;
    },


    setWheel(style) {
        const success = GTQHI_GARAGE.wheels(style);

        if (!success) {
            GARAGE_UI_UTILS.notify(
                "ホイールを変更できませんでした。"
            );

            return false;
        }

        GARAGE_UI_DATA.selectedWheel = style;

        if (GARAGE_UI_CONFIG.autoSave) {
            GTQHI_GARAGE.save();
        }

        this.refresh();

        GARAGE_UI_UTILS.notify(
            "ホイールを変更しました！"
        );

        return true;
    },


    save() {
        const success = GTQHI_GARAGE.save();

        GARAGE_UI_UTILS.notify(
            success
                ? "カスタマイズを保存しました！"
                : "保存に失敗しました。"
        );

        return success;
    },


    repair() {
        const success = GTQHI_GARAGE.repair();

        GARAGE_UI_UTILS.notify(
            success
                ? "車両を修理しました！"
                : "修理できませんでした。"
        );

        return success;
    },


    refresh() {
        if (!GARAGE_UI_DATA.root) return;

        const id = GARAGE_DATA.selectedVehicleId;
        const data = GARAGE_DATA.customization[id];

        if (data) {
            GARAGE_UI_DATA.selectedColor = data.color;
            GARAGE_UI_DATA.selectedWheel = data.wheelStyle;
        }

        GARAGE_UI_VEHICLE_RENDERER.render();
        GARAGE_UI_COLOR_RENDERER.render();
        GARAGE_UI_WHEEL_RENDERER.render();
        GARAGE_UI_UPGRADE_RENDERER.render();
        GARAGE_UI_STATS_RENDERER.render();
    }
};


/* =========================
   12. GAME EVENT SUPPORT
========================= */

window.addEventListener(
    "gtqhi:garage-vehicle-selected",
    (event) => {
        console.log(
            "GTQHI: ガレージ車両選択",
            event.detail
        );
    }
);


/* =========================
   13. STARTUP
========================= */

/*
 * PART 8 の GARAGE_MANAGER.initialize(vehicles)
 * が完了した後に実行すること。
 */

console.log("GTQHI PART 9: GARAGE UI SYSTEM READY");

/* ============================================================
   GTQHI - PART 10
   VEHICLE PHYSICS INTEGRATION
   PART 9 の下に追加

   Garage upgrades + Damage + Repair
   実際の走行性能に反映するための接続API
============================================================ */


/* =========================
   1. CONFIG
========================= */

const GTQHI_PHYSICS_CONFIG = {
    // ダメージによる性能低下の最大量
    maxEngineDamageLoss: 0.65,
    maxBodyDamageLoss: 0.20,
    maxSuspensionDamageLoss: 0.35,

    // ハンドリング性能の最低倍率
    minimumHandlingMultiplier: 0.25,

    // ブレーキ性能の最低倍率
    minimumBrakeMultiplier: 0.30,

    // 最高速度の最低倍率
    minimumSpeedMultiplier: 0.20,

    // 毎フレーム性能を再計算する
    autoUpdate: true
};


/* =========================
   2. BASE VEHICLE DATA
========================= */

const GTQHI_PHYSICS_DATA = {
    vehicles: new WeakMap(),
    lastStats: new WeakMap(),
    initialized: false
};


const GTQHI_PHYSICS_UTILS = {

    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    },

    number(value, fallback = 0) {
        const result = Number(value);

        return Number.isFinite(result)
            ? result
            : fallback;
    },

    getVehicleId(vehicle) {
        return vehicle
            ? vehicle.garageId || vehicle.id || null
            : null;
    },

    getGarageData(vehicle) {
        const id = this.getVehicleId(vehicle);

        if (
            !id ||
            typeof GARAGE_DATA === "undefined"
        ) {
            return null;
        }

        return GARAGE_DATA.customization[id] || null;
    },

    getDamageStatus(vehicle) {
        if (
            typeof DAMAGE_SYSTEM === "undefined" ||
            typeof DAMAGE_SYSTEM.getStatus !== "function"
        ) {
            return null;
        }

        try {
            return DAMAGE_SYSTEM.getStatus(vehicle);
        } catch (error) {
            console.warn(
                "GTQHI PHYSICS: damage status unavailable",
                error
            );

            return null;
        }
    }
};


/* =========================
   3. REGISTER BASE STATS
========================= */

const GTQHI_PHYSICS_REGISTER = {

    register(vehicle, baseStats = {}) {
        if (!vehicle || typeof vehicle !== "object") {
            return false;
        }

        const existing = GTQHI_PHYSICS_DATA.vehicles.get(
            vehicle
        );

        if (existing) {
            return true;
        }

        const base = {
            maxSpeed: GTQHI_PHYSICS_UTILS.number(
                baseStats.maxSpeed,
                GTQHI_PHYSICS_UTILS.number(
                    vehicle.maxSpeed,
                    250
                )
            ),

            acceleration: GTQHI_PHYSICS_UTILS.number(
                baseStats.acceleration,
                GTQHI_PHYSICS_UTILS.number(
                    vehicle.acceleration,
                    1
                )
            ),

            handling: GTQHI_PHYSICS_UTILS.number(
                baseStats.handling,
                GTQHI_PHYSICS_UTILS.number(
                    vehicle.handling,
                    1
                )
            ),

            braking: GTQHI_PHYSICS_UTILS.number(
                baseStats.braking,
                GTQHI_PHYSICS_UTILS.number(
                    vehicle.braking,
                    1
                )
            )
        };

        GTQHI_PHYSICS_DATA.vehicles.set(
            vehicle,
            base
        );

        return true;
    },

    registerMany(vehicles) {
        if (!Array.isArray(vehicles)) return 0;

        let count = 0;

        vehicles.forEach(vehicle => {
            if (this.register(vehicle)) {
                count++;
            }
        });

        return count;
    },

    getBase(vehicle) {
        return GTQHI_PHYSICS_DATA.vehicles.get(
            vehicle
        ) || null;
    }
};


/* =========================
   4. UPGRADE MULTIPLIERS
========================= */

const GTQHI_UPGRADE_PHYSICS = {

    get(vehicle) {
        const id = GTQHI_PHYSICS_UTILS.getVehicleId(
            vehicle
        );

        const garageData =
            GTQHI_PHYSICS_UTILS.getGarageData(vehicle);

        if (
            garageData &&
            typeof GARAGE_PERFORMANCE_SYSTEM !== "undefined"
        ) {
            const stats =
                GARAGE_PERFORMANCE_SYSTEM.getStats(id);

            if (stats) {
                return {
                    speed: stats.maxSpeed /
                        Math.max(1, stats.maxSpeed /
                            (stats.maxSpeed /
                                (1 + garageData.engineLevel *
                                    GARAGE_CONFIG.enginePowerPerLevel)
                            )
                        ),

                    acceleration:
                        1 + garageData.engineLevel *
                        GARAGE_CONFIG.enginePowerPerLevel,

                    handling:
                        1 + garageData.handlingLevel *
                        GARAGE_CONFIG.handlingPerLevel,

                    braking:
                        1 + garageData.brakeLevel *
                        GARAGE_CONFIG.brakePerLevel
                };
            }
        }

        return {
            speed: 1,
            acceleration: 1,
            handling: 1,
            braking: 1
        };
    }
};


/* =========================
   5. DAMAGE PERFORMANCE
========================= */

const GTQHI_DAMAGE_PHYSICS = {

    getHealthRatio(status, key, fallback = 1) {
        if (!status || typeof status !== "object") {
            return fallback;
        }

        const value = Number(status[key]);

        if (!Number.isFinite(value)) {
            return fallback;
        }

        // DAMAGE_SYSTEM の状態値が 0〜100 でも
        // 0〜1 の比率でも扱えるようにする
        return GTQHI_PHYSICS_UTILS.clamp(
            value > 1 ? value / 100 : value,
            0,
            1
        );
    },

    calculate(vehicle) {
        const status =
            GTQHI_PHYSICS_UTILS.getDamageStatus(vehicle);

        if (!status) {
            return {
                engine: 1,
                body: 1,
                suspension: 1,
                brakes: 1
            };
        }

        const engineHealth = this.getHealthRatio(
            status,
            "engineHealth",
            this.getHealthRatio(status, "health", 1)
        );

        const bodyHealth = this.getHealthRatio(
            status,
            "bodyHealth",
            1
        );

        const suspensionHealth = this.getHealthRatio(
            status,
            "suspensionHealth",
            1
        );

        const brakeHealth = this.getHealthRatio(
            status,
            "brakeHealth",
            bodyHealth
        );

        return {
            engine: GTQHI_PHYSICS_UTILS.clamp(
                1 -
                (1 - engineHealth) *
                GTQHI_PHYSICS_CONFIG.maxEngineDamageLoss,
                1 - GTQHI_PHYSICS_CONFIG.maxEngineDamageLoss,
                1
            ),

            body: GTQHI_PHYSICS_UTILS.clamp(
                1 -
                (1 - bodyHealth) *
                GTQHI_PHYSICS_CONFIG.maxBodyDamageLoss,
                1 - GTQHI_PHYSICS_CONFIG.maxBodyDamageLoss,
                1
            ),

            suspension: GTQHI_PHYSICS_UTILS.clamp(
                1 -
                (1 - suspensionHealth) *
                GTQHI_PHYSICS_CONFIG.maxSuspensionDamageLoss,
                1 - GTQHI_PHYSICS_CONFIG.maxSuspensionDamageLoss,
                1
            ),

            brakes: GTQHI_PHYSICS_UTILS.clamp(
                1 -
                (1 - brakeHealth) * 0.50,
                0.50,
                1
            )
        };
    }
};


/* =========================
   6. FINAL PERFORMANCE
========================= */

const GTQHI_PHYSICS_CALCULATOR = {

    calculate(vehicle) {
        if (!vehicle) return null;

        GTQHI_PHYSICS_REGISTER.register(vehicle);

        const base =
            GTQHI_PHYSICS_REGISTER.getBase(vehicle);

        const upgrade =
            GTQHI_UPGRADE_PHYSICS.get(vehicle);

        const damage =
            GTQHI_DAMAGE_PHYSICS.calculate(vehicle);

        const result = {
            maxSpeed:
                base.maxSpeed *
                upgrade.speed *
                damage.engine *
                damage.body,

            acceleration:
                base.acceleration *
                upgrade.acceleration *
                damage.engine,

            handling:
                base.handling *
                upgrade.handling *
                damage.suspension,

            braking:
                base.braking *
                upgrade.braking *
                damage.brakes,

            multipliers: {
                engineUpgrade: upgrade.acceleration,
                handlingUpgrade: upgrade.handling,
                brakeUpgrade: upgrade.braking,

                engineDamage: damage.engine,
                bodyDamage: damage.body,
                suspensionDamage: damage.suspension,
                brakeDamage: damage.brakes
            }
        };

        result.maxSpeed = Math.max(
            base.maxSpeed *
                GTQHI_PHYSICS_CONFIG.minimumSpeedMultiplier,
            result.maxSpeed
        );

        result.handling = Math.max(
            base.handling *
                GTQHI_PHYSICS_CONFIG.minimumHandlingMultiplier,
            result.handling
        );

        result.braking = Math.max(
            base.braking *
                GTQHI_PHYSICS_CONFIG.minimumBrakeMultiplier,
            result.braking
        );

        GTQHI_PHYSICS_DATA.lastStats.set(
            vehicle,
            result
        );

        return result;
    }
};


/* =========================
   7. APPLY TO VEHICLE
========================= */

const GTQHI_PHYSICS_APPLIER = {

    apply(vehicle) {
        if (!vehicle) return false;

        const stats =
            GTQHI_PHYSICS_CALCULATOR.calculate(vehicle);

        if (!stats) return false;

        /*
         * 以下の値は車両オブジェクトに保存する。
         * 実際の走行処理から参照して使用する。
         */

        vehicle.gtqhiPerformance = {
            maxSpeed: stats.maxSpeed,
            acceleration: stats.acceleration,
            handling: stats.handling,
            braking: stats.braking
        };

        return true;
    },

    applyMany(vehicles) {
        if (!Array.isArray(vehicles)) return 0;

        let count = 0;

        vehicles.forEach(vehicle => {
            if (this.apply(vehicle)) {
                count++;
            }
        });

        return count;
    }
};


/* =========================
   8. PHYSICS ACCESS API
========================= */

const GTQHI_PHYSICS = {

    register(vehicle, baseStats) {
        return GTQHI_PHYSICS_REGISTER.register(
            vehicle,
            baseStats
        );
    },

    registerMany(vehicles) {
        return GTQHI_PHYSICS_REGISTER.registerMany(
            vehicles
        );
    },

    getStats(vehicle) {
        return GTQHI_PHYSICS_CALCULATOR.calculate(
            vehicle
        );
    },

    apply(vehicle) {
        return GTQHI_PHYSICS_APPLIER.apply(vehicle);
    },

    update(vehicles) {
        if (!Array.isArray(vehicles)) return 0;

        let count = 0;

        vehicles.forEach(vehicle => {
            if (this.apply(vehicle)) {
                count++;
            }
        });

        return count;
    },

    getMaxSpeed(vehicle) {
        const stats = this.getStats(vehicle);
        return stats ? stats.maxSpeed : 0;
    },

    getAcceleration(vehicle) {
        const stats = this.getStats(vehicle);
        return stats ? stats.acceleration : 0;
    },

    getHandling(vehicle) {
        const stats = this.getStats(vehicle);
        return stats ? stats.handling : 0;
    },

    getBraking(vehicle) {
        const stats = this.getStats(vehicle);
        return stats ? stats.braking : 0;
    },

    getDamageMultipliers(vehicle) {
        const stats = this.getStats(vehicle);

        return stats ? stats.multipliers : null;
    }
};


/* =========================
   9. GAME LOOP CONNECTION
========================= */

const GTQHI_PHYSICS_LOOP = {

    update(vehicles) {
        if (!GTQHI_PHYSICS_CONFIG.autoUpdate) {
            return;
        }

        GTQHI_PHYSICS.update(vehicles);
    }
};


/* =========================
   10. PLAYER VEHICLE HELPERS
========================= */

const GTQHI_PLAYER_PHYSICS = {

    getVehicle() {
        if (
            typeof playerVehicle !== "undefined" &&
            playerVehicle
        ) {
            return playerVehicle;
        }

        if (
            typeof GARAGE_SELECTION_SYSTEM !== "undefined"
        ) {
            return GARAGE_SELECTION_SYSTEM.getSelected();
        }

        return null;
    },

    getStats() {
        const vehicle = this.getVehicle();

        if (!vehicle) return null;

        return GTQHI_PHYSICS.getStats(vehicle);
    },

    refresh() {
        const vehicle = this.getVehicle();

        if (!vehicle) return false;

        return GTQHI_PHYSICS.apply(vehicle);
    }
};


/* =========================
   11. DEBUG SYSTEM
========================= */

const GTQHI_PHYSICS_DEBUG = {

    show(vehicle) {
        const stats = GTQHI_PHYSICS.getStats(vehicle);

        if (!stats) {
            console.warn("GTQHI PHYSICS: 車両なし");
            return null;
        }

        console.table({
            "最高速度": stats.maxSpeed,
            "加速": stats.acceleration,
            "ハンドリング": stats.handling,
            "ブレーキ": stats.braking
        });

        console.table(stats.multipliers);

        return stats;
    }
};


/* =========================
   12. STARTUP
========================= */

console.log(
    "GTQHI PART 10: VEHICLE PHYSICS INTEGRATION READY"
);


/* =========================================
   GTQHI RACE SYSTEM - SAFE INTEGRATION
========================================= */

// レースコース設定
function GTQHI_SETUP_RACE() {

    if (typeof GTQHI_RACE === "undefined") {
        console.error("GTQHI: RACE SYSTEMが未読み込みです");
        return false;
    }

    return GTQHI_RACE.configure({
        id: "city_circuit",
        name: "CITY CIRCUIT",
        laps: 3,

        checkpoints: [
            { x: 0, y: 0, z: 100, radius: 12 },
            { x: 100, y: 0, z: 100, radius: 12 },
            { x: 100, y: 0, z: 0, radius: 12 },
            { x: 0, y: 0, z: 0, radius: 12 }
        ]
    });
}

// レース開始関数
function GTQHI_START_RACE() {

    if (typeof GTQHI_RACE === "undefined") {
        console.error("GTQHI: RACE SYSTEMがありません");
        return false;
    }

    if (typeof playerVehicle === "undefined") {
        console.error("GTQHI: playerVehicleがありません");
        return false;
    }

    return GTQHI_RACE.start(playerVehicle);
}

// レースイベント
if (typeof window !== "undefined") {

    window.addEventListener(
        "gtqhi:race-started",
        () => console.log("🏁 GTQHI RACE START!")
    );

    window.addEventListener(
        "gtqhi:lap-completed",
        (event) => {
            console.log(
                "LAP COMPLETE:",
                event.detail.formattedLapTime
            );
        }
    );

    window.addEventListener(
        "gtqhi:race-finished",
        (event) => {
            console.log("🏆 RACE FINISHED!", event.detail);
        }
    );
}

// 起動時のコース設定
console.log("GTQHI RACE INTEGRATION READY");


window.addEventListener(
    "gtqhi:race-finished",
    (event) => {
        console.log("レース終了！");
        console.log(event.detail);
    }
);

/* ============================================================
   GTQHI PART 11 - RACE SYSTEM
   PART 10 + RACE INTEGRATION の下に追加
============================================================ */

const GTQHI_RACE_CONFIG = {
    laps: 3,
    countdown: 3,
    updateInterval: 50,
    checkpointRadius: 12,
    storageKey: "GTQHI_RACE_BEST_TIMES"
};

const GTQHI_RACE_DATA = {
    status: "idle",
    courseId: "city_circuit",
    courseName: "CITY CIRCUIT",
    checkpoints: [],
    currentCheckpoint: 0,
    completedLaps: 0,
    totalLaps: 3,
    startTime: 0,
    elapsedTime: 0,
    lapStartTime: 0,
    lapTimes: [],
    bestTime: null,
    vehicle: null,
    timer: null,
    countdownEnd: 0
};


/* =========================
   1. UTILITIES
========================= */

const GTQHI_RACE_UTILS = {

    position(vehicle) {
        if (!vehicle) return null;

        const p = vehicle.position || vehicle;

        const x = Number(p.x);
        const y = Number(p.y || 0);
        const z = Number(p.z);

        if (!Number.isFinite(x) ||
            !Number.isFinite(z)) {
            return null;
        }

        return { x, y, z };
    },

    distance(a, b) {
        return Math.sqrt(
            (a.x - b.x) ** 2 +
            (a.y - b.y) ** 2 +
            (a.z - b.z) ** 2
        );
    },

    format(ms) {
        ms = Math.max(0, Math.floor(ms));

        const min = Math.floor(ms / 60000);
        const sec = Math.floor((ms % 60000) / 1000);
        const milli = ms % 1000;

        return (
            String(min).padStart(2, "0") + ":" +
            String(sec).padStart(2, "0") + "." +
            String(milli).padStart(3, "0")
        );
    },

    emit(name, detail = {}) {
        window.dispatchEvent(
            new CustomEvent(name, { detail })
        );
    }
};


/* =========================
   2. COURSE SYSTEM
========================= */

const GTQHI_RACE_COURSE = {

    configure(options) {
        if (!options ||
            !Array.isArray(options.checkpoints) ||
            options.checkpoints.length < 2) {
            console.error("GTQHI: コース設定が不正です");
            return false;
        }

        const points = [];

        for (const point of options.checkpoints) {
            const p = GTQHI_RACE_UTILS.position(point);

            if (!p) {
                console.error("GTQHI: チェックポイント座標エラー");
                return false;
            }

            points.push({
                x: p.x,
                y: p.y,
                z: p.z,
                radius:
                    Number(point.radius) > 0
                        ? Number(point.radius)
                        : GTQHI_RACE_CONFIG.checkpointRadius
            });
        }

        GTQHI_RACE_DATA.courseId =
            options.id || "default_course";

        GTQHI_RACE_DATA.courseName =
            options.name || "GTQHI CIRCUIT";

        GTQHI_RACE_DATA.totalLaps =
            Math.max(1, Math.floor(
                Number(options.laps) ||
                GTQHI_RACE_CONFIG.laps
            ));

        GTQHI_RACE_DATA.checkpoints = points;

        return true;
    }
};


/* =========================
   3. BEST TIME SAVE
========================= */

const GTQHI_RACE_SAVE = {

    read() {
        try {
            return JSON.parse(
                localStorage.getItem(
                    GTQHI_RACE_CONFIG.storageKey
                ) || "{}"
            );
        } catch (error) {
            return {};
        }
    },

    get(courseId) {
        const data = this.read();
        return Number(data[courseId]) || null;
    },

    save(courseId, time) {
        try {
            const data = this.read();
            const old = Number(data[courseId]);

            if (old > 0 && old <= time) {
                return false;
            }

            data[courseId] = time;

            localStorage.setItem(
                GTQHI_RACE_CONFIG.storageKey,
                JSON.stringify(data)
            );

            return true;
        } catch (error) {
            console.warn("GTQHI: ベストタイム保存失敗", error);
            return false;
        }
    }
};


/* =========================
   4. RACE UI
========================= */

const GTQHI_RACE_UI = {

    create() {
        if (document.getElementById("gtqhi-race-hud")) {
            return;
        }

        const style = document.createElement("style");

        style.textContent = `
            #gtqhi-race-hud {
                position:fixed;
                top:15px;
                left:50%;
                transform:translateX(-50%);
                z-index:99999;
                background:rgba(0,0,0,.85);
                color:white;
                border:1px solid #00dfff;
                border-radius:12px;
                padding:12px 22px;
                text-align:center;
                font-family:Arial,sans-serif;
                min-width:210px;
                pointer-events:none;
            }

            #gtqhi-race-time {
                color:#00eaff;
                font-size:26px;
                font-weight:bold;
            }

            #gtqhi-race-info {
                font-size:13px;
                margin-top:6px;
            }

            #gtqhi-race-result {
                display:none;
                position:fixed;
                inset:0;
                z-index:100000;
                background:rgba(0,0,0,.8);
                align-items:center;
                justify-content:center;
                color:white;
                font-family:Arial,sans-serif;
            }

            #gtqhi-race-result-box {
                background:#101d30;
                border:1px solid #00dfff;
                border-radius:16px;
                padding:25px;
                width: min(340px, 85vw);
                text-align:center;
            }

            #gtqhi-race-result button {
                background:#007b9e;
                border:0;
                border-radius:8px;
                padding:12px 25px;
                color:white;
                margin-top:15px;
            }
        `;

        document.head.appendChild(style);

        const hud = document.createElement("div");
        hud.id = "gtqhi-race-hud";

        hud.innerHTML = `
            <div id="gtqhi-race-time">READY</div>
            <div id="gtqhi-race-info">LAP 0 / 3</div>
        `;

        document.body.appendChild(hud);

        const result = document.createElement("div");
        result.id = "gtqhi-race-result";

        result.innerHTML = `
            <div id="gtqhi-race-result-box">
                <h2>🏁 RACE FINISHED!</h2>
                <div id="gtqhi-race-result-text"></div>
                <button id="gtqhi-race-close">CLOSE</button>
            </div>
        `;

        document.body.appendChild(result);

        document.getElementById("gtqhi-race-close")
            .addEventListener("click", () => {
                result.style.display = "none";
            });
    },

    update(mainText, infoText) {
        const time = document.getElementById(
            "gtqhi-race-time"
        );

        const info = document.getElementById(
            "gtqhi-race-info"
        );

        if (time) time.textContent = mainText;
        if (info) info.textContent = infoText;
    },

    showResult(data) {
        const result = document.getElementById(
            "gtqhi-race-result"
        );

        const text = document.getElementById(
            "gtqhi-race-result-text"
        );

        if (!result || !text) return;

        text.replaceChildren();

        const total = document.createElement("p");
        total.textContent =
            "TIME: " + GTQHI_RACE_UTILS.format(data.time);

        const best = document.createElement("p");
        best.textContent =
            "BEST: " +
            GTQHI_RACE_UTILS.format(data.bestTime);

        const record = document.createElement("h3");
        record.textContent =
            data.newRecord ? "🏆 NEW RECORD!" : "RACE COMPLETE";

        text.append(total, best, record);

        data.lapTimes.forEach((lap, index) => {
            const row = document.createElement("p");
            row.textContent =
                "LAP " + (index + 1) + ": " +
                GTQHI_RACE_UTILS.format(lap);

            text.appendChild(row);
        });

        result.style.display = "flex";
    }
};


/* =========================
   5. RACE ENGINE
========================= */

const GTQHI_RACE = {

    configure(options) {
        const success =
            GTQHI_RACE_COURSE.configure(options);

        if (success) {
            GTQHI_RACE_DATA.bestTime =
                GTQHI_RACE_SAVE.get(
                    GTQHI_RACE_DATA.courseId
                );
        }

        return success;
    },

    start(vehicle) {
        if (
            GTQHI_RACE_DATA.status === "racing" ||
            GTQHI_RACE_DATA.status === "countdown"
        ) {
            return false;
        }

        if (!vehicle) {
            console.error("GTQHI: 車両が取得できません");
            return false;
        }

        if (GTQHI_RACE_DATA.checkpoints.length < 2) {
            console.error("GTQHI: コースが未設定です");
            return false;
        }

        if (!GTQHI_RACE_UTILS.position(vehicle)) {
            console.error("GTQHI: 車両のpositionがありません");
            return false;
        }

        this.stopTimer();

        GTQHI_RACE_DATA.vehicle = vehicle;
        GTQHI_RACE_DATA.status = "countdown";
        GTQHI_RACE_DATA.currentCheckpoint = 0;
        GTQHI_RACE_DATA.completedLaps = 0;
        GTQHI_RACE_DATA.elapsedTime = 0;
        GTQHI_RACE_DATA.lapTimes = [];

        GTQHI_RACE_DATA.countdownEnd =
            Date.now() +
            GTQHI_RACE_CONFIG.countdown * 1000;

        GTQHI_RACE_UI.create();

        GTQHI_RACE_UI.update(
            String(GTQHI_RACE_CONFIG.countdown),
            "GET READY!"
        );

        GTQHI_RACE_UTILS.emit("gtqhi:race-preparing");

        GTQHI_RACE_DATA.timer = setInterval(
            () => this.tick(),
            GTQHI_RACE_CONFIG.updateInterval
        );

        return true;
    },

    tick() {
        const data = GTQHI_RACE_DATA;

        if (data.status === "countdown") {
            const remaining =
                Math.ceil(
                    (data.countdownEnd - Date.now()) / 1000
                );

            if (remaining > 0) {
                GTQHI_RACE_UI.update(
                    String(remaining),
                    "GET READY!"
                );
            } else {
                this.begin();
            }

            return;
        }

        if (data.status !== "racing") return;

        data.elapsedTime = Date.now() - data.startTime;

        this.checkCheckpoint(data.vehicle);

        if (data.status !== "racing") return;

        const lap = Math.min(
            data.completedLaps + 1,
            data.totalLaps
        );

        GTQHI_RACE_UI.update(
            GTQHI_RACE_UTILS.format(data.elapsedTime),
            "LAP " + lap + " / " + data.totalLaps +
            " | CP " +
            (data.currentCheckpoint + 1) +
            " / " + data.checkpoints.length
        );
    },

    begin() {
        const data = GTQHI_RACE_DATA;
        const now = Date.now();

        data.status = "racing";
        data.startTime = now;
        data.lapStartTime = now;

        GTQHI_RACE_UI.update("GO!", "RACE STARTED!");

        GTQHI_RACE_UTILS.emit("gtqhi:race-started", {
            courseId: data.courseId
        });
    },

    checkCheckpoint(vehicle) {
        const data = GTQHI_RACE_DATA;

        const position =
            GTQHI_RACE_UTILS.position(vehicle);

        if (!position) return;

        const cp =
            data.checkpoints[data.currentCheckpoint];

        if (!cp) return;

        const distance =
            GTQHI_RACE_UTILS.distance(position, cp);

        if (distance > cp.radius) return;

        GTQHI_RACE_UTILS.emit(
            "gtqhi:checkpoint-passed",
            {
                index: data.currentCheckpoint + 1
            }
        );

        data.currentCheckpoint++;

        if (data.currentCheckpoint >= data.checkpoints.length) {
            this.completeLap();
        }
    },

    completeLap() {
        const data = GTQHI_RACE_DATA;
        const now = Date.now();

        const lapTime = now - data.lapStartTime;

        data.lapTimes.push(lapTime);
        data.completedLaps++;

        GTQHI_RACE_UTILS.emit(
            "gtqhi:lap-completed",
            {
                lap: data.completedLaps,
                lapTime,
                formattedLapTime:
                    GTQHI_RACE_UTILS.format(lapTime)
            }
        );

        if (data.completedLaps >= data.totalLaps) {
            this.finish();
            return;
        }

        data.currentCheckpoint = 0;
        data.lapStartTime = now;
    },

    finish() {
        const data = GTQHI_RACE_DATA;

        if (data.status !== "racing") return false;

        data.elapsedTime = Date.now() - data.startTime;
        data.status = "finished";

        this.stopTimer();

        const newRecord = GTQHI_RACE_SAVE.save(
            data.courseId,
            data.elapsedTime
        );

        const bestTime =
            GTQHI_RACE_SAVE.get(data.courseId) ||
            data.elapsedTime;

        data.bestTime = bestTime;

        const result = {
            courseId: data.courseId,
            time: data.elapsedTime,
            bestTime,
            newRecord,
            lapTimes: data.lapTimes.slice()
        };

        GTQHI_RACE_UI.update("FINISHED!", "RACE COMPLETE");
        GTQHI_RACE_UI.showResult(result);

        GTQHI_RACE_UTILS.emit(
            "gtqhi:race-finished",
            result
        );

        return result;
    },

    stopTimer() {
        if (GTQHI_RACE_DATA.timer !== null) {
            clearInterval(GTQHI_RACE_DATA.timer);
            GTQHI_RACE_DATA.timer = null;
        }
    },

    abort() {
        this.stopTimer();

        GTQHI_RACE_DATA.status = "idle";
        GTQHI_RACE_DATA.elapsedTime = 0;

        GTQHI_RACE_UI.update("READY", "RACE ABORTED");

        GTQHI_RACE_UTILS.emit("gtqhi:race-aborted");

        return true;
    },

    status() {
        return {
            status: GTQHI_RACE_DATA.status,
            course: GTQHI_RACE_DATA.courseName,
            lap: GTQHI_RACE_DATA.completedLaps,
            totalLaps: GTQHI_RACE_DATA.totalLaps,
            checkpoint: GTQHI_RACE_DATA.currentCheckpoint,
            time: GTQHI_RACE_DATA.elapsedTime,
            bestTime: GTQHI_RACE_DATA.bestTime
        };
    }
};


/* =========================
   6. COURSE INITIALIZATION
========================= */

// 既存のコース設定関数を実行
GTQHI_SETUP_RACE();

// HUDを準備
GTQHI_RACE_UI.create();


/* =========================
   7. PLAYER START API
========================= */

// 既存の開始関数を安全な車両取得方式に更新
function GTQHI_START_RACE() {

    const vehicle =
        GTQHI_PLAYER_PHYSICS.getVehicle();

    if (!vehicle) {
        console.error(
            "GTQHI: プレイヤー車両がありません"
        );

        return false;
    }

    return GTQHI_RACE.start(vehicle);
}


/* =========================
   8. READY
========================= */

console.log("GTQHI PART 11: RACE SYSTEM READY");

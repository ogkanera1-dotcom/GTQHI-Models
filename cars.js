
/* =========================================================
   GTQHI ULTRA VEHICLE GENERATOR
   Version 3.0
   Three.js r128 compatible
   26 vehicles / detailed procedural models
   API compatible with GTQHICars.create(name, color)
========================================================= */

(function (global) {
"use strict";

if (!global.THREE) {
  console.error("GTQHI: Three.js が読み込まれていません");
  return;
}

const THREE = global.THREE;

/* ================= VEHICLE DATABASE ================= */

const CARS = {
"Nissan Fairlady Z":{type:"sports",w:2.0,h:.85,l:4.4,speed:240,acceleration:8.5,braking:9,handling:8.5},
"Toyota Supra":{type:"sports",w:2,h:.9,l:4.5,speed:260,acceleration:9,braking:9,handling:8.7},
"Porsche 911":{type:"sports",w:1.95,h:.9,l:4.5,speed:290,acceleration:9.5,braking:9.8,handling:9.7},
"Lamborghini Revuelto":{type:"super",w:2.1,h:.85,l:4.9,speed:350,acceleration:10,braking:10,handling:9.8},
"Mazda Roadster":{type:"open",w:1.75,h:.65,l:3.9,speed:190,acceleration:7.5,braking:8,handling:9.5},
"Alpine A110":{type:"sports",w:1.8,h:.8,l:4.2,speed:250,acceleration:8.8,braking:9,handling:9.4},
"Audi TT":{type:"sports",w:1.85,h:.85,l:4.2,speed:230,acceleration:8,braking:8.5,handling:8.5},
"Toyota Harrier":{type:"suv",w:1.95,h:1.35,l:4.8,speed:190,acceleration:6.5,braking:7,handling:6.8},
"Mazda CX-5":{type:"suv",w:1.9,h:1.35,l:4.6,speed:185,acceleration:6.5,braking:7,handling:7},
"Mercedes G-Class":{type:"box",w:2,h:1.8,l:4.7,speed:210,acceleration:6.5,braking:7.5,handling:6},
"Jeep Wrangler":{type:"box",w:1.95,h:1.75,l:4.3,speed:180,acceleration:6,braking:7,handling:6},
"Land Rover Defender":{type:"box",w:2,h:1.7,l:4.8,speed:190,acceleration:6.5,braking:7,handling:6.5},
"Toyota Land Cruiser":{type:"suv",w:2,h:1.7,l:5,speed:200,acceleration:6.8,braking:7.5,handling:6.5},
"Land Cruiser 70":{type:"box",w:1.9,h:1.8,l:4.8,speed:160,acceleration:5.5,braking:6,handling:5.5},
"FJ Cruiser":{type:"box",w:1.9,h:1.65,l:4.6,speed:175,acceleration:6,braking:6.5,handling:6},
"Mitsubishi Delica D:5":{type:"van",w:1.85,h:1.75,l:4.8,speed:180,acceleration:5.8,braking:6.5,handling:6},
"Cadillac Escalade":{type:"suv",w:2.1,h:1.85,l:5.3,speed:210,acceleration:7,braking:7.5,handling:6},
"Toyota Vellfire":{type:"van",w:1.85,h:1.8,l:4.9,speed:190,acceleration:6,braking:7,handling:6},
"Rover Mini":{type:"classic",w:1.55,h:1.15,l:3.1,speed:150,acceleration:5.5,braking:6,handling:8},
"Citroen 2CV":{type:"classic",w:1.5,h:1.4,l:3.8,speed:110,acceleration:3.5,braking:4.5,handling:5.5},
"VW Beetle":{type:"beetle",w:1.75,h:1.45,l:4.1,speed:160,acceleration:5,braking:5.5,handling:6.5},
"Isuzu 117 Coupe":{type:"classic",w:1.75,h:.95,l:4.3,speed:170,acceleration:5.5,braking:6,handling:7},
"Nissan Pao":{type:"classic",w:1.6,h:1.35,l:3.7,speed:130,acceleration:4,braking:5,handling:6},
"Nissan Figaro":{type:"open",w:1.65,h:1.3,l:3.7,speed:140,acceleration:4.5,braking:5,handling:6},
"Nissan Sunny Truck":{type:"truck",w:1.65,h:1.3,l:4.1,speed:140,acceleration:4,braking:5,handling:5},
"Volvo 240 Estate":{type:"wagon",w:1.8,h:1.4,l:4.8,speed:180,acceleration:5.5,braking:6.5,handling:6.5}
};

const COLORS = {
glass:0x182b3b,
rubber:0x101114,
rim:0xbfc7ce,
chrome:0xc5cbd0,
black:0x17191d,
head:0xfff1c7,
tail:0xff1825,
interior:0x24272c,
seat:0x30343b,
carbon:0x171b20
};

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

function material(color,roughness=.45,metalness=.25,extra={}) {
  return new THREE.MeshStandardMaterial(Object.assign({
    color:color,
    roughness:roughness,
    metalness:metalness
  },extra));
}

function part(group,geometry,mat,x=0,y=0,z=0) {
  const m=new THREE.Mesh(geometry,mat);
  m.position.set(x,y,z);
  m.castShadow=true;
  m.receiveShadow=true;
  group.add(m);
  return m;
}

function box(group,mat,x,y,z,w,h,d,bevel=0) {
  let geometry;
  if (bevel>0 && THREE.ExtrudeGeometry) {
    const s=new THREE.Shape();
    s.moveTo(-w/2+bevel,-h/2);
    s.lineTo(w/2-bevel,-h/2);
    s.quadraticCurveTo(w/2,-h/2,w/2,-h/2+bevel);
    s.lineTo(w/2,h/2-bevel);
    s.quadraticCurveTo(w/2,h/2,w/2-bevel,h/2);
    s.lineTo(-w/2+bevel,h/2);
    s.quadraticCurveTo(-w/2,h/2,-w/2,h/2-bevel);
    s.lineTo(-w/2,-h/2+bevel);
    s.quadraticCurveTo(-w/2,-h/2,-w/2+bevel,-h/2);
    geometry=new THREE.ExtrudeGeometry(s,{
      depth:d,
      bevelEnabled:true,
      bevelSegments:2,
      steps:1,
      bevelSize:Math.min(bevel*.35,.035),
      bevelThickness:Math.min(bevel*.35,.035),
      curveSegments:6
    });
    geometry.translate(0,0,-d/2);
  } else {
    geometry=new THREE.BoxGeometry(w,h,d);
  }
  return part(group,geometry,mat,x,y,z);
}

function sphere(group,mat,x,y,z,sx,sy,sz,segments=24) {
  const m=part(group,new THREE.SphereGeometry(1,segments,16),mat,x,y,z);
  m.scale.set(sx,sy,sz);
  return m;
}

function cylinder(group,mat,x,y,z,radius,depth,segments=32) {
  const m=part(group,new THREE.CylinderGeometry(radius,radius,depth,segments),mat,x,y,z);
  m.rotation.z=Math.PI/2;
  return m;
}

function line(group,mat,a,b,r=.012) {
  const start=new THREE.Vector3(a[0],a[1],a[2]);
  const end=new THREE.Vector3(b[0],b[1],b[2]);
  const dir=new THREE.Vector3().subVectors(end,start);
  const mesh=part(group,new THREE.CylinderGeometry(r,r,dir.length(),8),mat);
  mesh.position.copy(start).add(end).multiplyScalar(.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir.normalize());
  return mesh;
}

/* ================= BODY SHAPES ================= */

function makeBodyShape(group,spec,paint,dark) {
  const w=spec.w,h=spec.h,l=spec.l;
  const type=spec.type;
  const y=.78;
  let baseH=type==="super"?.62:type==="sports"?.67:.72;

  // Main body: rounded cross-section extruded along vehicle length.
  const shape=new THREE.Shape();
  shape.moveTo(-w*.43,0);
  shape.quadraticCurveTo(-w*.52,.05,-w*.50,.20);
  shape.lineTo(-w*.48,baseH*.78);
  shape.quadraticCurveTo(-w*.46,baseH,-w*.30,baseH);
  shape.lineTo(w*.30,baseH);
  shape.quadraticCurveTo(w*.46,baseH,w*.48,baseH*.78);
  shape.lineTo(w*.50,.20);
  shape.quadraticCurveTo(w*.52,.05,w*.43,0);
  shape.closePath();

  const bodyGeo=new THREE.ExtrudeGeometry(shape,{
    depth:l*.94,
    steps:1,
    bevelEnabled:true,
    bevelSegments:4,
    bevelSize:.045,
    bevelThickness:.045,
    curveSegments:12
  });
  bodyGeo.translate(0,y,-l*.47);
  part(group,bodyGeo,paint);

  // Front hood and rear deck
  box(group,paint,0,y+baseH*.78,l*.29,w*.86,.12,l*.29,.06);
  box(group,paint,0,y+baseH*.76,-l*.31,w*.86,.13,l*.25,.06);

  // Side skirts
  [-1,1].forEach(s=>{
    box(group,dark,s*w*.49,.48,0,.055,.13,l*.72,.025);
    box(group,paint,s*w*.49,.56,0,.045,.055,l*.62,.018);
  });

  // Underbody
  box(group,dark,0,.43,0,w*.78,.12,l*.78,.025);

  // Cabin dimensions by type
  let cabinW=w*(type==="box"||type==="van"||type==="wagon"?.83:.76);
  let cabinL=l*(type==="van"||type==="box"?.55:type==="super"?.43:.48);
  let cabinH=type==="sports"||type==="super"?.42:
    type==="classic"?.53:.58;

  if(type==="beetle") cabinH=.62;
  if(type==="open") cabinH=.34;

  const cabinY=y+baseH*.78+cabinH*.43;
  const cabinZ=-l*.055;

  if(type!=="open") {
    const roofShape=new THREE.Shape();
    roofShape.moveTo(-cabinW*.48,0);
    roofShape.quadraticCurveTo(-cabinW*.5,.12,-cabinW*.40,cabinH*.55);
    roofShape.quadraticCurveTo(-cabinW*.34,cabinH,cabinW*.20,cabinH);
    roofShape.quadraticCurveTo(cabinW*.45,cabinH,cabinW*.48,cabinH*.55);
    roofShape.lineTo(cabinW*.48,.06);
    roofShape.closePath();

    const roofGeo=new THREE.ExtrudeGeometry(roofShape,{
      depth:cabinL,
      bevelEnabled:true,
      bevelSegments:3,
      bevelSize:.035,
      bevelThickness:.035,
      curveSegments:12
    });
    roofGeo.translate(0,cabinY-cabinH*.4,-cabinL/2+cabinZ);
    part(group,roofGeo,paint);
  } else {
    // Open-top roadster cockpit rim
    box(group,paint,0,cabinY-.05,cabinZ,cabinW,.08,cabinL,.035);
  }

  // Type-specific body details
  if(type==="super") {
    box(group,dark,0,.70,l*.485,w*.56,.17,.035);
    box(group,dark,0,.68,-l*.485,w*.55,.14,.035);
    [-1,1].forEach(s=>{
      const vent=box(group,dark,s*w*.39,.83,l*.12,.035,.20,l*.28);
      vent.rotation.z=s*.10;
    });
  }

  if(type==="box"||type==="suv") {
    box(group,dark,0,.50,l*.48,w*.78,.15,.08,.025);
    box(group,dark,0,.50,-l*.48,w*.78,.15,.08,.025);
    [-1,1].forEach(s=>{
      box(group,dark,s*w*.49,.66,0,.035,.12,l*.48);
    });
  }

  if(type==="van"||type==="wagon") {
    box(group,paint,0,y+baseH*.9,-l*.18,w*.82,.10,l*.48,.04);
  }

  if(type==="truck") {
    box(group,paint,0,.92,-l*.30,w*.82,.34,l*.35,.035);
    box(group,dark,0,1.10,-l*.30,w*.72,.035,l*.29);
    [-1,1].forEach(s=>{
      box(group,paint,s*w*.40,1.10,-l*.30,.07,.34,l*.35);
    });
    box(group,paint,0,1.10,-l*.48,w*.82,.34,.07);
  }

  return {cabinW,cabinL,cabinH,cabinY,cabinZ};
}

/* ================= WINDOWS ================= */

function makeWindows(group,spec,glass,trim,cabin) {
  const {cabinW,cabinL,cabinH,cabinY,cabinZ}=cabin;
  const w=cabinW,l=cabinL;
  const frontZ=cabinZ+l*.49;
  const rearZ=cabinZ-l*.49;
  const top=cabinY+cabinH*.44;
  const bottom=cabinY-cabinH*.22;

  // Sloped front and rear windshield panels
  const windshield=box(group,glass,0,(top+bottom)/2,frontZ,
    w*.83,cabinH*.68,.035,.012);
  windshield.rotation.x=-.22;

  const rear=box(group,glass,0,(top+bottom)/2,rearZ,
    w*.82,cabinH*.65,.035,.012);
  rear.rotation.x=.24;

  [-1,1].forEach(s=>{
    // Side window front and rear
    box(group,glass,s*w*.493,cabinY,cabinZ+l*.16,
      .025,cabinH*.62,l*.29,.01);
    box(group,glass,s*w*.493,cabinY,cabinZ-l*.20,
      .025,cabinH*.62,l*.27,.01);

    // Pillars
    const pillarMat=trim;
    line(group,pillarMat,
      [s*w*.50,bottom,cabinZ+l*.31],
      [s*w*.43,top,cabinZ+l*.20],.025);
    line(group,pillarMat,
      [s*w*.50,bottom,cabinZ-l*.02],
      [s*w*.43,top,cabinZ-l*.02],.025);
    line(group,pillarMat,
      [s*w*.50,bottom,cabinZ-l*.36],
      [s*w*.43,top,cabinZ-l*.31],.025);

    // Window beltline
    line(group,trim,
      [s*w*.50,bottom,cabinZ+l*.43],
      [s*w*.50,bottom,cabinZ-l*.43],.018);
  });

  // Roof trim
  box(group,trim,0,top+.015,cabinZ,w*.85,.025,l*.84);
}

/* ================= WHEELS ================= */

function makeWheel(group,x,z,spec) {
  const wheel=new THREE.Group();
  wheel.position.set(x,.47,z);
  group.add(wheel);

  const tire=material(0x101114,.96,.02);
  const sidewall=material(0x202226,.9,.02);
  const rim=material(0xbfc7ce,.22,.88);
  const darkRim=material(0x30363d,.3,.8);
  const brake=material(0x777f87,.35,.75);
  const red=material(0xb52222,.4,.55);

  cylinder(wheel,tire,0,0,0,.43,.25,40);
  cylinder(wheel,sidewall,.13,0,0,.34,.035,40);
  cylinder(wheel,brake,.155,0,0,.245,.045,40);
  cylinder(wheel,darkRim,.18,0,0,.29,.035,40);

  // Inner rim ring
  const ring=part(wheel,new THREE.TorusGeometry(.255,.025,8,40),rim,.205,0,0);
  ring.rotation.y=Math.PI/2;

  // 10 spokes
  for(let i=0;i<10;i++) {
    const a=i*Math.PI/5;
    const spoke=box(wheel,rim,.215,
      Math.cos(a)*.13,Math.sin(a)*.13,
      .035,.235,.035,.008);
    spoke.rotation.x=a;
  }

  // Lug nuts
  for(let i=0;i<5;i++) {
    const a=i*Math.PI*2/5;
    sphere(wheel,darkRim,.225,
      Math.cos(a)*.075,Math.sin(a)*.075,
      .025,.025,.025,10);
  }

  // Center cap
  cylinder(wheel,rim,.235,0,0,.065,.025,24);

  // Brake caliper
  box(wheel,red,.17,.19,.02,.09,.13,.12,.02);

  // Tire sidewall lettering-like raised marks
  for(let i=0;i<24;i++) {
    const a=i*Math.PI/12;
    const mark=box(wheel,sidewall,.135,
      Math.cos(a)*.385,Math.sin(a)*.385,
      .018,.035,.012);
    mark.rotation.x=a;
  }

  wheel.userData.isWheel=true;
  return wheel;
}

function makeWheels(group,spec) {
  const wheels=[];
  const x=spec.w*.48;
  const front=spec.l*.32;
  const rear=-spec.l*.32;
  [-1,1].forEach(s=>{
    wheels.push(makeWheel(group,s*x,front,spec));
    wheels.push(makeWheel(group,s*x,rear,spec));
  });
  return wheels;
}

/* ================= LIGHTS / EXTERIOR ================= */

function makeLights(group,spec,chrome) {
  const head=material(0xfff3d0,.18,.2,{
    emissive:0xffd98a,
    emissiveIntensity:.55
  });
  const tail=material(0xd80019,.25,.15,{
    emissive:0x77000b,
    emissiveIntensity:.7
  });
  const dark=material(0x10151b,.35,.35);

  [-1,1].forEach(s=>{
    const hx=s*spec.w*.34;

    // Headlight housing and lens
    box(group,dark,hx,.91,spec.l*.49,.36,.17,.055,.035);
    sphere(group,head,hx,.92,spec.l*.505,.15,.075,.035);
    box(group,chrome,hx,.82,spec.l*.508,.25,.018,.02);

    // Rear lamp
    box(group,dark,hx,.91,-spec.l*.49,.28,.17,.045);
    box(group,tail,hx,.92,-spec.l*.515,.22,.105,.025,.025);

    // Side marker
    sphere(group,head,s*spec.w*.505,.73,spec.l*.28,.025,.035,.065,12);
  });

  // Front grille
  box(group,dark,0,.72,spec.l*.495,spec.w*.48,.19,.045,.025);
  for(let i=0;i<7;i++) {
    box(group,chrome,0,.65+i*.022,spec.l*.522,
      spec.w*.40,.009,.012);
  }

  // Lower air intakes
  box(group,dark,0,.53,spec.l*.495,spec.w*.65,.09,.035,.02);

  // Rear diffuser
  box(group,dark,0,.48,-spec.l*.49,spec.w*.64,.11,.09,.02);

  // Exhausts
  [-1,1].forEach(s=>{
    cylinder(group,chrome,s*spec.w*.30,.51,-spec.l*.515,.075,.15,24);
    cylinder(group,dark,s*spec.w*.30,.51,-spec.l*.56,.045,.012,20);
  });

  // Door handles
  [-1,1].forEach(s=>{
    for(let z of [-spec.l*.10,spec.l*.12]) {
      box(group,chrome,s*spec.w*.505,.83,z,.025,.045,.13,.012);
    }
  });

  // Mirrors and mirror glass
  [-1,1].forEach(s=>{
    line(group,dark,[s*spec.w*.43,1.15,spec.l*.20],
      [s*spec.w*.57,1.20,spec.l*.20],.035);
    sphere(group,chrome,s*spec.w*.56,1.21,spec.l*.20,
      .10,.07,.13,16);
    sphere(group,material(0x263d50,.18,.45),
      s*spec.w*.59,1.22,spec.l*.20,.025,.045,.09,16);
  });

  // Number plates
  const plate=material(0xf0f0e8,.75,.05);
  box(group,plate,0,.65,spec.l*.54,.42,.095,.018,.012);
  box(group,dark,0,.65,-spec.l*.53,.42,.095,.018,.012);

  // Hood panel lines
  const seam=material(0x353b42,.75,.1);
  [-1,1].forEach(s=>{
    line(group,seam,[s*spec.w*.34,.91,spec.l*.18],
      [s*spec.w*.34,.91,spec.l*.46],.008);
  });
}

/* ================= INTERIOR ================= */

function makeInterior(group,spec,cabin) {
  const {cabinW,cabinL,cabinY,cabinZ}=cabin;
  const dark=material(0x191d22,.78,.08);
  const seat=material(0x30343a,.85,.05);
  const leather=material(0x17191d,.65,.08);
  const metal=material(0x8a9299,.3,.7);
  const screen=material(0x101b25,.22,.3,{
    emissive:0x102b40,
    emissiveIntensity:.4
  });

  // Floor
  box(group,dark,0,cabinY-.33,cabinZ,cabinW*.82,.045,cabinL*.88);

  // Center console
  box(group,leather,0,cabinY-.12,cabinZ+.05,
    cabinW*.18,.16,cabinL*.52,.025);
  box(group,metal,0,cabinY-.02,cabinZ+.10,
    cabinW*.13,.025,.20,.01);

  // Dashboard
  box(group,leather,0,cabinY-.02,cabinZ+cabinL*.38,
    cabinW*.90,.14,.22,.035);
  box(group,screen,0,cabinY+.055,cabinZ+cabinL*.38,
    cabinW*.22,.075,.018,.01);

  // Instrument cluster
  for(let i=0;i<3;i++) {
    const x=(i-1)*.11;
    cylinder(group,metal,x,cabinY+.02,cabinZ+cabinL*.39,
      .035,.018,16);
  }

  // Two detailed seats
  [-1,1].forEach(s=>{
    const x=s*cabinW*.22;
    box(group,seat,x,cabinY-.18,cabinZ-.10,.36,.25,.38,.055);
    box(group,seat,x,cabinY+.02,cabinZ-.22,.34,.38,.14,.05);
    box(group,leather,x,cabinY+.04,cabinZ-.30,.25,.06,.025,.015);

    // Seat headrest
    box(group,seat,x,cabinY+.25,cabinZ-.28,.20,.13,.09,.035);

    // Seat seams
    line(group,metal,[x-.12,cabinY-.03,cabinZ-.18],
      [x-.12,cabinY+.13,cabinZ-.18],.006);
  });

  // Steering wheel
  const steering=new THREE.Group();
  steering.position.set(-cabinW*.23,cabinY+.02,cabinZ+cabinL*.36);
  steering.rotation.x=Math.PI/2;
  group.add(steering);
  const wheelRing=part(steering,new THREE.TorusGeometry(.115,.014,8,32),leather);
  wheelRing.rotation.z=0;
  cylinder(steering,metal,0,0,0,.035,.035,16);
  for(let i=0;i<3;i++) {
    const a=i*Math.PI*2/3;
    line(steering,metal,[0,0,0],
      [Math.cos(a)*.10,Math.sin(a)*.10,0],.009);
  }

  // Gear lever
  line(group,metal,[cabinW*.08,cabinY-.18,cabinZ],
    [cabinW*.08,cabinY-.02,cabinZ],.018);
  sphere(group,leather,cabinW*.08,cabinY-.01,cabinZ,.045,.045,.045,12);

  // Pedals
  for(let i=0;i<3;i++) {
    box(group,metal,-.18+i*.08,cabinY-.29,cabinZ+cabinL*.30,
      .035,.075,.018);
  }
}

/* ================= SPECIAL DETAILS ================= */

function makeTypeDetails(group,spec,paint,dark,chrome) {
  const t=spec.type;
  const w=spec.w,l=spec.l;

  if(t==="sports"||t==="super") {
    // Rear spoiler
    const z=-l*.43;
    line(group,dark,[-w*.30,1.12,z],[ -w*.30,1.38,z-.10],.025);
    line(group,dark,[w*.30,1.12,z],[w*.30,1.38,z-.10],.025);
    box(group,paint,0,1.39,z-.10,w*.88,.07,.28,.025);

    // Side air vents
    [-1,1].forEach(s=>{
      box(group,dark,s*w*.49,.70,l*.03,.025,.12,.38);
    });
  }

  if(t==="super") {
    // Aggressive front splitter
    box(group,dark,0,.43,l*.51,w*1.02,.055,.22,.02);
    // Rear engine cover louvers
    for(let i=0;i<6;i++) {
      box(group,chrome,0,.99,-l*.12-i*.045,w*.45,.012,.018);
    }
    // Side aerodynamic fins
    [-1,1].forEach(s=>{
      box(group,dark,s*w*.49,.48,l*.15,.035,.10,.48);
    });
  }

  if(t==="box"||t==="suv") {
    // Roof rails
    [-1,1].forEach(s=>{
      line(group,chrome,[s*w*.34,1.85,l*.25],
        [s*w*.34,1.85,-l*.30],.025);
      line(group,chrome,[s*w*.34,1.85,l*.25],
        [s*w*.34,1.85,l*.10],.025);
    });
    // Wheel arch trim
    [-1,1].forEach(s=>{
      [-l*.32,l*.32].forEach(z=>{
        const arch=part(group,new THREE.TorusGeometry(.48,.035,8,32),
          dark,s*w*.49,.48,z);
        arch.rotation.y=Math.PI/2;
      });
    });
  }

  if(t==="van") {
    // Sliding door seam
    [-1,1].forEach(s=>{
      line(group,dark,[s*w*.505,.58,l*.22],
        [s*w*.505,1.28,-l*.25],.012);
    });
  }

  if(t==="wagon") {
    // Rear cargo window divider
    box(group,dark,0,1.30,-l*.31,w*.72,.035,.025);
    box(group,paint,0,1.55,-l*.30,w*.78,.07,.08);
  }

  if(t==="truck") {
    // Tailgate and bed ribs
    box(group,paint,0,.95,-l*.48,w*.80,.30,.055,.025);
    for(let i=0;i<5;i++) {
      box(group,chrome,0,.91,-l*.20+i*.065,w*.68,.012,.018);
    }
  }

  if(t==="classic"||t==="beetle") {
    // Classic chrome bumpers and round lamps
    [-1,1].forEach(s=>{
      sphere(group,chrome,s*w*.36,.94,l*.48,.12,.09,.055,20);
      sphere(group,chrome,s*w*.36,.94,-l*.48,.10,.08,.045,20);
    });
    box(group,chrome,0,.55,l*.49,w*.82,.055,.09,.025);
    box(group,chrome,0,.55,-l*.49,w*.82,.055,.09,.025);
  }

  if(t==="open") {
    // Convertible rear deck
    box(group,paint,0,1.0,-l*.27,w*.72,.16,.45,.045);
    // Roll hoops
    [-1,1].forEach(s=>{
      line(group,chrome,[s*w*.25,1.05,-l*.12],
        [s*w*.25,1.55,-l*.22],.035);
    });
  }
}

/* ================= CREATE VEHICLE ================= */

function createCar(name,color) {
  const spec=CARS[name];
  if(!spec) {
    console.warn("GTQHI: 車種が見つかりません",name);
    return null;
  }

  const group=new THREE.Group();
  group.name=name;

  const paint=material(
    color===undefined?0xc62828:color,
    .25,.72,
    {metalness:.72}
  );
  paint.userData.isCarPaint=true;

  const dark=material(COLORS.black,.75,.12);
  const chrome=material(COLORS.chrome,.22,.9);
  const glass=material(COLORS.glass,.12,.55,{
    transparent:true,opacity:.76
  });

  const cabin=makeBodyShape(group,spec,paint,dark);
  makeWindows(group,spec,glass,dark,cabin);
  makeLights(group,spec,chrome);
  makeInterior(group,spec,cabin);
  makeTypeDetails(group,spec,paint,dark,chrome);

  const wheels=makeWheels(group,spec);

  // Front/rear wheel positions and suspension details
  wheels.forEach((wheel,i)=>{
    wheel.userData.wheelIndex=i;
  });

  // Fender accents and side details
  [-1,1].forEach(s=>{
    box(group,dark,s*spec.w*.50,.72,0,.025,.18,spec.l*.20);
    line(group,chrome,[s*spec.w*.505,.61,spec.l*.20],
      [s*spec.w*.505,.61,-spec.l*.20],.012);
  });

  // Roof antenna
  if(spec.type!=="open") {
    line(group,dark,[0,1.55,-spec.l*.32],
      [0,1.72,-spec.l*.36],.012);
  }

  // Metadata: original API compatibility
  group.userData.vehicleName=name;
  group.userData.vehicleSpec=spec;
  group.userData.speed=0;
  group.userData.maxSpeed=spec.speed;
  group.userData.acceleration=spec.acceleration;
  group.userData.braking=spec.braking;
  group.userData.handling=spec.handling;
  group.userData.wheels=wheels;
  group.userData.isVehicle=true;
  group.userData.hitbox={
    width:spec.w,
    height:spec.h,
    length:spec.l
  };

  return group;
}

/* ================= PUBLIC API ================= */

function getSpec(name) {
  return CARS[name]||null;
}

function getPerformance(name) {
  const s=CARS[name];
  if(!s)return null;
  return {
    maxSpeed:s.speed,
    acceleration:s.acceleration,
    braking:s.braking,
    handling:s.handling
  };
}

function getHitbox(name) {
  const s=CARS[name];
  if(!s)return null;
  return {width:s.w,height:s.h,length:s.l};
}

function setColor(vehicle,color) {
  if(!vehicle||!vehicle.traverse)return;
  vehicle.traverse(obj=>{
    if(!obj.isMesh||!obj.material)return;
    const list=Array.isArray(obj.material)?obj.material:[obj.material];
    list.forEach(m=>{
      if(m.userData&&m.userData.isCarPaint&&m.color) {
        m.color.set(color);
      }
    });
  });
}

function createNPC(name,color) {
  const npc=createCar(name,color);
  if(!npc)return null;
  npc.userData.isNPC=true;
  npc.userData.npcTargetSpeed=npc.userData.maxSpeed*.65;
  return npc;
}

function listByType(type) {
  return Object.keys(CARS).filter(n=>CARS[n].type===type);
}

global.GTQHICars={
  list:Object.keys(CARS),
  specs:CARS,
  colors:COLORS,
  create:createCar,
  createNPC:createNPC,
  getSpec:getSpec,
  getPerformance:getPerformance,
  getHitbox:getHitbox,
  listByType:listByType,
  setColor:setColor
};

console.log("GTQHI ULTRA CARS loaded:",Object.keys(CARS).length,"vehicles");

})(window);

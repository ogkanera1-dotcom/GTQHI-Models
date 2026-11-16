/* GTQHI ULTIMATE CARS v4.0 - Three.js required */
(function (global) {
"use strict";
const CARS=[
["Nissan Fairlady Z","sports",2.65,1.82,4.38,245,9,18,1.15,"#d92727"],
["Toyota Supra","sports",2.75,1.85,4.38,260,9.5,19,1.12,"#f1a51b"],
["Porsche 911","sports",2.45,1.85,4.52,275,10.5,20,1.22,"#eeeeee"],
["Lamborghini Revuelto","super",2.9,2.05,4.95,330,13,24,1.35,"#b9d92b"],
["Mazda Roadster","sports",2.3,1.75,3.92,205,8,16,1.28,"#2c75d8"],
["Alpine A110","sports",2.42,1.8,4.18,235,9,18,1.3,"#6aa8e8"],
["Audi TT","sports",2.5,1.85,4.2,230,8.8,18,1.2,"#aaaaaa"],
["Toyota Harrier","suv",2.69,1.85,4.74,190,6.8,16,.92,"#20252b"],
["Mazda CX-5","suv",2.7,1.85,4.58,185,6.5,16,.94,"#bd2929"],
["Mercedes G-Class","suv",2.89,2.05,4.65,180,6,17,.78,"#eeeeec"],
["Jeep Wrangler","suv",2.95,1.9,4.33,170,5.8,16,.82,"#71865a"],
["Land Rover Defender","suv",2.95,2,4.76,185,6.2,17,.84,"#536d58"],
["Toyota Land Cruiser","suv",2.85,1.98,4.95,190,6.5,18,.88,"#d5d0c4"],
["Land Cruiser 70","suv",2.73,1.9,4.89,165,5.5,16,.76,"#a6a08b"],
["FJ Cruiser","suv",2.69,1.9,4.63,175,5.9,16,.82,"#e5a52e"],
["Mitsubishi Delica D:5","van",2.85,1.8,4.8,175,5.7,16,.82,"#777e85"],
["Cadillac Escalade","suv",3.07,2.05,5.38,200,6,18,.8,"#17191d"],
["Toyota Vellfire","van",3,1.85,4.99,185,6.2,17,.86,"#20242a"],
["Rover Mini","classic",2.04,1.56,3.05,145,5,14,1.02,"#e8e1cb"],
["Citroen 2CV","classic",2.4,1.48,3.78,105,3.8,12,.88,"#b7c8a1"],
["VW Beetle","classic",2.4,1.72,4.08,155,5,14,.98,"#e8c64b"],
["Isuzu 117 Coupe","classic",2.5,1.72,4.31,175,6,15,1.05,"#c7b9a2"],
["Nissan Pao","classic",2.3,1.6,3.74,135,4.5,13,.92,"#b6c6a9"],
["Nissan Figaro","classic",2.3,1.63,3.75,140,4.8,13,.95,"#9ec9cf"],
["Nissan Sunny Truck","truck",2.5,1.65,4.18,150,5.2,14,.9,"#d7d0b7"],
["Volvo 240 Estate","classic",2.66,1.72,4.79,180,6,16,.94,"#bd3434"]
];
const specs=CARS.map(c=>({name:c[0],type:c[1],wheelbase:c[2],width:c[3],length:c[4],speed:c[5],acceleration:c[6],braking:c[7],handling:c[8],color:c[9]}));
function material(color,roughness=.5,metalness=.15){return new THREE.MeshStandardMaterial({color,roughness,metalness});}
function box(g,w,h,d,x,y,z,m){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;g.add(o);return o;}
function cylinder(g,r,depth,x,y,z,m,segments=24){const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,depth,segments),m);o.rotation.z=Math.PI/2;o.position.set(x,y,z);o.castShadow=true;g.add(o);return o;}
function create(name,color){
 const s=specs.find(v=>v.name===name)||specs[0],g=new THREE.Group(),L=s.length,W=s.width;
 const paint=material(color||s.color,.27,.55);paint.userData.isCarPaint=true;
 const glass=new THREE.MeshPhysicalMaterial({color:0x172d40,metalness:.35,roughness:.13,transparent:true,opacity:.83});
 const rubber=material(0x101114,.95,0),rim=material(0xbfc6cc,.22,.9),dark=material(0x171a1e,.5,.2);
 const head=new THREE.MeshStandardMaterial({color:0xfff0c6,emissive:0xffd987,emissiveIntensity:.7});
 const tail=new THREE.MeshStandardMaterial({color:0xe51e28,emissive:0x9b0000,emissiveIntensity:.6});
 box(g,W*.94,.48,L*.94,0,.55,0,paint);
 box(g,W*.88,.18,L*.7,0,.34,0,dark);
 box(g,W*.88,.17,L*.28,0,.84,L*.29,paint);
 box(g,W*.84,.16,L*.23,0,.82,-L*.34,paint);
 const cabLen=L*(s.type==="classic"?.43:.48);
 box(g,W*.76,.62,cabLen,0,1.17,-.02,paint);
 box(g,W*.68,.4,cabLen*.38,0,1.2,cabLen*.27,glass);
 box(g,W*.68,.4,cabLen*.29,0,1.2,-cabLen*.3,glass);
 box(g,.035,.38,cabLen*.43,-W*.385,1.2,-.01,dark);
 box(g,.035,.38,cabLen*.43,W*.385,1.2,-.01,dark);
 const interior=material(0x292d31,.85,0);
 box(g,W*.65,.1,L*.38,0,.9,0,interior);
 for(let row=0;row<2;row++)for(let side of [-1,1]){
  box(g,.4,.35,.36,side*W*.19,1,row?-.6:.4,material(0x343a40,.9,0));
 }
 box(g,W*.5,.09,.13,0,1.04,.08,dark);
 const steering=cylinder(g,.18,.035,-W*.23,1.12,.36,dark,20);
 box(g,W*.88,.19,.16,0,.46,L*.5,dark);
 box(g,W*.88,.19,.16,0,.46,-L*.5,dark);
 box(g,W*.5,.17,.035,0,.65,L*.505,dark);
 for(const side of [-1,1]){
  box(g,.23,.12,.035,side*W*.31,.69,L*.51,head);
  box(g,.2,.12,.035,side*W*.32,.69,-L*.51,tail);
  box(g,.13,.12,.18,side*W*.48,1.16,.15,paint);
 }
 const wheels=[];
 for(const x of [-W*.49,W*.49])for(const z of [-L*.34,L*.34]){
  const wh=new THREE.Group();wh.position.set(x,.39,z);g.add(wh);wheels.push(wh);
  cylinder(wh,.36,.22,0,0,0,rubber,32);
  cylinder(wh,.23,.235,0,0,0,rim,24);
  cylinder(wh,.105,.245,0,0,0,dark,20);
  for(let k=0;k<5;k++){
   const spoke=box(wh,.035,.035,.32,0,0,0,material(0xe1e5e8,.2,.9));
   spoke.rotation.x=k*Math.PI*2/5;
  }
 }
 if(s.type==="sports"||s.type==="super")box(g,W*.62,.07,.16,0,1.23,-L*.48,dark);
 for(const x of [-.22,.22])cylinder(g,.05,.16,x,.35,-L*.51,dark,16);
 g.userData={name:s.name,spec:s,wheels,steering,maxSpeed:s.speed,acceleration:s.acceleration,braking:s.braking,handling:s.handling,speed:0};
 return g;
}
function getSpec(name){return specs.find(s=>s.name===name)||specs[0];}
function setColor(group,color){if(group)group.traverse(o=>{if(o.isMesh&&o.material&&o.material.userData&&o.material.userData.isCarPaint)o.material.color.set(color);});}
global.GTQHICars={
 version:"4.0",
 list:specs.map(s=>s.name),
 specs,
 colors:["#e53935","#ffffff","#111111","#1565c0","#f9a825","#43a047","#9c27b0","#9e9e9e"],
 create,
 createNPC:name=>create(name),
 getSpec,
 getPerformance:getSpec,
 getHitbox:name=>{const s=getSpec(name);return{width:s.width,length:s.length,height:1.5};},
 listByType:type=>specs.filter(s=>s.type===type).map(s=>s.name),
 setColor
};
})(window);

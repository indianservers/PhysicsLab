import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

/** Seeded surface detail keeps the bench and metal stable between visits. */
export function surfaceTexture(kind:'oak'|'brushed'|'rubber'|'paper') {
  const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=1024;
  const ctx=canvas.getContext('2d')!;let seed=173;
  const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  ctx.fillStyle=kind==='oak'?'#9f724b':kind==='rubber'?'#303335':kind==='paper'?'#eee9dc':'#b7bdc1';ctx.fillRect(0,0,1024,1024);
  for(let i=0;i<12000;i++){
    const x=random()*1024,y=random()*1024;
    ctx.strokeStyle=kind==='oak'?`rgba(${random()>.55?'236,194,137':'56,30,15'},${random()*.085})`:kind==='brushed'?`rgba(${random()>.5?'255,255,255':'20,25,30'},${random()*.15})`:`rgba(45,40,34,${random()*.07})`;
    ctx.lineWidth=kind==='oak'?.4+random()*1.3:.4;ctx.beginPath();ctx.moveTo(x,y);
    if(kind==='oak')ctx.bezierCurveTo(x+60,y+Math.sin(y*.015)*3,x+160,y+random()*6,x+300+random()*600,y+random()*5);
    else if(kind==='brushed')ctx.lineTo(x+80+random()*450,y+random()*.6);
    else ctx.lineTo(x+random()*3,y+random()*2);ctx.stroke();
  }
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.anisotropy=8;
  return texture;
}
export function createWorkshop(scene:THREE.Scene){
  const oak=surfaceTexture('oak'),brushed=surfaceTexture('brushed'),rubber=surfaceTexture('rubber'),fibre=surfaceTexture('paper');
  const materials={
    steel:new THREE.MeshPhysicalMaterial({color:'#bcc6ce',metalness:1,roughness:.19,clearcoat:.25,clearcoatRoughness:.2,bumpMap:brushed,bumpScale:.0006}),
    polished:new THREE.MeshPhysicalMaterial({color:'#e3e6e8',metalness:1,roughness:.095,clearcoat:1,clearcoatRoughness:.12}),
    brass:new THREE.MeshPhysicalMaterial({color:'#b99249',metalness:.92,roughness:.23,bumpMap:brushed,bumpScale:.0008}),
    black:new THREE.MeshStandardMaterial({color:'#151b21',metalness:.48,roughness:.36,bumpMap:rubber,bumpScale:.003}),
    rubber:new THREE.MeshStandardMaterial({color:'#101418',roughness:.78,bumpMap:rubber,bumpScale:.001}),
    oak:new THREE.MeshStandardMaterial({map:oak,roughness:.48,bumpMap:oak,bumpScale:.008,metalness:0}),
    paper:new THREE.MeshStandardMaterial({map:fibre,color:'#f3eee3',roughness:.92,side:THREE.DoubleSide}),
    red:new THREE.MeshPhysicalMaterial({color:'#a91017',roughness:.35,clearcoat:.4}),
    blue:new THREE.MeshPhysicalMaterial({color:'#122c4d',metalness:.3,roughness:.3,clearcoat:.7}),
    ceramic:new THREE.MeshStandardMaterial({color:'#d6cfba',roughness:.64}),
  };
  const mesh=(g:THREE.BufferGeometry,m:THREE.Material,x=0,y=0,z=0,parent:THREE.Object3D=scene)=>{const obj=new THREE.Mesh(g,m);obj.position.set(x,y,z);obj.castShadow=true;obj.receiveShadow=true;parent.add(obj);return obj;};
  const box=(x:number,y:number,z:number,w:number,h:number,d:number,m:THREE.Material,parent:THREE.Object3D=scene,r=.025)=>mesh(new RoundedBoxGeometry(w,h,d,3,Math.min(r,w/4,h/4,d/4)),m,x,y,z,parent);
  const cylinder=(x:number,y:number,z:number,r:number,h:number,m:THREE.Material,parent:THREE.Object3D=scene)=>mesh(new THREE.CylinderGeometry(r,r,h,48),m,x,y,z,parent);
  function rod(a:THREE.Vector3,b:THREE.Vector3,r:number,m=materials.steel,parent:THREE.Object3D=scene){const obj=cylinder(0,0,0,r,a.distanceTo(b),m,parent);obj.position.copy(a).add(b).multiplyScalar(.5);obj.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),b.clone().sub(a).normalize());return obj;}
  const wire=(points:number[][],r:number,m:THREE.Material,parent:THREE.Object3D=scene)=>mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p as [number,number,number]))),80,r,12,false),m,0,0,0,parent);
  const torus=(x:number,y:number,z:number,r:number,t:number,m:THREE.Material,parent:THREE.Object3D=scene,arc=Math.PI*2)=>mesh(new THREE.TorusGeometry(r,t,12,64,arc),m,x,y,z,parent);
  function screw(x:number,y:number,z:number,parent:THREE.Object3D=scene){const a=cylinder(x,y,z,.025,.013,materials.steel,parent);a.rotation.x=Math.PI/2;box(x,y,z+.008,.029,.004,.002,materials.black,parent,.001);}
  function decal(text:string,x:number,y:number,z:number,w:number,h:number,color='#15202a',background='transparent',parent:THREE.Object3D=scene){const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=Math.max(128,Math.round(1024*h/w));const ctx=canvas.getContext('2d')!;if(background!=='transparent'){ctx.fillStyle=background;ctx.fillRect(0,0,canvas.width,canvas.height);}ctx.fillStyle=color;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`500 ${Math.floor(canvas.height*.56)}px 'Segoe UI',sans-serif`;ctx.fillText(text,512,canvas.height*.53,1000);const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=8;const obj=mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false}),x,y,z,parent);obj.castShadow=false;return obj;}
  function ruler(length:number,width=.14,metal=false,vertical=false,max=100){const group=new THREE.Group();const face=metal?materials.steel:new THREE.MeshStandardMaterial({map:oak,color:'#e2b671',roughness:.48});box(0,0,0,length,width,.025,face,group,.008);const canvas=document.createElement('canvas');canvas.width=4096;canvas.height=384;const ctx=canvas.getContext('2d')!;ctx.fillStyle='#1c2528';ctx.font='58px Arial';ctx.textAlign='center';for(let i=0;i<=100;i++){const x=52+i/100*3992;ctx.fillRect(x,0,3,i%10===0?150:i%5===0?110:65);if(i%10===0)ctx.fillText(String(Math.round(i/100*max)),x,245);}ctx.font='37px Arial';ctx.textAlign='right';ctx.fillText('cm',4020,345);const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;map.anisotropy=16;const facePlane=mesh(new THREE.PlaneGeometry(length,width),new THREE.MeshBasicMaterial({map,transparent:true,depthWrite:false}),0,0,.013,group);facePlane.castShadow=false;if(vertical)group.rotation.z=Math.PI/2;return group;}
  function shadow(x:number,z:number,w:number,d:number,parent:THREE.Object3D=scene){const canvas=document.createElement('canvas');canvas.width=canvas.height=128;const ctx=canvas.getContext('2d')!,gradient=ctx.createRadialGradient(64,64,4,64,64,64);gradient.addColorStop(0,'rgba(0,0,0,.5)');gradient.addColorStop(.5,'rgba(0,0,0,.22)');gradient.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=gradient;ctx.fillRect(0,0,128,128);const obj=mesh(new THREE.PlaneGeometry(w,d),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(canvas),transparent:true,depthWrite:false}),x,.007,z,parent);obj.rotation.x=-Math.PI/2;obj.castShadow=false;obj.renderOrder=1;}
  function base(x:number,z:number,w=1,d=.6){const group=new THREE.Group();group.position.set(x,0,z);scene.add(group);box(0,.065,0,w,.12,d,materials.black,group,.04);box(0,.128,0,w*.95,.012,d*.94,materials.steel,group,.006);for(const xx of [-1,1])for(const zz of [-1,1])cylinder(xx*w*.38,.015,zz*d*.34,.035,.03,materials.rubber,group);shadow(x,z,w*1.5,d*1.5);return group;}
  function weight(parent:THREE.Object3D=scene,r=.13,height=.26){const group=new THREE.Group();parent.add(group);const profile=[new THREE.Vector2(0,0),new THREE.Vector2(r*.9,0),new THREE.Vector2(r,.014),new THREE.Vector2(r,height-.018),new THREE.Vector2(r*.93,height),new THREE.Vector2(0,height)];mesh(new THREE.LatheGeometry(profile,64),materials.brass,0,0,0,group);for(const y of [.025,height-.025])torus(0,y,0,r*.998,.0018,materials.black,group).rotation.x=Math.PI/2;cylinder(0,height+.035,0,.016,.07,materials.steel,group);torus(0,height+.075,0,.03,.009,materials.polished,group);return group;}
  return {materials,mesh,box,cylinder,rod,wire,torus,screw,decal,ruler,shadow,base,weight};
}

/** Reuses vertex buffers: constant wire diameter and radius, changing pitch only. */
export function makeHelix(radius=.079,wireRadius=.009,turns=17){
  const segments=544,sides=10,positions=new Float32Array((segments+1)*(sides+1)*3),normals=new Float32Array(positions.length),indices:number[]=[];
  for(let i=0;i<segments;i++)for(let j=0;j<sides;j++){const a=i*(sides+1)+j,b=a+sides+1;indices.push(a,b,a+1,b,b+1,a+1);}
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3).setUsage(THREE.DynamicDrawUsage));geometry.setAttribute('normal',new THREE.BufferAttribute(normals,3).setUsage(THREE.DynamicDrawUsage));geometry.setIndex(indices);
  let last=-1;
  const update=(length:number)=>{if(length===last)return;last=length;
    for(let i=0;i<=segments;i++){const f=i/segments,theta=f*Math.PI*2*turns,cs=Math.cos(theta),sn=Math.sin(theta),pitch=length/(Math.PI*2*turns),inv=1/Math.hypot(radius,pitch);const by=-radius*inv,bx=pitch*sn*inv,bz=-pitch*cs*inv;
      for(let j=0;j<=sides;j++){const a=j/sides*Math.PI*2,c=Math.cos(a),s=Math.sin(a),nx=cs*c+bx*s,ny=by*s,nz=sn*c+bz*s,k=(i*(sides+1)+j)*3;positions[k]=radius*cs+wireRadius*nx;positions[k+1]=-f*length+wireRadius*ny;positions[k+2]=radius*sn+wireRadius*nz;normals[k]=nx;normals[k+1]=ny;normals[k+2]=nz;}}
    geometry.attributes.position.needsUpdate=true;geometry.attributes.normal.needsUpdate=true;geometry.computeBoundingSphere();
  };update(.8);return {geometry,update};
}

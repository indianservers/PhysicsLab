import {useEffect,useRef,useState} from 'react';
import * as T from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
import {currentElectronX,type CurrentSolution} from '../lib/currentStudio';
export function CurrentBench({s,displacement,zoom,micro=false}:{s:CurrentSolution;displacement:number;zoom:number;micro?:boolean}){
 const host=useRef<HTMLDivElement>(null),state=useRef({s,displacement,zoom});state.current={s,displacement,zoom};
 const update=useRef<()=>void>(()=>{}),[fallback,setFallback]=useState(false);
 useEffect(()=>{const el=host.current;if(!el)return;let renderer:T.WebGLRenderer;
 try{renderer=new T.WebGLRenderer({antialias:true,alpha:false})}catch{setFallback(true);return}
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=.85;renderer.shadowMap.enabled=true;el.appendChild(renderer.domElement);
 const scene=new T.Scene();scene.background=new T.Color('#03101f');const camera=new T.OrthographicCamera(-5,5,2,-2,.01,100);camera.position.set(.15,2.15,8);camera.lookAt(0,.4,0);
 const pmrem=new T.PMREMGenerator(renderer),room=new RoomEnvironment(),env=pmrem.fromScene(room);scene.environment=env.texture;
 scene.add(new T.HemisphereLight('#bddbff','#16202d',.8));const light=new T.DirectionalLight('#e6f3ff',2.5);light.position.set(-3,7,4);light.castShadow=true;light.shadow.mapSize.set(1024,1024);scene.add(light);
 const materials:T.Material[]=[],geometries:T.BufferGeometry[]=[],textures:T.Texture[]=[];
 const mat=(color:string,metalness=.6,roughness=.3)=>{const m=new T.MeshStandardMaterial({color,metalness,roughness});materials.push(m);return m};
 const steel=mat('#8897a6',.9,.24),dark=mat('#17212e',.7,.4),brass=mat('#b89759',.85,.25),copper=mat('#b77d59',.8,.25),blue=mat('#14a5ff',.3,.16),red=mat('#bd253c',.2,.4),black=mat('#101a25',.1,.4);
 (blue as T.MeshStandardMaterial).emissive.set('#006bff');(blue as T.MeshStandardMaterial).emissiveIntensity=.65;
 const mesh=(g:T.BufferGeometry,m:T.Material,x=0,y=0,z=0)=>{geometries.push(g);const o=new T.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;scene.add(o);return o};
 const box=(x:number,y:number,z:number,w:number,h:number,d:number,m:T.Material)=>mesh(new RoundedBoxGeometry(w,h,d,3,Math.min(.055,w/5,h/5,d/5)),m,x,y,z);
 const cylinder=(x:number,y:number,z:number,r:number,length:number,m:T.Material,horizontal=false)=>{const o=mesh(new T.CylinderGeometry(r,r,length,48),m,x,y,z);if(horizontal)o.rotation.z=Math.PI/2;return o};
 const tube=(points:number[][],m:T.Material)=>mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p as [number,number,number]))),70,.035,12,false),m);
 const label=(text:string,x:number,y:number,z:number,w:number,h:number)=>{const c=document.createElement('canvas');c.width=512;c.height=128;const ctx=c.getContext('2d')!;ctx.fillStyle='#06131e';ctx.fillRect(0,0,512,128);ctx.fillStyle='#80dbff';ctx.font='bold 50px monospace';ctx.textAlign='center';ctx.fillText(text,256,85);const texture=new T.CanvasTexture(c);textures.push(texture);const m=new T.MeshBasicMaterial({map:texture});materials.push(m);return mesh(new T.PlaneGeometry(w,h),m,x,y,z)};
 const wire=new T.Group();scene.add(wire);
 const ions=mesh(new T.SphereGeometry(.081,16,12),copper);scene.remove(ions);
 const lattice=new T.InstancedMesh(ions.geometry,copper,micro?80:120);lattice.name='current-copper-lattice';wire.add(lattice);
 const electronGeom=new T.SphereGeometry(micro?.036:.035,12,10);geometries.push(electronGeom);const electrons=new T.InstancedMesh(electronGeom,blue,micro?64:90);electrons.name='current-drift-electrons';wire.add(electrons);const dummy=new T.Object3D();
 let screen:T.Mesh|undefined;
 if(!micro){box(0,-.13,0,10.2,.18,4,mat('#081829',.1,.85));const glass=new T.MeshPhysicalMaterial({color:'#b5e4ff',transparent:true,opacity:.25,metalness:.15,roughness:.08,side:T.DoubleSide,depthWrite:false});materials.push(glass);const shell=cylinder(0,.7,0,.39,3.6,glass,true);shell.name='current-wire-envelope';
 for(const x of[-1.95,1.95]){cylinder(x,.7,0,.4,.25,steel,true);cylinder(x+(x<0?-.22:.22),.7,0,.30,.22,brass,true);cylinder(x,.22,0,.07,.5,steel);cylinder(x,.02,0,.28,.12,steel);for(const z of[-.16,.16])cylinder(x,.06,z,.055,.06,brass)}
 for(const[x,title]of[[-3.42,'DC POWER SUPPLY'],[3.35,'AMMETER']] as const){box(x,.76,-.22,1.55,1.6,.75,steel);box(x,.76,.19,1.42,1.43,.08,dark);label(title,x,1.32,.24,1.27,.20);const display=label(x<0?'5.00 V':'0.314 A',x,1.04,.25,1.22,.36);if(x>0)screen=display;else display.name='current-voltage-display';cylinder(x,.57,.3,.16,.08,steel).rotation.x=Math.PI/2;for(const dx of[-.43,.43]){const port=cylinder(x+dx,.27,.3,.09,.15,dx<0?black:red);port.rotation.x=Math.PI/2}}
 tube([[-2.99,.27,.42],[-2.68,.04,.7],[-2.4,.25,.1],[-2.2,.7,0]],red);tube([[2.2,.7,0],[2.7,.56,.1],[3.78,.27,.43]],red);tube([[2.92,.27,.43],[4.3,.1,.7],[4.5,-.02,-.7],[-4.5,-.02,-.7],[-4.5,.1,.6],[-3.85,.27,.43]],black);
 // Native engraved bench marks, independent of reference pixels.
 for(let i=0;i<35;i++)box(-5+i*.3,-.031,0,.006,.002,4,steel);
 }
 const draw=()=>{const {s,displacement,zoom}=state.current;const w=el.clientWidth,h=el.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);const extent=micro?1.45:Math.max(2.6,10.2/(w/h));camera.left=-extent*w/h/2;camera.right=extent*w/h/2;camera.top=extent/2;camera.bottom=-extent/2;camera.zoom=zoom;camera.position.set(micro?0:.15,micro?.3:2.15,micro?6:8);camera.lookAt(0,micro?0:.65,0);camera.updateProjectionMatrix();
 const radius=micro?.74:.36*s.diameter;
 for(let i=0;i<lattice.count;i++){const nx=micro?10:20,ny=micro?4:3,col=i%nx,row=Math.floor(i/nx)%ny,depth=Math.floor(i/(nx*ny));dummy.position.set((col/(nx-1)-.5)*3.35,(micro?0:.7)+(row/(ny-1)-.5)*radius*1.45,(depth-.5)*radius*1.1);dummy.scale.setScalar(micro?2.05:1);dummy.updateMatrix();lattice.setMatrixAt(i,dummy.matrix)}lattice.instanceMatrix.needsUpdate=true;
 for(let i=0;i<electrons.count;i++){const angle=i*2.399963229728653,rr=Math.sqrt(((i*.754877666)%1))*(micro?.78:radius*.88);dummy.position.set(currentElectronX(i,displacement), (micro?0:.7)+rr*Math.sin(angle),(micro?.6+rr*.25*Math.cos(angle):rr*Math.cos(angle)));dummy.scale.setScalar(1);dummy.updateMatrix();electrons.setMatrixAt(i,dummy.matrix)}electrons.instanceMatrix.needsUpdate=true;
 const shell=scene.getObjectByName('current-wire-envelope');if(shell){shell.scale.set((radius+.04)/.39,1,(radius+.04)/.39)}
 wire.userData={diameterMM:s.diameter,driftSpeed:s.vd,displacementMetres:displacement,displayScale:1200};
 if(screen){const texture=(screen.material as T.MeshBasicMaterial).map!,canvas=texture.image as HTMLCanvasElement,ctx=canvas.getContext('2d')!;ctx.fillStyle='#06131e';ctx.fillRect(0,0,512,128);ctx.fillStyle='#6cdfff';ctx.font='bold 50px monospace';ctx.textAlign='center';ctx.fillText(s.I.toFixed(3)+' A',256,85);texture.needsUpdate=true}
 const vs=scene.getObjectByName('current-voltage-display') as T.Mesh|undefined;if(vs){const texture=(vs.material as T.MeshBasicMaterial).map!,c=texture.image as HTMLCanvasElement,ctx=c.getContext('2d')!;ctx.fillStyle='#06131e';ctx.fillRect(0,0,512,128);ctx.fillStyle='#6cdfff';ctx.font='bold 50px monospace';ctx.textAlign='center';ctx.fillText(s.voltage.toFixed(2)+' V',256,85);texture.needsUpdate=true}
 renderer.render(scene,camera)};
 update.current=draw;const observer=new ResizeObserver(draw);observer.observe(el);draw();return()=>{observer.disconnect();update.current=()=>{};geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());env.dispose();room.traverse(o=>{const m=o as T.Mesh;m.geometry?.dispose();if(m.material)(Array.isArray(m.material)?m.material:[m.material]).forEach(v=>v.dispose())});pmrem.dispose();light.shadow.dispose();renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove()};
 },[micro]);useEffect(()=>update.current(),[s,displacement,zoom]);
 return <div className={'ecs-native '+(micro?'ecs-micro-native':'')} ref={host}>{fallback&&<svg className="ecs-fallback" viewBox="0 0 1000 300" aria-label="WebGL unavailable: calculated current schematic"><rect x="40" y="70" width="150" height="180" rx="12" fill="#243749"/><text x="60" y="120">{s.voltage.toFixed(2)} V</text><rect x="200" y="120" width="600" height="70" rx="30" fill="#446079"/>{Array.from({length:50},(_,i)=><circle key={i} cx={500+currentElectronX(i,displacement)*150} cy={140+i%3*15} r="5" fill="#17aeff"/>)}<text x="810" y="160">{s.I.toFixed(3)} A</text><text x="250" y="270">WebGL unavailable · calculated schematic · electrons ←</text></svg>}</div>
}

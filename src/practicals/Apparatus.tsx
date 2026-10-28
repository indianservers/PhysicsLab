import {useEffect,useRef,useState} from 'react';
import * as T from 'three';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
import {RectAreaLightUniformsLib} from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {LabId,Params,solve} from './model';
import {createWorkshop,makeHelix} from './workshop';

type Props={id:LabId;p:Params;time:number;charging:boolean;onAdjust:(key:string,value:number)=>void;onRelease:()=>void;resetCamera?:number;cameraView?:string};
export function Apparatus({id,p,time,charging,onAdjust,onRelease,resetCamera,cameraView='default'}:Props){
  const restoreCamera=useRef<(view:string)=>void>(()=>{});
  useEffect(()=>restoreCamera.current(cameraView),[resetCamera,cameraView]);
  const el=useRef<HTMLDivElement>(null),live=useRef({p,time,charging,onRelease});
  live.current={p,time,charging,onRelease};const [failed,setFailed]=useState(false);
  useEffect(()=>{
    const host=el.current!;let renderer:T.WebGLRenderer;
    try{renderer=new T.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});}catch{setFailed(true);return;}
    renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0,0);
    renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
    renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=.95;
    renderer.outputColorSpace=T.SRGBColorSpace;host.appendChild(renderer.domElement);
    const scene=new T.Scene(),camera=new T.PerspectiveCamera(34,1,.02,40);
    const wide=['wire','rule','sphere'].includes(id);camera.position.set(wide?1.1:.8,wide?1.9:1.65,wide?6.6:5.6);
    const orbit=new OrbitControls(camera,renderer.domElement);orbit.target.set(0,wide?.85:1.25,0);
    orbit.enableDamping=true;orbit.dampingFactor=.08;orbit.enablePan=false;orbit.minDistance=3.6;orbit.maxDistance=9;
    orbit.minPolarAngle=Math.PI*.24;orbit.maxPolarAngle=Math.PI*.49;orbit.minAzimuthAngle=-.65;orbit.maxAzimuthAngle=.65;
    orbit.saveState();restoreCamera.current=view=>{const damping=orbit.enableDamping;orbit.enableDamping=false;orbit.update();orbit.reset();if(view!=='default'){const a=view==='left'?-.45:view==='right'?.45:0,r=wide?6.6:5.6;camera.position.set(r*Math.sin(a),wide?1.9:1.65,r*Math.cos(a));orbit.update();}orbit.enableDamping=damping;};
    const room=new RoomEnvironment();
    const softbox=new T.Mesh(new T.PlaneGeometry(4,2),new T.MeshBasicMaterial({color:new T.Color(4,3.8,3.5),side:T.DoubleSide}));softbox.position.set(-2,3,3);softbox.lookAt(0,1,0);room.add(softbox);
    const pm=new T.PMREMGenerator(renderer),environment=pm.fromScene(room,.04);scene.environment=environment.texture;scene.environmentIntensity=.8;
    scene.add(new T.HemisphereLight('#dce8f5','#7e614b',.75));
    const key=new T.DirectionalLight('#ffe2bd',3);key.position.set(-3,5,4);key.castShadow=true;key.shadow.mapSize.set(2048,2048);key.shadow.camera.left=-3;key.shadow.camera.right=3;key.shadow.camera.top=3;key.shadow.camera.bottom=-3;key.shadow.normalBias=.015;key.shadow.bias=-.0002;key.shadow.radius=4;scene.add(key);
    RectAreaLightUniformsLib.init();const rim=new T.RectAreaLight('#b7d6ff',4,3,4);rim.position.set(3,3,-1);rim.lookAt(0,1,0);scene.add(rim);
    const fill=new T.DirectionalLight('#c9e2ff',.8);fill.position.set(3,2,4);scene.add(fill);
    const w=createWorkshop(scene),m=w.materials,v=(x:number,y:number,z=0)=>new T.Vector3(x,y,z);
    // Transparent shadow receiver lets the photographic wood remain visible.
    const floor=w.mesh(new T.PlaneGeometry(30,30),new T.ShadowMaterial({opacity:.24}),0,.002,0);floor.rotation.x=-Math.PI/2;floor.castShadow=false;
    const root=new T.Group();scene.add(root);
    const interact:T.Object3D[]=[];const update:((s:Record<string,number>,p:Params,t:number)=>void)[]=[];
    const stand=(x:number,height:number)=>{w.base(x,0,.94,.66);w.cylinder(x,height/2+.13,0,.029,height,m.steel);w.cylinder(x,.18,0,.072,.1,m.black);};
    const clamp=(x:number,y:number,z=0)=>{w.box(x,y,z,.17,.18,.14,m.black);w.rod(v(x-.14,y,z),v(x+.17,y,z),.016);w.cylinder(x+.18,y,z,.045,.035,m.black).rotation.z=Math.PI/2;w.screw(x,y,z+.08);};
    const socket=(x:number,y:number,z:number,color:T.Material,parent:T.Object3D=scene)=>{const a=w.cylinder(x,y,z,.034,.05,color,parent);a.rotation.x=Math.PI/2;const b=w.cylinder(x,y,z+.028,.017,.008,m.black,parent);b.rotation.x=Math.PI/2;};
    function instrument(x:number,y:number,z:number,width=1.05,height=.75){const group=new T.Group();group.position.set(x,y,z);scene.add(group);w.box(0,0,0,width,height,.42,m.black,group,.06);w.box(0,.015,.22,width*.89,height*.85,.026,m.steel,group,.025);w.box(0,height*.17,.24,width*.76,height*.25,.018,m.rubber,group,.012);for(const xx of [-1,1])for(const yy of [-1,1])w.screw(xx*width*.38,yy*height*.33,.245,group);return group;}
    function digital(parent:T.Object3D,x:number,y:number,z:number,width:number,color='#ff3f2d'){
      const label=w.decal('0.000',x,y,z+.012,width,width*.25,color,'#07100e',parent);let last='';
      return(text:string)=>{if(text===last)return;last=text;const mat=label.material as T.MeshBasicMaterial,map=mat.map!,c=map.image as HTMLCanvasElement,ctx=c.getContext('2d')!;ctx.fillStyle='#07100e';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle=color;ctx.shadowColor=color;ctx.shadowBlur=7;ctx.font=`500 ${Math.floor(c.height*.65)}px monospace`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,c.width/2,c.height*.52,c.width*.96);map.needsUpdate=true;};
    }
    if(id==='springs'){
      stand(-.61,2.2);clamp(-.61,2.27);w.rod(v(-.61,2.27),v(.22,2.27),.025);clamp(.18,2.27);
      // Closed attachment eye, top hook and constant-radius helical spring.
      w.torus(.18,2.16,0,.035,.009,m.polished);w.rod(v(.18,2.23),v(.18,2.19),.01);
      const helix=makeHelix();const coil=w.mesh(helix.geometry,m.polished,.18,2.04,0);coil.name='spring-coil';
      w.wire([[.18,2.125,0],[.22,2.13,0],[.259,2.09,0],[.259,2.04,0]],.009,m.polished);
      const hanger=new T.Group();scene.add(hanger);w.wire([[.079,0,0],[.079,-.035,0],[0,-.075,0],[0,-.13,0]],.009,m.polished,hanger);
      const mass=w.weight(hanger,.115,.25);mass.position.set(0,-.47,0);w.rod(v(0,-.13),v(0,-.145),.012,m.polished,hanger);interact.push(...mass.children);
      const rule=w.ruler(2.08,.12,true,true,100);rule.position.set(.58,1.18,-.02);scene.add(rule);w.cylinder(.58,.1,-.02,.07,.16,m.black);
      for(let i=0;i<4;i++){const weight=w.weight(scene,.055,.09+i*.025);weight.position.set(.85+i*.14,.02,.17);}
      const timer=instrument(.95,.25,-.4,.6,.4);const clock=digital(timer,0,.065,.245,.42,'#91e3df');w.decal('TIMER / s',0,-.09,.247,.32,.045,'#273339','transparent',timer);
      let lastBottom=0;
      update.push((s,p,t)=>{
        const extension=p.mass*9.81/p.k,scale=Math.min(1.85,1.22/(.44+extension+p.amplitude));
        const length=(.44+extension+s.x)*scale;helix.update(length);hanger.position.set(.18,2.04-length,0);clock(t.toFixed(2));
        // A larger suspended load changes the number of brass slotted masses.
        lastBottom=2.04-length;coil.userData.bottom=lastBottom;coil.userData.scale=scale;coil.userData.displacement=s.x;
      });
    }
    if(id==='capacitor'){
      w.base(-.05,.05,2.45,.97);w.box(-.05,.155,.05,2.27,.04,.83,m.ceramic);
      // Breadboard perforations and screw terminals.
      for(let x=0;x<22;x++)for(let z=0;z<5;z++){const hole=w.cylinder(-1.05+x*.095,.178,-.24+z*.13,.009,.004,m.rubber);hole.castShadow=false;}
      w.cylinder(-.55,.55,0,.215,.72,m.blue);w.cylinder(-.55,.916,0,.209,.02,m.steel);w.cylinder(-.55,.193,0,.22,.022,m.rubber);
      for(const x of [-.08,.08])w.rod(v(-.55+x,.92),v(-.55+x,1.02),.013,m.steel);
      w.decal('CAPACITOR',-.55,.66,.217,.31,.055,'#d0d9d9');const capacity=w.decal('470 μF',-.55,.55,.218,.31,.1,'#e6e8da');w.decal('25 V',-.55,.42,.218,.2,.06,'#e6e8da');
      w.rod(v(-.1,.3),v(.7,.3),.012,m.steel);const resistor=w.cylinder(.3,.3,0,.065,.4,m.ceramic);resistor.rotation.z=Math.PI/2;
      const bands=['#aa6032','#1a2226','#c9372d','#af914c'];bands.forEach((color,i)=>{const b=w.cylinder(.16+i*.09,.3,0,.066,.026,new T.MeshStandardMaterial({color,roughness:.45}));b.rotation.z=Math.PI/2;});
      const meter=instrument(.8,.75,-.24,.86,1.12);w.box(0,.05,.235,.73,.9,.025,m.rubber,meter,.035);const voltage=digital(meter,0,.29,.255,.61);w.decal('DC VOLTS',0,.1,.26,.45,.06,'#dce1db','transparent',meter);w.cylinder(0,-.11,.265,.14,.04,m.black,meter).rotation.x=Math.PI/2;w.box(.035,-.075,.29,.016,.08,.01,m.steel,meter);socket(-.2,-.35,.26,m.black,meter);socket(.2,-.35,.26,m.red,meter);
      w.wire([[-.63,1.02,0],[-.7,1.19,.06],[.15,1.35,.18],[1.0,.4,.05]],.021,m.red);
      w.wire([[-.47,1.02,0],[-.24,.97,-.12],[-.2,.27,-.15],[-.1,.3,0]],.016,m.red);
      w.wire([[.7,.3,0],[.55,.2,.48],[-.8,.18,.44],[-.8,.38,0],[-.55,.2,0]],.02,m.rubber);
      w.wire([[-.55,.2,0],[-.92,.25,.1],[-.7,.18,.62],[.4,.2,.57],[.6,.4,.05]],.022,m.rubber);
      w.box(.08,.23,.25,.19,.1,.12,m.black);const toggle=w.rod(v(.08,.28,.25),v(.08,.4,.23),.016,m.steel);w.cylinder(.08,.405,.23,.024,.035,m.rubber);
      let oldCapacity='';update.push((s,p)=>{voltage(s.v.toFixed(2)+' V');toggle.rotation.z=live.current.charging?-.3:.3;const text=p.capacitance+' μF';if(text!==oldCapacity){oldCapacity=text;const map=(capacity.material as T.MeshBasicMaterial).map!,c=map.image as HTMLCanvasElement,ctx=c.getContext('2d')!;ctx.clearRect(0,0,c.width,c.height);ctx.fillStyle='#e6e8da';ctx.font=`500 ${Math.floor(c.height*.6)}px sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,c.width/2,c.height/2,c.width);map.needsUpdate=true;}});
    }
    if(id==='wire'){
      w.box(0,.105,0,3.18,.18,.56,m.oak);w.shadow(0,0,3.5,1);
      const rule=w.ruler(3,.13,true,false,200);rule.position.set(0,.14,.296);scene.add(rule);
      for(const x of [-1.45,1.45]){w.box(x,.24,0,.16,.13,.28,m.black);w.cylinder(x,.47,0,.034,.42,m.steel);w.cylinder(x,.66,0,.065,.1,m.brass);clamp(x,.65);}
      const testWire=w.rod(v(-1.45,.68),v(1.45,.68),.004,m.brass);const contact=new T.Group();scene.add(contact);
      w.box(0,.53,0,.115,.22,.2,m.red,contact,.025);w.cylinder(0,.69,0,.026,.1,m.steel,contact);w.screw(0,.56,.108,contact);w.cylinder(0,.3,0,.024,.3,m.steel,contact);
      const cable=w.wire([[0,.5,.1],[.1,.22,.4],[.6,.1,.6],[.6,.47,-.4]],.018,m.red);let lastContact=NaN;interact.push(contact.children[0]);
      const supply=instrument(.3,.59,-.69,1.16,.79);const display=digital(supply,0,.17,.245,.89,'#ff6548');w.decal('REGULATED DC SUPPLY',0,.32,.246,.86,.038,'#ccd0c8','transparent',supply);w.cylinder(-.27,-.12,.25,.08,.04,m.black,supply).rotation.x=Math.PI/2;w.cylinder(.02,-.12,.25,.06,.04,m.black,supply).rotation.x=Math.PI/2;socket(.3,-.12,.26,m.red,supply);socket(.43,-.12,.26,m.black,supply);
      w.wire([[-1.45,.65,0],[-1.75,.3,.15],[-1.35,.04,.55],[.73,.12,.5],[.73,.47,-.4]],.019,m.rubber);
      update.push((s,p)=>{contact.position.x=-1.45+p.length/2*2.9;testWire.scale.x=testWire.scale.z=p.diameter/.5;display(p.voltage.toFixed(2)+'V '+s.current.toFixed(2)+'A');if(contact.position.x!==lastContact){lastContact=contact.position.x;cable.geometry.dispose();cable.geometry=new T.TubeGeometry(new T.CatmullRomCurve3([v(lastContact,.5,.1),v(lastContact+.12,.2,.4),v(.8,.06,.68),v(1.1,.18,.32),v(.6,.47,-.4)]),80,.018,12,false);}});
    }
    if(id==='rule'){
      w.base(0,0,1.05,.6);w.box(0,.76,0,.16,1.25,.18,m.black);w.rod(v(0,.22,-.12),v(0,1.47,-.12),.022,m.steel);w.cylinder(0,1.43,0,.067,.26,m.steel).rotation.x=Math.PI/2;
      const beam=new T.Group();beam.position.set(0,1.46,0);scene.add(beam);const rule=w.ruler(3.25,.19,false,false);beam.add(rule);
      const load=new T.Group();beam.add(load);w.torus(0,-.06,0,.035,.007,m.steel,load);w.rod(v(0,-.095),v(0,-.23),.008,m.steel,load);const mass=w.weight(load,.105,.22);mass.position.y=-.52;interact.push(...mass.children);
      for(let i=0;i<3;i++){const spare=w.weight(scene,.06,.11+i*.035);spare.position.set(1.1+i*.16,.02,.2);}
      update.push((s,p)=>{beam.rotation.z=-s.angle;const offset=(50-p.pivot)/100*3.25;beam.position.set(offset*Math.cos(beam.rotation.z),1.46+offset*Math.sin(beam.rotation.z),0);load.position.set((p.position-50)/100*3.25,-.1,0);load.rotation.z=-beam.rotation.z;mass.scale.y=.7+p.mass/150;mass.position.y=-.23-.325*mass.scale.y;});
    }
    if(id==='sphere'){
      w.base(0,0,3.6,.82);const track=new T.Group();scene.add(track);
      // A continuous rolling surface preserves the solid-sphere model; side lips guide the ball.
      w.box(0,-.026,0,3.05,.03,.4,m.steel,track,.01);for(const z of [-.21,.21])w.box(0,0,z,3.05,.055,.035,m.steel,track,.014);
      for(let i=0;i<7;i++)w.box(-1.43+i*.47,-.035,0,.045,.035,.26,m.black,track,.008);
      const supports=[-1.32,1.32].map(x=>{w.cylinder(x,.2,0,.065,.12,m.black);return w.cylinder(x,.5,0,.026,.7,m.steel);});
      const ball=w.mesh(new T.SphereGeometry(.13,80,48),m.polished);interact.push(ball);const dot=w.mesh(new T.SphereGeometry(.012,16,12),m.black,0,0,0,ball);dot.position.set(0,0,.13);
      const rule=w.ruler(3.1,.11,true);rule.position.set(0,.15,.43);scene.add(rule);
      update.push((s,p)=>{const angle=p.angle*Math.PI/180,center=.31+1.5*Math.sin(angle);track.position.y=center;track.rotation.z=-angle;const r=p.radius/100*5.5,local=-1.5+3*s.x/p.distance;ball.scale.setScalar(r/.13);ball.position.set(local*Math.cos(angle)+r*Math.sin(angle),center-local*Math.sin(angle)+r*Math.cos(angle)+.02,0);ball.rotation.z=-s.x/(p.radius/100);supports.forEach((post,i)=>{const x=i===0?-1.32:1.32,y=center-x*Math.tan(angle)-.035;post.scale.y=(y-.18)/.7;post.position.y=(y+.18)/2;});});
    }
    if(id==='papers'){
      w.base(0,0,1.65,.94);const glass=new T.MeshPhysicalMaterial({color:'#d1e6ec',roughness:.08,metalness:0,transparent:true,opacity:.09,side:T.DoubleSide,depthWrite:false,clearcoat:1});
      w.mesh(new T.CylinderGeometry(.68,.68,2.45,80,1,true),glass,0,1.375,0);for(const y of [.16,2.59])w.torus(0,y,0,.685,.009,m.polished).rotation.x=Math.PI/2;
      for(const x of [-.7,.7])w.rod(v(x,.15,-.16),v(x,2.6,-.16),.014,m.steel);
      const rule=w.ruler(2.46,.13,true,true,200);rule.position.set(.87,1.37,.02);scene.add(rule);
      const stack=new T.Group();scene.add(stack);for(let i=0;i<10;i++){const disk=w.mesh(new T.CylinderGeometry(.285,.285,.004,80),m.paper,0,i*.005,0,stack);disk.rotation.z=.09;}
      interact.push(...stack.children);const sensor=instrument(-1.0,.36,-.15,.38,.48);const clock=digital(sensor,0,.09,.245,.27,'#9de3cf');w.decal('PHOTO GATE',0,-.1,.246,.28,.05,'#d0d6d6','transparent',sensor);w.wire([[-.85,.17,-.12],[-1.0,.07,.3],[-1.4,.015,.4],[-1.8,.015,.2]],.014,m.rubber);
      update.push((s,p,t)=>{stack.position.y=.15+1.225*(p.height-s.x);stack.children.forEach((c,i)=>c.visible=i<p.count);stack.scale.x=stack.scale.z=p.radius/3;clock(t.toFixed(2));});
    }
    // Ray-plane dragging follows world coordinates even after orbiting or zooming.
    const ray=new T.Raycaster(),mouse=new T.Vector2(),plane=new T.Plane(new T.Vector3(0,0,1),0),grab=new T.Vector3(),point=new T.Vector3();let dragging=false,startValue=0;
    const project=(e:PointerEvent)=>{const rect=renderer.domElement.getBoundingClientRect();mouse.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);ray.setFromCamera(mouse,camera);return ray.ray.intersectPlane(plane,point);};
    const down=(e:PointerEvent)=>{project(e);if(!ray.intersectObjects(interact,true).length)return;dragging=true;grab.copy(point);startValue=live.current.p.amplitude??0;orbit.enabled=false;renderer.domElement.setPointerCapture(e.pointerId);host.classList.add('is-dragging');};
    const move=(e:PointerEvent)=>{if(!dragging||!project(e))return;const params=live.current.p;
      if(id==='springs'){const extension=params.mass*9.81/params.k,scale=Math.min(1.85,1.22/(.44+extension+params.amplitude));onAdjust('amplitude',Math.max(.01,Math.min(.15,startValue+(grab.y-point.y)/scale)));}
      if(id==='wire')onAdjust('length',Math.max(.1,Math.min(2,(point.x+1.45)/2.9*2)));
      if(id==='rule'){const s=solve('rule',params,0),angle=-s.angle,x=(point.x*Math.cos(angle)+(point.y-1.46)*Math.sin(angle));onAdjust('position',Math.max(0,Math.min(100,params.pivot+x/3.25*100)));}
    };
    const up=()=>{const release=dragging;dragging=false;orbit.enabled=true;host.classList.remove('is-dragging');if(release&&['springs','sphere','papers'].includes(id))live.current.onRelease();};
    const canvas=renderer.domElement;canvas.addEventListener('pointerdown',down,{capture:true});canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',()=>{dragging=false;orbit.enabled=true;host.classList.remove('is-dragging');});
    let frame=0,dirty=true,lastSignature='',renders=0;
    const invalidate=()=>{dirty=true};orbit.addEventListener('change',invalidate);
    const render=()=>{const {p,time,charging}=live.current,signature=JSON.stringify([p,time,charging]);orbit.update();if(dirty||signature!==lastSignature){const s=solve(id,p,time,charging);for(const fn of update)fn(s,p,time);renderer.render(scene,camera);canvas.dataset.sceneRenders=String(++renders);canvas.dataset.cameraPose=JSON.stringify([...camera.position.toArray(),...orbit.target.toArray()]);lastSignature=signature;dirty=false;}frame=requestAnimationFrame(render);};
    const resize=()=>{renderer.setSize(host.clientWidth,host.clientHeight);camera.aspect=host.clientWidth/host.clientHeight;camera.updateProjectionMatrix();dirty=true;};const observer=new ResizeObserver(resize);observer.observe(host);resize();render();
    return()=>{cancelAnimationFrame(frame);observer.disconnect();orbit.dispose();const geometries=new Set<T.BufferGeometry>(),materials=new Set<T.Material>(),textures=new Set<T.Texture>();scene.traverse(o=>{if(o instanceof T.Mesh){geometries.add(o.geometry);for(const material of Array.isArray(o.material)?o.material:[o.material])materials.add(material);}});for(const material of Object.values(m))materials.add(material);for(const material of materials){for(const value of Object.values(material))if(value instanceof T.Texture)textures.add(value);material.dispose();}geometries.forEach(g=>g.dispose());textures.forEach(t=>t.dispose());environment.dispose();room.dispose();pm.dispose();renderer.dispose();host.replaceChildren();};
  },[id,onAdjust]);
  return <div className="pr-apparatus" ref={el} role="img" aria-label={`Interactive 3D ${id} apparatus. Drag to orbit; scroll to zoom.`}>{failed&&<div className="pr-fallback">3D rendering is unavailable. Controls, measurements and analysis remain available.</div>}</div>;
}

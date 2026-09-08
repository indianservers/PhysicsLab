import { useEffect, useRef } from "react";
import * as THREE from "three";

interface Props {
  values: [number, number];
  playing: boolean;
  reducedMotion: boolean;
}

type SceneState = { values: [number, number]; playing: boolean; reducedMotion: boolean };

export function StringTheoryThreeScene({ values, playing, reducedMotion }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<SceneState>({ values, playing, reducedMotion });
  useEffect(() => { stateRef.current = { values, playing, reducedMotion }; }, [values, playing, reducedMotion]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    } catch {
      host.innerHTML = "<p>Interactive 3D model requires WebGL.</p>";
      return;
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    host.replaceChildren(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x02090e, 0.035);
    const camera = new THREE.PerspectiveCamera(37, 1, 0.1, 100);
    const root = new THREE.Group();
    scene.add(root);
    scene.add(new THREE.HemisphereLight(0x9be9ff, 0x031018, 1.45));
    const cyan = new THREE.PointLight(0x38d8ff, 24, 18); cyan.position.set(-3, 1, 4); scene.add(cyan);
    const amber = new THREE.PointLight(0xffa62e, 18, 15); amber.position.set(3, 3, 3); scene.add(amber);

    const tiers = buildScaleModel(root);
    const initialIndex = clamp(Math.round((-values[0]-5)/30*3),0,3);
    const focusHeights = [.72,.24,-.28,-.78];
    const orbit = { theta: 0.06, phi: 1.42, radius: 14.2, targetY: focusHeights[initialIndex] };
    const updateCamera = () => {
      const target = new THREE.Vector3(0, orbit.targetY, 0);
      camera.position.setFromSpherical(new THREE.Spherical(orbit.radius, orbit.phi, orbit.theta)).add(target);
      camera.lookAt(target);
    };
    updateCamera();

    let dragging = false, lastX = 0, lastY = 0;
    const down = (event: PointerEvent) => { dragging = true; lastX = event.clientX; lastY = event.clientY; host.setPointerCapture(event.pointerId); };
    const move = (event: PointerEvent) => { if (!dragging) return; orbit.theta -= (event.clientX-lastX)*.005; orbit.phi = clamp(orbit.phi+(event.clientY-lastY)*.003, .75, 2.15); lastX=event.clientX; lastY=event.clientY; updateCamera(); };
    const up = (event: PointerEvent) => { dragging=false; try { host.releasePointerCapture(event.pointerId); } catch { /* no-op */ } };
    const wheel = (event: WheelEvent) => { event.preventDefault(); orbit.radius=clamp(orbit.radius+event.deltaY*.008,7.5,18); updateCamera(); };
    const key = (event: KeyboardEvent) => { if(event.key.startsWith("Arrow"))event.preventDefault(); if(event.key==="ArrowLeft")orbit.theta-=.12; if(event.key==="ArrowRight")orbit.theta+=.12; if(event.key==="ArrowUp")orbit.radius=clamp(orbit.radius-.6,7.5,18); if(event.key==="ArrowDown")orbit.radius=clamp(orbit.radius+.6,7.5,18); if(event.key==="0"){orbit.theta=.06;orbit.phi=1.42;orbit.radius=14.2;orbit.targetY=focusHeights[initialIndex];} updateCamera(); };
    host.addEventListener("pointerdown",down); host.addEventListener("pointermove",move); host.addEventListener("pointerup",up); host.addEventListener("pointercancel",up); host.addEventListener("wheel",wheel,{passive:false}); host.addEventListener("keydown",key);

    const resize=()=>{const r=host.getBoundingClientRect();renderer.setSize(Math.max(1,r.width),Math.max(1,r.height),false);camera.aspect=r.width/Math.max(1,r.height);camera.updateProjectionMatrix();};
    const observer=new ResizeObserver(resize);observer.observe(host);resize();
    const timer=new THREE.Timer();timer.connect(document);let raf=0;
    const animate=()=>{
      timer.update();const t=timer.getElapsed(),state=stateRef.current;
      const scaleIndex=clamp(Math.round((-state.values[0]-5)/30*3),0,3);
      // Focus the selected tier without panning the rest of the hierarchy out
      // of view. Students retain spatial context while inspecting one scale.
      orbit.targetY=THREE.MathUtils.lerp(orbit.targetY,focusHeights[scaleIndex],.045);
      tiers.forEach((tier,index)=>{
        const active=index===scaleIndex;
        tier.group.scale.setScalar(THREE.MathUtils.lerp(tier.group.scale.x,active?1.2:.88,.06));
        tier.ring.material.opacity=THREE.MathUtils.lerp(tier.ring.material.opacity,active?.95:.32,.07);
        if(state.playing&&!state.reducedMotion){tier.group.rotation.y+=.003+index*.0015;tier.orbiters.forEach((g,i)=>g.rotation.y+=.012+i*.006);}
      });
      updateCamera(); renderer.render(scene,camera); raf=requestAnimationFrame(animate);
    };animate();
    return()=>{cancelAnimationFrame(raf);timer.dispose();observer.disconnect();host.removeEventListener("pointerdown",down);host.removeEventListener("pointermove",move);host.removeEventListener("pointerup",up);host.removeEventListener("pointercancel",up);host.removeEventListener("wheel",wheel);host.removeEventListener("keydown",key);root.traverse(o=>{const m=o as THREE.Mesh;if(m.geometry)m.geometry.dispose();const mat=m.material as THREE.Material|THREE.Material[]|undefined;if(Array.isArray(mat))mat.forEach(x=>x.dispose());else mat?.dispose();});renderer.dispose();host.replaceChildren();};
  },[]);

  return <div className="st-three-scene" ref={hostRef} role="application" tabIndex={0} aria-label="Interactive three-dimensional atomic hierarchy. Drag to rotate, use the wheel or arrow keys to zoom, and press zero to reset the view."/>;
}

type Tier={group:THREE.Group;ring:THREE.Line<THREE.BufferGeometry,THREE.LineBasicMaterial>;orbiters:THREE.Group[]};
function buildScaleModel(root:THREE.Group):Tier[]{
  const tiers:Tier[]=[]; const ys=[3.25,1.05,-1.2,-3.45]; const sizes=[1.05,.9,.78,1.15];
  const cone=new THREE.Mesh(new THREE.ConeGeometry(3.7,8.8,72,1,true),new THREE.MeshBasicMaterial({color:0x39cfff,transparent:true,opacity:.045,side:THREE.DoubleSide,wireframe:true}));cone.position.y=-.1;root.add(cone);
  ys.forEach((y,index)=>{const group=new THREE.Group();group.position.y=y;root.add(group);const ring=ellipseRing(index===3?0xffb43d:0x66ddff,1.42+index*.18,.34+index*.03);group.add(ring);const orbiters:THREE.Group[]=[];
    if(index===0){addNucleus(group,.32,12);for(let i=0;i<3;i++){const g=new THREE.Group();g.rotation.set(i*.72,.3+i*.47,i*.92);g.add(ellipseRing(0xbceeff,.88,.42));const e=sphere(.075,0xbfeeff);e.position.x=.88;g.add(e);group.add(g);orbiters.push(g);}}
    else if(index===1)addNucleus(group,.55,34);
    else if(index===2){const quarks:Array<[number,number,number,number]>=[[0,.32,0,0xff4b57],[-.34,-.18,.12,0x4ee58f],[.34,-.18,-.12,0x3dbdff]];quarks.forEach(([x,z,y2,c])=>{const q=sphere(.23,c);q.position.set(x,y2,z);group.add(q);});}
    else {for(let k=0;k<6;k++){const curve=new THREE.CatmullRomCurve3(Array.from({length:65},(_,i)=>{const a=i/64*Math.PI*2;return new THREE.Vector3(Math.cos(a)*(1.15+.17*Math.sin(a*3+k)),Math.sin(a*2+k)*.2,Math.sin(a)*(1.15+.17*Math.cos(a*4+k)));}),true);const tube=new THREE.Mesh(new THREE.TubeGeometry(curve,100,.018,6,true),new THREE.MeshStandardMaterial({color:k%2?0xffb43d:0x6eeaff,emissive:k%2?0xa34d00:0x087e9f,emissiveIntensity:2}));tube.rotation.y=k*Math.PI/3;group.add(tube);}}
    group.scale.setScalar(sizes[index]);tiers.push({group,ring,orbiters});
  });
  return tiers;
}
function addNucleus(group:THREE.Group,r:number,count:number){for(let i=0;i<count;i++){const a=i*2.399963,rr=r*Math.cbrt((i+.5)/count),p=Math.acos(1-2*(i+.5)/count);const n=sphere(.13,i%2?0x2f9fe8:0xee4959);n.position.set(Math.sin(p)*Math.cos(a)*rr,Math.cos(p)*rr,Math.sin(p)*Math.sin(a)*rr);group.add(n);}}
function sphere(radius:number,color:number){return new THREE.Mesh(new THREE.SphereGeometry(radius,24,16),new THREE.MeshStandardMaterial({color,emissive:color,emissiveIntensity:.38,roughness:.24,metalness:.12}));}
function ellipseRing(color:number,rx:number,ry:number){const points=Array.from({length:129},(_,i)=>{const a=i/128*Math.PI*2;return new THREE.Vector3(Math.cos(a)*rx,0,Math.sin(a)*rx*ry);});return new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color,transparent:true,opacity:.5}));}
function clamp(v:number,min:number,max:number){return Math.min(max,Math.max(min,v));}

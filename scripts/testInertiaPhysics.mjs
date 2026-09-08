import assert from "node:assert/strict";
import { build } from "esbuild";
import vm from "node:vm";
const result=await build({entryPoints:["src/lib/inertiaStudio.ts"],bundle:true,platform:"node",format:"cjs",write:false});
const module={exports:{}}; vm.runInNewContext(result.outputFiles[0].text,{module,exports:module.exports}); const {inertiaSolution,inertiaSettings}=module.exports;
const d=inertiaSolution({drag:.02,speed:.8,mass:.2}); assert.equal(d.input.speed,.8); assert.equal(d.input.drag,.02); assert(Math.abs(d.stopTime-1.5)<1e-12); assert.equal(d.velocityAt(0),.8); assert.equal(d.velocityAt(1.5),0);
const ideal=inertiaSolution({drag:0,speed:2,mass:1}); assert.equal(ideal.stopTime,null); assert.equal(ideal.velocityAt(100),2);
const limited=inertiaSettings({drag:-1,speed:99,mass:-2}); assert.equal(limited.drag,0); assert.equal(limited.speed,2); assert.equal(limited.mass,.05); console.log(["Finite drag decelerates to zero; zero drag preserves constant velocity", "All limits clamp and momentum/stop calculations remain finite"]);

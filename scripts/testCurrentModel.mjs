import{build}from'esbuild';import assert from'node:assert/strict';import{writeFile}from'node:fs/promises';
const code=await build({entryPoints:['src/lib/currentStudio.ts'],bundle:true,write:false,format:'esm',platform:'node'}),m=await import('data:text/javascript;base64,'+Buffer.from(code.outputFiles[0].text).toString('base64'));
const near=(a,b,t=1e-11)=>assert.ok(Math.abs(a-b)<=t*Math.max(1e-30,Math.abs(a),Math.abs(b)),`${a} != ${b}`);let configurations=0,curvePoints=0,maxPowerBalanceError=0;
for(const voltage of[0,.1,1,5,12])for(const diameter of[.1,.25,.5,1,2])for(const temperature of[0,20,50,100,200]){
 const input={voltage,diameter,temperature},s=m.currentSolution(input),A=Math.PI*(diameter*.001)**2/4,rho=1.68e-8*(1+.0039*(temperature-20)),R=rho*186/A,I=voltage/R,J=voltage/(rho*186),vd=J/(8.5e28*1.602176634e-19);configurations++;near(s.A,A);near(s.rho,rho);near(s.R,R);near(s.I,I);near(s.J,J);near(s.vd,vd);near(s.E,rho*J);near(s.power,I*I*R);maxPowerBalanceError=Math.max(maxPowerBalanceError,Math.abs(s.power-I*I*R));
 for(const p of m.currentCurve(input)){near(p.current,p.voltage/R);curvePoints++}if(voltage===0){assert.equal(s.I,0);assert.equal(s.vd,0)}
 if(diameter<=1){const twice=m.currentSolution({...input,diameter:diameter*2});near(twice.R,s.R/4);near(twice.I,s.I*4);near(twice.J,s.J);near(twice.vd,s.vd)}
}
const def=m.currentSolution(m.CURRENT_DEFAULTS);near(def.R,15.914475717553747,1e-10);assert.deepEqual(m.currentSettings({voltage:Infinity,diameter:NaN,temperature:-100}),{voltage:5,diameter:.5,temperature:0});
const clocks=[];for(const fps of[10,30,60,144]){let d=0;for(let i=0;i<fps*3;i++)d=m.currentAdvance(d,def.vd,1/fps);near(d,def.vd*3);clocks.push({fps,displacement:d})}
const x=m.currentElectronX(8,0),after=m.currentElectronX(8,def.vd*.1);near(after-x,-def.vd*.1*1200);assert.equal(m.currentElectronX(3,0),m.currentElectronX(3,m.currentAdvance(0,0,100)));for(let i=0;i<100;i++)for(const d of[0,1,100]){const x=m.currentElectronX(i,d);assert.ok(x>=-1.7&&x<1.7)}
const result={passed:true,configurations,curvePoints,maxPowerBalanceError,default:def,clocks,diameterSquaredScaling:true,currentDensityIndependentOfDiameterAtFixedVoltage:true,zeroVoltageNoDrift:true,driftOpposesConventionalCurrent:true,SIUnits:true,linearTemperatureApproximation:true};await writeFile('artifacts/physics-studio-audit/current/model-verification.json',JSON.stringify(result,null,2));console.log(result);


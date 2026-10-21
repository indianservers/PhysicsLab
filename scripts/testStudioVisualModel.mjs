import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import {build} from 'esbuild';
import {chromium} from 'playwright-core';

const bundle=await build({stdin:{resolveDir:process.cwd(),loader:'tsx',contents:`
import React,{useState} from 'react';import {createRoot} from 'react-dom/client';import {BrowserRouter} from 'react-router-dom';
import {useStudioVisualModel,useStudioVisualFrame,readStudioVisualFrame} from './src/lib/studioVisualModel';
function Lab(){const [input,setInput]=useState({x:2}),[camera,setCamera]=useState('top'),[time,setTime]=useState(3),[running,setRunning]=useState(false);
useStudioVisualModel({route:'/test',input,outputs:{s:{y:input.x**2,pole:Infinity,branch:'real'}},apply:p=>setInput(v=>({...v,...p})),scene:{camera,time,running},sceneSetters:{camera:setCamera,time:value=>{setRunning(false);setTime(value)},running:setRunning}});
return <><button onClick={()=>readStudioVisualFrame('/test')?.applyInput({x:5,unknown:20})}>Replay</button><button onClick={()=>readStudioVisualFrame('/test')?.applyScene({running:true,camera:'side',time:8})}>Change scene</button><button onClick={()=>readStudioVisualFrame('/test')?.resetView()}>Reset view</button></>}
function Inspector(){const frame=useStudioVisualFrame('/test');return <output>{frame?JSON.stringify(frame):''}</output>}
createRoot(document.getElementById('root')).render(<React.StrictMode><BrowserRouter><Lab/><Inspector/></BrowserRouter></React.StrictMode>);
`},bundle:true,write:false,format:'iife',jsx:'automatic',define:{'process.env.NODE_ENV':'"development"'}});
const server=http.createServer((_,res)=>res.end('<div id="root"></div>'));await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
try{
 const page=await browser.newPage(),base=`http://127.0.0.1:${server.address().port}`;
 const setup=async query=>{await page.goto(base+'/test'+query);await page.addScriptTag({content:bundle.outputFiles[0].text});await page.waitForFunction(()=>!!document.querySelector('output')?.textContent);};
 const frame=async()=>JSON.parse(await page.locator('output').innerText());
 await setup('');assert.equal((await frame()).quantities['s.y'],4,'StrictMode remount must republish the solver frame');
 assert.equal((await frame()).quantities['s.pole'],null,'Nonfinite values remain undefined');
 await page.getByRole('button',{name:'Replay',exact:true}).click();assert.deepEqual((await frame()).input,{x:5});assert.equal((await frame()).quantities['s.y'],25);
 await page.getByRole('button',{name:'Change scene',exact:true}).click();await page.getByRole('button',{name:'Reset view',exact:true}).click();
 assert.deepEqual((await frame()).scene,{camera:'top',time:8,running:true},'View reset preserves the physical clock and running state');assert.equal((await frame()).input.x,5);
 const assignment=Buffer.from(JSON.stringify({id:'visual-lock-test',experimentId:'test',title:'Locked lab',lockVariables:true})).toString('base64url');
 await setup('?assignmentData='+assignment);assert.equal((await frame()).locked,true);await page.getByRole('button',{name:'Replay',exact:true}).click();assert.equal((await frame()).input.x,2,'Locked assignment cannot replay parameters');
 const result={status:'pass',checks:['StrictMode republish','nonfinite solver output','exact replay','unknown input rejected','playback restoration follows clock restoration','view reset preserves clock and physics','assignment lock respected']};
 fs.writeFileSync('artifacts/studio-ux-audit/visual-adapter-tests.json',JSON.stringify(result,null,2));console.log('7 visual adapter lifecycle, replay and lock checks passed.');
}finally{await browser.close();server.close();}

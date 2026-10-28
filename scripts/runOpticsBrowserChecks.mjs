import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import {spawn} from 'node:child_process';

const build=path.resolve('artifacts/studio-physics-audit/browser-build'),assets=path.resolve('public');
const server=http.createServer((request,response)=>{
 const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname);
 const file=[build,assets].map(base=>path.resolve(base,'.'+pathname)).find(p=>(p.startsWith(build+path.sep)||p.startsWith(assets+path.sep))&&fs.existsSync(p)&&fs.statSync(p).isFile())??path.join(build,'index.html');
 const types={'.js':'text/javascript','.html':'text/html','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2'};
 response.setHeader('Content-Type',types[path.extname(file)]??'application/octet-stream');fs.createReadStream(file).pipe(response);
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
try{
 for(const script of ['scripts/checkOpticalElementsBrowser.mjs','scripts/checkOpticsEnhancements.mjs']){
  const code=await new Promise((resolve,reject)=>{const child=spawn(process.execPath,[script],{stdio:'inherit',env:{...process.env,OPTICS_TEST_URL:`http://127.0.0.1:${server.address().port}`,OPTICS_BROWSER_PATH:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'}});child.on('error',reject);child.on('close',resolve)});
  if(code!==0)throw Error(`${script} failed (${code})`);
 }
}finally{server.close();}

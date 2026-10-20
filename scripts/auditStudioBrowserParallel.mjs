import { spawn } from 'node:child_process';
import fs from 'node:fs';
const resultRoot='artifacts/studio-physics-audit';
await Promise.all([0,32,64].map(skip=>new Promise((resolve,reject)=>{
 const child=spawn(process.execPath,['scripts/auditStudioBrowser.mjs'],{env:{...process.env,STUDIO_AUDIT_SKIP:String(skip),STUDIO_AUDIT_LIMIT:'32'},stdio:['ignore','pipe','pipe']});
 child.stdout.on('data',chunk=>process.stdout.write(chunk));
 child.stderr.on('data',chunk=>process.stderr.write(chunk));
 child.on('error',reject);child.on('close',code=>resolve(code));
})));
const results=[0,32,64].flatMap(skip=>JSON.parse(fs.readFileSync(`${resultRoot}/browser-results-${skip}.json`,'utf8')).results);
fs.writeFileSync(`${resultRoot}/browser-results.json`,JSON.stringify({routes:96,results},null,2)+'\n');
const failed=results.filter(item=>item.status==='fail');
console.log(`Combined browser audit: ${results.length-failed.length}/${results.length} checks passed.`);
if(failed.length)process.exitCode=1;

import { build } from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

const reuseCss=process.env.STUDIO_AUDIT_REUSE_CSS==='1';
if(reuseCss&&!fs.existsSync('artifacts/studio-physics-audit/browser-build/main.css'))throw Error('Build CSS once before reusing it');
const result=await build({
 write:!reuseCss,
 entryPoints:['src/main.tsx'],outdir:'artifacts/studio-physics-audit/browser-build',bundle:true,splitting:true,format:'esm',target:'es2022',
 loader:{'.woff2':'file','.woff':'file','.ttf':'file'},
 external:['/assets/*'],
 define:{'import.meta.env.PROD':'true','import.meta.env.DEV':'false','process.env.NODE_ENV':JSON.stringify('production')},
 plugins:[{name:'audit-pwa',setup(builder){
  builder.onResolve({filter:/^virtual:pwa-register$/},()=>({path:'pwa',namespace:'audit'}));
  builder.onLoad({filter:/.*/,namespace:'audit'},()=>({contents:'export const registerSW = () => async () => {};'}));
  builder.onLoad({filter:/\.css$/},async args=>{
   if(reuseCss)return {contents:'',loader:'css',resolveDir:path.dirname(args.path)};
   const source=fs.readFileSync(args.path,'utf8');
   const contents=/@(?:tailwind|apply)\b/.test(source)?(await postcss([tailwindcss(),autoprefixer()]).process(source,{from:args.path})).css:source;
   return {contents,loader:'css',resolveDir:path.dirname(args.path)};
  });
 }}],logLevel:'warning',
});
if(reuseCss)for(const file of result.outputFiles??[]){if(file.path.endsWith('.css'))continue;fs.mkdirSync(path.dirname(file.path),{recursive:true});fs.writeFileSync(file.path,file.contents);}
fs.copyFileSync('src/components/studio-lab-workspace.css','artifacts/studio-physics-audit/browser-build/studio-ux-latest.css');
fs.copyFileSync('src/components/studio-visual-explorer.css','artifacts/studio-physics-audit/browser-build/studio-visual-latest.css');
for(const [src,name]of [['src/practicals/practicals.css','practical-latest.css'],['src/pages/optical-elements.css','optical-latest.css']])fs.copyFileSync(src,'artifacts/studio-physics-audit/browser-build/'+name);
fs.writeFileSync('artifacts/studio-physics-audit/browser-build/index.html','<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="/main.css"><link rel="stylesheet" href="/studio-ux-latest.css"><link rel="stylesheet" href="/studio-visual-latest.css"><link rel="stylesheet" href="/practical-latest.css"><link rel="stylesheet" href="/optical-latest.css"></head><body><div id="root"></div><script type="module" src="/main.js"></script></body></html>');
console.log('Built isolated browser audit bundle (service worker disabled).');

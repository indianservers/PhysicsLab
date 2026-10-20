import { build } from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

await build({
 entryPoints:['src/main.tsx'],outdir:'artifacts/studio-physics-audit/browser-build',bundle:true,splitting:true,format:'esm',target:'es2022',
 loader:{'.woff2':'file','.woff':'file','.ttf':'file'},
 external:['/assets/*'],
 define:{'import.meta.env.PROD':'true','import.meta.env.DEV':'false','process.env.NODE_ENV':JSON.stringify('production')},
 plugins:[{name:'audit-pwa',setup(builder){
  builder.onResolve({filter:/^virtual:pwa-register$/},()=>({path:'pwa',namespace:'audit'}));
  builder.onLoad({filter:/.*/,namespace:'audit'},()=>({contents:'export const registerSW = () => async () => {};'}));
  builder.onLoad({filter:/\.css$/},async args=>{
   const source=fs.readFileSync(args.path,'utf8');
   const contents=/@(?:tailwind|apply)\b/.test(source)?(await postcss([tailwindcss(),autoprefixer()]).process(source,{from:args.path})).css:source;
   return {contents,loader:'css',resolveDir:path.dirname(args.path)};
  });
 }}],logLevel:'warning',
});
fs.writeFileSync('artifacts/studio-physics-audit/browser-build/index.html','<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="/main.css"></head><body><div id="root"></div><script type="module" src="/main.js"></script></body></html>');
console.log('Built isolated browser audit bundle (service worker disabled).');

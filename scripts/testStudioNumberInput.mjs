import assert from 'node:assert/strict';
import fs from 'node:fs';
import {build} from 'esbuild';
import {chromium} from 'playwright-core';
const bundle=await build({stdin:{contents:`import {useState} from 'react';import {createRoot} from 'react-dom/client';import {NumberInput} from './src/components/NumberInput';function Test(){const [value,setValue]=useState(.25);return <><NumberInput aria-label="Physical constant" min={0} max={1} step={.1} value={value} onChange={e=>setValue(Number(e.target.value))}/><output>{value}</output><button>Commit edit</button></>};createRoot(document.getElementById('root')).render(<Test/>);`,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,format:'iife',jsx:'automatic',define:{'process.env.NODE_ENV':'"production"'}});
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
try{
 const page=await browser.newPage();await page.setContent('<div id="root"></div>');await page.addScriptTag({content:bundle.outputFiles[0].text});
 const field=page.getByRole('spinbutton',{name:'Physical constant'}),output=page.locator('output'),commit=page.getByRole('button',{name:'Commit edit'});
 await field.fill('0.35');assert.equal(await output.innerText(),'0.35');await commit.click();assert.equal(await field.inputValue(),'0.35');
 await field.fill('');assert.equal(await output.innerText(),'0.35');await commit.click();assert.equal(await field.inputValue(),'0.35');
 await field.fill('2');assert.equal(await output.innerText(),'0.35');await commit.click();assert.equal(await output.innerText(),'1');
 await field.fill('-1');assert.equal(await output.innerText(),'1');await commit.click();assert.equal(await output.innerText(),'0');
 const results={status:'pass',checks:['accepts values between step increments','blur preserves physical value','empty draft preserves model','empty blur restores previous value','upper bound clamps on blur','lower bound clamps on blur']};
 fs.mkdirSync('artifacts/studio-ux-audit',{recursive:true});fs.writeFileSync('artifacts/studio-ux-audit/number-input.json',JSON.stringify(results,null,2));console.log('6 numeric-input interaction assertions passed.');
}finally{await browser.close()}

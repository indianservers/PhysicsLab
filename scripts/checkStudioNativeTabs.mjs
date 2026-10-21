import assert from 'node:assert/strict';

/** Exercise every authored apparatus tab group, including theory/graph subviews. */
export async function checkStudioNativeTabs(page) {
 const groups=page.locator('[role="tablist"]');
 const checked=[];
 for(let groupIndex=0;groupIndex<await groups.count();groupIndex++){
  const group=groups.nth(groupIndex),tabs=group.getByRole('tab');
  if(!await group.isVisible())continue;
  const original=await tabs.evaluateAll(nodes=>nodes.findIndex(n=>n.getAttribute('aria-selected')==='true'));
  const count=await tabs.count(),labels=[];
  for(let i=0;i<count;i++){
   const tab=tabs.nth(i);if(!await tab.isVisible()||await tab.isDisabled())continue;
   const label=(await tab.innerText()).trim();await tab.scrollIntoViewIfNeeded();await tab.click();
   assert.equal(await tab.getAttribute('aria-selected'),'true',`${label} must become selected`);
   assert.equal(await group.locator('[role="tab"][aria-selected="true"]').count(),1,'A tab group has exactly one selected tab');
   const target=await tab.getAttribute('aria-controls');
   if(target){const panel=page.locator(`[id=${JSON.stringify(target)}]`);await panel.waitFor({state:'visible'});assert.ok((await panel.innerText()).trim().length>0||await panel.locator('svg,canvas,img').count()>0,`${label} panel has content`);}
   if(count>1){
    const next=tabs.nth((i+1)%count);
    if(await next.isEnabled()){await tab.focus();await page.keyboard.press('ArrowRight');assert.equal(await next.getAttribute('aria-selected'),'true',`${label}: ArrowRight selects the next native tab`);assert.equal(await next.evaluate(n=>n===document.activeElement),true,'Native tab navigation moves focus');}
   }
   labels.push(label);
  }
  if(original>=0&&await tabs.nth(original).isVisible())await tabs.nth(original).click();
  checked.push({group:await group.getAttribute('aria-label'),tabs:labels});
 }
 return checked;
}

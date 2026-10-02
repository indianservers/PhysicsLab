import {lazy,Suspense} from 'react';
import type {DedicatedExperimentLabProps} from '../shared/experimentRegistry';
const Lab=lazy(()=>import('./ElasticCollisionLab').then(module=>({default:module.ElasticCollisionLab})));
export function ElasticCollisionEntry(props:DedicatedExperimentLabProps){return <Suspense fallback={<div role="status">Loading collision laboratory…</div>}><Lab {...props}/></Suspense>}

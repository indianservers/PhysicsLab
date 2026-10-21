import { Link, useLocation } from 'react-router-dom';
import { referenceLabsByStudio } from '../lib/studioReferenceLabs';
import { studioHomeById } from '../lib/conceptStudioHomes';

/** Subject navigation includes concept labs and the practical collection. */
export function StudioLabNav({studioId}:{studioId:string}) {
  const {pathname}=useLocation();
  return <nav className="studio-lab-navigation" aria-label={`${studioHomeById.get(studioId)?.name??'Studio'} labs`}>
    {(referenceLabsByStudio[studioId]??[]).map(lab=><Link key={lab.route} to={lab.route} aria-current={pathname===lab.route?'page':undefined} className={pathname===lab.route?'active':''}><span>{lab.title}</span></Link>)}
  </nav>;
}

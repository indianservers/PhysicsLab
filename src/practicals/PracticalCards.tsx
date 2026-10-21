import {Link} from 'react-router-dom';
import {practicals} from './model';
import './practicals.css';
export function PracticalCards(){return <section className="simple-section" aria-labelledby="practical-title"><header><div><span className="simple-kicker">THE PRACTICAL COLLECTION</span><h2 id="practical-title">Six experiments. Real understanding.</h2></div><p>3D apparatus · Measurements · Analysis</p></header><div className="pr-home-grid">{practicals.map((lab,i)=><Link className="pr-home-card" key={lab.id} to={`/practicals/${lab.id}`}><img src={`/assets/practicals/${lab.id}.png`} alt={`${lab.title} design reference`} loading="lazy"/><div><small>PRACTICAL 0{i+1}</small><h3>{lab.title}</h3><p>{lab.description}</p><b>Enter the laboratory →</b></div></Link>)}</div></section>}

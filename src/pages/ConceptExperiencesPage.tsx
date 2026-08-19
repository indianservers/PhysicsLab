import { useNavigate, useParams } from "react-router-dom";
import { Toolbar } from "../components/Toolbar";
import { ConceptExperience, ConceptExperienceSelector } from "../components/ConceptExperience";
import { conceptExperienceById, conceptExperiences } from "../lib/conceptExperiences";

export function ConceptExperiencesPage(){
  const {conceptId}=useParams();
  const navigate=useNavigate();
  const selected=conceptExperienceById.get(conceptId??"")??conceptExperiences[0];
  return <div className="concept-studio-page" data-ui-theme="dark"><Toolbar/><main id="content" className="concept-studio-shell"><header className="concept-studio-hero"><div><span>PHASE 2 SCIENTIFIC INVESTIGATION · 16 LIVE CONCEPTS</span><h1>Predict. Measure. <em>Defend the result.</em></h1><p>Run animated models, inspect synchronized data, test field scenarios, complete calibration missions, and save repeatable evidence.</p></div><aside><b>16</b><span>ANIMATED CONCEPTS</span><b>48</b><span>OPERATING SCENARIOS</span><b>16</b><span>CALIBRATION MISSIONS</span></aside></header><ConceptExperienceSelector active={selected.id} onSelect={(id)=>navigate(`/concept-studio/${id}`)}/><ConceptExperience experience={selected}/></main></div>;
}

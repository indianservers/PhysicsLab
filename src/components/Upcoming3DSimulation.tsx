import { PhysicsIcon } from "../lib/icons";

export function Upcoming3DSimulation({ title }: { title: string }) {
  return (
    <section data-ui-theme="dark" className="pending-visualization-card" aria-label={`${title} 3D simulation upcoming`}>
      <div className="pending-visualization-header">
        <span className="card-icon"><PhysicsIcon name="orbit" className="h-5 w-5" /></span>
        <div><p className="ui-label">Upcoming</p><h3>3D simulation upcoming</h3></div>
      </div>
      <p className="pending-visualization-goal">A dedicated 3D simulation for {title} is planned.</p>
    </section>
  );
}

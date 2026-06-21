import { Link } from "react-router-dom";
import { accuracyAuditStats } from "../lib/accuracyValidation";
import { PhysicsIcon } from "../lib/icons";

export function TrustStatusBadge() {
  const validationRate = Math.round((accuracyAuditStats.passing / Math.max(1, accuracyAuditStats.cases)) * 100);
  return (
    <details className="trust-status-badge">
      <summary title="Open validation and trust summary">
        <PhysicsIcon name="check" className="h-4 w-4" />
        <span>{accuracyAuditStats.executableChecks} local checks</span>
      </summary>
      <div className="trust-status-panel">
        <div>
          <strong>{validationRate}% benchmark pass rate</strong>
          <p>{accuracyAuditStats.passing}/{accuracyAuditStats.cases} formula benchmark cases pass across {accuracyAuditStats.domains} domains.</p>
        </div>
        <div className="trust-status-grid">
          <span><b>{accuracyAuditStats.validatedProfiles}</b> benchmarked labs</span>
          <span><b>{accuracyAuditStats.flagshipModels}</b> flagship models</span>
          <span><b>{accuracyAuditStats.pendingProfiles}</b> pending accuracy items</span>
        </div>
        <div className="trust-status-actions">
          <Link to="/trust">Trust guide</Link>
          <Link to="/accuracy-center">Accuracy center</Link>
        </div>
      </div>
    </details>
  );
}

import { Link, useLocation } from "react-router-dom";
import { PhysicsIcon } from "../lib/icons";

/**
 * Global navigation is intentionally concentrated on the Home page.
 * Interior screens expose only this small, predictable way back home.
 */
export function Toolbar(_props: { compact?: boolean; hideRail?: boolean } = {}) {
  const location = useLocation();
  if (location.pathname === "/") return null;

  return (
    <Link className="app-home-button" to="/" aria-label="Go to PhysicsLab home" title="Home" viewTransition>
      <PhysicsIcon name="home" />
      <span>Home</span>
    </Link>
  );
}

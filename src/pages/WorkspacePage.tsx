import { BottomPanel } from "../components/BottomPanel";
import { LeftSidebar } from "../components/LeftSidebar";
import { PhysicsCanvas } from "../components/PhysicsCanvas";
import { PropertiesPanel } from "../components/PropertiesPanel";
import { Toolbar } from "../components/Toolbar";

export function WorkspacePage({ mode }: { mode: "guided" | "sandbox" }) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Toolbar />
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 p-3 lg:grid-cols-[280px_minmax(0,1fr)_300px]">
        <LeftSidebar />
        <main className="grid min-h-0 grid-rows-[minmax(360px,1fr)_270px] gap-3">
          <section className="panel min-h-0 p-2">
            <div className="mb-2 flex items-center justify-between px-2">
              <h1 className="panel-title">{mode === "sandbox" ? "Free Sandbox" : "Guided Lab Workspace"}</h1>
              <div className="flex gap-2 text-xs">
                <span className="badge">Matter.js</span>
                <span className="badge">SI Units</span>
                <span className="badge">Vectors</span>
              </div>
            </div>
            <PhysicsCanvas />
          </section>
          <BottomPanel />
        </main>
        <PropertiesPanel />
      </div>
    </div>
  );
}

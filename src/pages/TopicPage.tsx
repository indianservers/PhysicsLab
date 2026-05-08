import { Link } from "react-router-dom";
import { Toolbar } from "../components/Toolbar";

export function TopicPage({ topic }: { topic: string }) {
  const title = topic.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join(" ");
  return (
    <div className="min-h-screen">
      <Toolbar />
      <div className="mx-auto max-w-6xl px-5 py-8">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="mt-2 max-w-2xl text-slate-500 dark:text-slate-400">Topic route scaffold with simulations, formula panels, objects, instruments, and guided experiments ready to expand.</p>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {["Open sandbox", "Guided experiments", "Graphs and data"].map((item) => (
            <Link key={item} to={item === "Open sandbox" ? "/sandbox" : item === "Guided experiments" ? "/experiments" : "/graphs"} className="home-card">{item}</Link>
          ))}
        </div>
      </div>
    </div>
  );
}

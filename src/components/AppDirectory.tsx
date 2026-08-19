import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { appDirectoryEntries, directoryCounts, directorySections, type DirectorySection } from "../lib/appDirectory";
import { PhysicsIcon } from "../lib/icons";

export function AppDirectory({ onNavigate, compact = false }: { onNavigate?: () => void; compact?: boolean }) {
  const [query, setQuery] = useState(""); const [section, setSection] = useState<DirectorySection | "All">("All");
  const matches = useMemo(() => { const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean); return appDirectoryEntries.filter((entry) => (section === "All" || entry.section === section) && terms.every((term) => [entry.title, entry.description, entry.section, entry.group, ...entry.keywords].join(" ").toLowerCase().includes(term))); }, [query, section]);
  const grouped = useMemo(() => Array.from(new Set(matches.map((entry) => `${entry.section}::${entry.group}`))).map((key) => { const [entrySection, group] = key.split("::"); return { section: entrySection, group, entries: matches.filter((entry) => entry.section === entrySection && entry.group === group) }; }), [matches]);
  return <div className={`app-directory ${compact ? "compact" : ""}`}>
    <div className="app-directory-search"><PhysicsIcon name="search" /><input autoFocus={!compact} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search every module, concept, experiment, lab, or tool…" aria-label="Search complete application directory" /><kbd>ALL</kbd></div>
    <div className="app-directory-tabs" role="tablist" aria-label="Directory sections"><button className={section === "All" ? "active" : ""} onClick={() => setSection("All")}>Everything <b>{appDirectoryEntries.length}</b></button>{directorySections.map((item) => <button key={item} className={section === item ? "active" : ""} onClick={() => setSection(item)}>{item} <b>{directoryCounts[item]}</b></button>)}</div>
    <div className="app-directory-results"><div className="app-directory-result-head"><span>{matches.length} destinations</span>{query && <button onClick={() => setQuery("")}>Clear search</button>}</div>{grouped.map((group) => <section key={`${group.section}-${group.group}`}><header><span>{group.section}</span><h3>{group.group}</h3><b>{group.entries.length}</b></header><div>{group.entries.map((entry) => <Link key={entry.id} to={entry.path} onClick={onNavigate}><span><PhysicsIcon name={entry.icon} /></span><p><b>{entry.title}</b><small>{entry.description}</small></p>{entry.badge && <em>{entry.badge}</em>}<i>→</i></Link>)}</div></section>)}{matches.length === 0 && <div className="app-directory-none"><PhysicsIcon name="search" /><b>No destination found</b><p>Try a subject such as force, optics, rocket, quantum, teacher, or assessment.</p><button onClick={() => { setQuery(""); setSection("All"); }}>Show everything</button></div>}</div>
  </div>;
}

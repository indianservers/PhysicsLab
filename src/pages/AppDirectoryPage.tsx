import { Toolbar } from "../components/Toolbar";
import { AppDirectory } from "../components/AppDirectory";
import { appDirectoryEntries, directoryCounts } from "../lib/appDirectory";

export function AppDirectoryPage() { return <div className="directory-page" data-ui-theme="dark"><Toolbar /><main id="content" className="directory-page-shell"><header><span>COMPLETE PRODUCT DIRECTORY</span><h1>All Modules <em>&amp; Concepts</em></h1><p>One searchable map of every physics module, curriculum concept, experiment, Pro Lab experience, teaching workflow, and platform tool.</p><div><b>{appDirectoryEntries.length}</b><span>Total destinations</span><b>{directoryCounts.Modules}</b><span>Physics modules</span><b>{directoryCounts.Concepts}</b><span>Concept cards</span><b>{directoryCounts.Experiments}</b><span>Experiments</span></div></header><AppDirectory /></main></div>; }

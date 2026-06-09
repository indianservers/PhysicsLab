import { useState } from "react";
import { Toolbar } from "../components/Toolbar";

export function LMSConfigPage() {
  const [endpoint, setEndpoint] = useState(localStorage.getItem("xapi_endpoint") ?? "");
  const [credentials, setCredentials] = useState("");
  const [auth, setAuth] = useState(sessionStorage.getItem("xapi_auth") || localStorage.getItem("xapi_auth") || "");
  const [rememberAuth, setRememberAuth] = useState(false);
  const [name, setName] = useState(localStorage.getItem("xapi_actor_name") ?? "");
  const [email, setEmail] = useState(localStorage.getItem("xapi_actor_email") ?? "");

  const save = () => {
    localStorage.setItem("xapi_endpoint", endpoint);
    const nextAuth = auth || (credentials ? btoa(credentials) : "");
    sessionStorage.setItem("xapi_auth", nextAuth);
    if (rememberAuth) localStorage.setItem("xapi_auth", nextAuth);
    else localStorage.removeItem("xapi_auth");
    localStorage.setItem("xapi_actor_name", name);
    localStorage.setItem("xapi_actor_email", email);
  };

  return (
    <div className="min-h-screen">
      <Toolbar />
      <main className="mx-auto max-w-4xl px-5 py-8">
        <h1 className="text-3xl font-bold">LMS / xAPI Configuration</h1>
        <section className="mt-4 rounded-md border border-amber-300/60 bg-amber-300/10 p-4 text-sm font-semibold text-slate-700 dark:text-amber-100">
          Browser-only mode: statements are sent directly from this browser to the LRS endpoint you enter. PhysicsLab 100 does not run a server proxy. Prefer anonymized learner IDs for pilots, and avoid saving Basic auth permanently on shared computers.
        </section>
        <div className="mt-6 grid gap-3">
          <label className="property-row"><span>LRS endpoint URL</span><input value={endpoint} onChange={(event) => setEndpoint(event.target.value)} /></label>
          <label className="property-row"><span>Basic auth username:password</span><input type="password" value={credentials} onChange={(event) => { setCredentials(event.target.value); setAuth(event.target.value ? btoa(event.target.value) : ""); }} /></label>
          <label className="property-row"><span>Basic auth base64</span><input type="password" value={auth} onChange={(event) => setAuth(event.target.value)} /></label>
          <label className="property-row"><span>Remember auth in this browser</span><input type="checkbox" checked={rememberAuth} onChange={(event) => setRememberAuth(event.target.checked)} /></label>
          <label className="property-row"><span>Student name</span><input value={name} onChange={(event) => setName(event.target.value)} /></label>
          <label className="property-row"><span>Actor email</span><input value={email} onChange={(event) => setEmail(event.target.value)} /></label>
          <button className="tool-btn-primary w-fit" onClick={save}>Save LMS settings</button>
        </div>
        <section className="mt-8 rounded border border-slate-300/60 p-4 text-sm dark:border-lab-line">
          <h2 className="panel-title">Embed code</h2>
          <pre className="mt-3 overflow-auto rounded bg-slate-950 p-3 text-cyan-100">{`<iframe src="${window.location.origin}/experiments/newton-s-second-law"\n        width="100%" height="700" allow="fullscreen"></iframe>`}</pre>
          <p className="mt-3 text-slate-500 dark:text-slate-400">Use your deployed static site URL. No server endpoint is required for the app itself.</p>
        </section>
      </main>
    </div>
  );
}

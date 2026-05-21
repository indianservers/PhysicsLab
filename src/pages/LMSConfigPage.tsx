import { useState } from "react";
import { Toolbar } from "../components/Toolbar";

export function LMSConfigPage() {
  const [endpoint, setEndpoint] = useState(localStorage.getItem("xapi_endpoint") ?? "");
  const [credentials, setCredentials] = useState("");
  const [auth, setAuth] = useState(localStorage.getItem("xapi_auth") ?? "");
  const [name, setName] = useState(localStorage.getItem("xapi_actor_name") ?? "");
  const [email, setEmail] = useState(localStorage.getItem("xapi_actor_email") ?? "");

  const save = () => {
    localStorage.setItem("xapi_endpoint", endpoint);
    localStorage.setItem("xapi_auth", auth || btoa(credentials));
    localStorage.setItem("xapi_actor_name", name);
    localStorage.setItem("xapi_actor_email", email);
  };

  return (
    <div className="min-h-screen">
      <Toolbar />
      <main className="mx-auto max-w-4xl px-5 py-8">
        <h1 className="text-3xl font-bold">LMS / xAPI Configuration</h1>
        <div className="mt-6 grid gap-3">
          <label className="property-row"><span>LRS endpoint URL</span><input value={endpoint} onChange={(event) => setEndpoint(event.target.value)} /></label>
          <label className="property-row"><span>Basic auth username:password</span><input value={credentials} onChange={(event) => { setCredentials(event.target.value); setAuth(btoa(event.target.value)); }} /></label>
          <label className="property-row"><span>Basic auth base64</span><input value={auth} onChange={(event) => setAuth(event.target.value)} /></label>
          <label className="property-row"><span>Student name</span><input value={name} onChange={(event) => setName(event.target.value)} /></label>
          <label className="property-row"><span>Actor email</span><input value={email} onChange={(event) => setEmail(event.target.value)} /></label>
          <button className="tool-btn-primary w-fit" onClick={save}>Save LMS settings</button>
        </div>
        <section className="mt-8 rounded border border-slate-300/60 p-4 text-sm dark:border-lab-line">
          <h2 className="panel-title">Embed code</h2>
          <pre className="mt-3 overflow-auto rounded bg-slate-950 p-3 text-cyan-100">{`<iframe src="https://yourhost/lab?experiment=newton2&embed=1"
        width="100%" height="700" allow="fullscreen"></iframe>`}</pre>
        </section>
      </main>
    </div>
  );
}

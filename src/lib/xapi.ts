type Verb = "launched" | "attempted" | "completed" | "passed" | "interacted";

export function sendStatement(verb: Verb, objectId: string, result?: Record<string, unknown>) {
  const actorName = localStorage.getItem("xapi_actor_name") || "PhysicsLab Learner";
  const actorEmail = localStorage.getItem("xapi_actor_email") || "learner@example.com";
  const statement = {
    actor: { name: actorName, mbox: `mailto:${actorEmail}` },
    verb: {
      id: `https://adlnet.gov/expapi/verbs/${verb}`,
      display: { "en-US": verb },
    },
    object: {
      id: `${window.location.origin}${objectId.startsWith("/") ? objectId : `/${objectId}`}`,
      definition: { name: { "en-US": objectId } },
    },
    result,
    timestamp: new Date().toISOString(),
  };
  const endpoint = localStorage.getItem("xapi_endpoint");
  const auth = localStorage.getItem("xapi_auth");
  if (!endpoint) {
    console.info("xAPI statement", statement);
    return;
  }
  fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Experience-API-Version": "1.0.3",
      ...(auth ? { Authorization: `Basic ${auth}` } : {}),
    },
    body: JSON.stringify(statement),
  }).catch((error) => console.warn("xAPI send failed", error));
}

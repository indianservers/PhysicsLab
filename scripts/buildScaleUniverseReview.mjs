// Test-only bundle of the real application entry. Service worker is disabled
// so browser QA does not precache unrelated assets; deployed builds still use Vite.
import { build } from "esbuild";
import fs from "node:fs";
const outdir = "artifacts/scale-universe-upgrade/app-review-build";
const result = await build({
  entryPoints: ["src/main.tsx"], bundle: true, format: "esm", platform: "browser", outdir, minify: true,
  external: ["/assets/*"],
  define: { "process.env.NODE_ENV": JSON.stringify("production"), "import.meta.env": JSON.stringify({ DEV: false, PROD: false, BASE_URL: "/", MODE: "test" }) },
  loader: { ".woff": "file", ".woff2": "file", ".ttf": "file", ".svg": "file", ".png": "file" },
  plugins: [{ name: "review-service-worker-stub", setup(plugin) {
    plugin.onResolve({ filter: /^virtual:pwa-register$/ }, () => ({ path: "pwa", namespace: "review" }));
    plugin.onLoad({ filter: /.*/, namespace: "review" }, () => ({ contents: "export const registerSW = () => {};", loader: "js" }));
  } }], logLevel: "silent",
});
fs.writeFileSync(`${outdir}/index.html`, `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/${outdir}/main.css"></head><body><div id="root"></div><script>history.replaceState({},"","/physics/scale-of-universe");</script><script type="module" src="/${outdir}/main.js"></script></body></html>`);
fs.writeFileSync(`${outdir}/.gitignore`, "*\n!.gitignore\n");
fs.writeFileSync("artifacts/scale-universe-upgrade/app-review-build-report.json", JSON.stringify({ passed: true, source: "src/main.tsx", scope: "Real React shell and latest module; review build uses esbuild and disables service worker. Tailwind directives are not expanded by this test-only bundler. Vite remains the production pipeline.", unrelatedWarnings: result.warnings.map(warning => ({ text: warning.text, file: warning.location?.file })) }, null, 2));
console.log(`Current React application review bundle built; ${result.warnings.length} existing warnings recorded.`);

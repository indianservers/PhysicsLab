# Production Deployment

This is a Vite React app. Pulling from Git updates the source only; `dist/` is ignored and must be rebuilt on the server.

## Server Update

Run these commands from the project directory:

```bash
git pull origin main
npm ci
npm run build
```

Serve the generated `dist/` directory, not the repository root.

For a quick Node/Vite preview:

```bash
npm run serve -- --port 5188
```

## Static Server Fallback

React routes such as `/quiz`, `/lab`, and `/experiments` must fall back to `dist/index.html`.

Nginx:

```nginx
root /path/to/Physics-Simulator/dist;
index index.html;

location / {
  try_files $uri $uri/ /index.html;
}
```

Apache `.htaccess` inside `dist/`:

```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

## Blank Page Checklist

- Confirm the server is serving `dist/index.html`.
- Confirm `/assets/index-*.js` returns JavaScript with HTTP 200.
- Rebuild after every pull because `dist/` is not committed.
- Hard refresh or unregister the old service worker if an older deployment is cached.

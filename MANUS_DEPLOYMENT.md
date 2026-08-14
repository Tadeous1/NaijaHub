# NaijaHub on Manus full-stack hosting

GitHub remains the source repository. The published runtime must be a full-stack Node service rather than GitHub Pages so the Express API, sessions, Gemini proxy, and persistent data directory are available on the same origin.

## Build and start

Use these commands in the hosting project:

```text
Build: npm run build
Start: npm start
```

The runtime should use Node.js 20 or newer and HTTPS. The server listens on the port supplied by the hosting platform.

## Secrets and environment

Add these values through the Manus Secrets/environment settings, not through GitHub files:

```text
GEMINI_API_KEY=<real server-only Gemini key>
ADMIN_EMAILS=elishao2000@gmail.com
NODE_ENV=production
DATA_DIR=/data
```

`GEMINI_API_KEY` must never be prefixed with `VITE_`, injected in `vite.config.ts`, or committed to the repository. `ADMIN_EMAILS` controls which newly registered accounts receive the protected admin role.

## Persistent storage

Mount a persistent volume at `/data` so users, sessions, listings, and applications survive restarts. The current source uses a portable JSON persistence adapter. It is suitable for one persistent server instance; a managed database adapter should be used before enabling multiple autoscaling instances.

## Post-publish checks

After the Manus URL is available, verify:

```text
GET /api/health
GET /api/auth/me
```

Then register a test account, sign in, sign out, and confirm that an admin account can open `/post-a-listing`. Do not use a real applicant’s sensitive CV information during smoke testing.

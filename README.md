# NaijaHub

NaijaHub is a full-stack opportunity hub for verified jobs, scholarships, applications, and Nigerian career tools. The React/Vite interface is served by an Express backend that owns authentication, listing persistence, application capture, admin actions, and Gemini requests.

## Local development

Prerequisites: Node.js 20 or newer.

```bash
npm install
ADMIN_EMAILS=admin@example.com GEMINI_API_KEY=your_server_only_key npm run dev
```

Open `http://localhost:3000`. The development server serves both the Vite frontend and the `/api` routes.

The first account created with an email listed in `ADMIN_EMAILS` receives the `admin` role. Other accounts receive the standard applicant role. Keep `ADMIN_EMAILS` comma-separated when more than one administrator is needed.

## Production build

```bash
npm run lint
npm run build
ADMIN_EMAILS=admin@example.com GEMINI_API_KEY=your_server_only_key NODE_ENV=production npm start
```

The production server serves `dist/` and the bundled backend from `dist-server/index.js`. Set `PORT` when the hosting provider supplies a port. Set `DATABASE_PATH` or `DATA_DIR` when the platform provides a persistent data directory.

## Security model

The Gemini key is read only by `server/ai.ts`. It is not injected into the browser bundle. AI routes require a signed-in user, validate field lengths, and apply a per-IP request limit. Sessions use an HttpOnly cookie containing a random token whose hash is persisted server-side.

The current storage adapter is a portable JSON data store designed for local development and a single persistent server instance. Before using multiple autoscaling instances, replace `server/db.ts` with a managed database adapter and keep the same route contracts. Do not run an autoscaling deployment with ephemeral storage if applications and listings must survive restarts.

## Listing data

Listings can enter the system in two ways:

1. An authenticated administrator can use **Post a Listing** to publish a verified job or scholarship with an official HTTPS application URL.
2. An authenticated administrator can paste normalized records from an approved external provider through the provider-neutral import interface at **Post a Listing**. The current repository does not claim a provider-specific API or invent external listings; an adapter should normalize a permitted provider into the import schema first.

Normalized records require `kind`, `title`, `organization`, `description`, and a valid `applicationUrl`. Optional fields include `location`, `type`, `experienceLevel`, `salary`, `category`, `fieldOfStudy`, `coverage`, `deadline`, and `externalId`.

## API surface

| Route | Access | Purpose |
|---|---|---|
| `GET /api/health` | Public | Health check |
| `GET /api/auth/me` | Public | Current session state |
| `POST /api/auth/register` | Public | Create an applicant or configured admin account |
| `POST /api/auth/login` | Public | Start a session |
| `POST /api/auth/logout` | Signed in | End a session |
| `GET /api/listings` | Public | Search published jobs or scholarships |
| `GET /api/listings/:id` | Public | Read one published listing |
| `POST /api/listings/:id/apply` | Signed in | Save an application and return the official application URL |
| `POST /api/admin/listings` | Admin | Publish or update a manually managed listing |
| `POST /api/admin/import` | Admin | Import normalized provider records |
| `POST /api/ai/cv` | Signed in | Generate a CV through the server-side Gemini proxy |
| `POST /api/ai/cover-letter` | Signed in | Generate a cover letter through the server-side Gemini proxy |

## Important deployment notes

GitHub Pages can remain the source repository, but it cannot execute the Express backend, protect Gemini credentials, manage sessions, or persist applications. Deploy the full project to a host that runs Node.js and provides HTTPS plus persistent storage. Keep GitHub as the code source and use the host’s build command `npm run build` and start command `npm start`.

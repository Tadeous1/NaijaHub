import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';
import { initDb, db, listingToDto, normalizeListingInput, upsertListing } from './db';
import { authenticate, createUser, endSession, getUser, publicUser, requireAdmin, requireUser, startSession } from './auth';
import { generateCoverLetter, generateCv } from './ai';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const app = express();
app.use(express.json({ limit: '64kb' }));
initDb();

function asyncRoute(handler: (req: express.Request, res: express.Response) => Promise<unknown>) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => Promise.resolve(handler(req, res)).catch(next);
}

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'NaijaHub API' }));
app.get('/api/auth/me', (req, res) => res.json({ user: publicUser(getUser(req)) }));
app.post('/api/auth/register', (req, res) => {
  try { const user = createUser(String(req.body?.name || ''), String(req.body?.email || ''), String(req.body?.password || '')) as any; startSession(res, user.id); return res.status(201).json({ user: publicUser(user) }); }
  catch (error: any) { return res.status(400).json({ error: error.code === 'ACCOUNT_EXISTS' ? 'An account with that email already exists.' : error.message }); }
});
app.post('/api/auth/login', (req, res) => {
  try { const user = authenticate(String(req.body?.email || ''), String(req.body?.password || '')); startSession(res, user.id); return res.json({ user: publicUser(user) }); }
  catch (error: any) { return res.status(401).json({ error: error.message }); }
});
app.post('/api/auth/logout', (req, res) => { endSession(req, res); return res.json({ ok: true }); });

app.get('/api/listings', (req, res) => {
  const params = req.query as Record<string, string | undefined>;
  const rows = db.findListings({ kind: params.kind === 'job' || params.kind === 'scholarship' ? params.kind : undefined, q: params.q, type: params.type, experienceLevel: params.experienceLevel, location: params.location, category: params.category });
  return res.json({ listings: rows.map(listingToDto) });
});
app.get('/api/listings/:id', (req, res) => {
  const row = db.findListingById(Number(req.params.id));
  if (!row || row.status !== 'published') return res.status(404).json({ error: 'Listing not found.' });
  return res.json({ listing: listingToDto(row) });
});
app.post('/api/listings/:id/apply', requireUser, (req, res) => {
  const listing = db.findListingById(Number(req.params.id)) as any;
  if (!listing || listing.status !== 'published') return res.status(404).json({ error: 'Listing not found.' });
  const user = res.locals.user;
  const coverNote = String(req.body?.coverNote || '').slice(0, 5000);
  const cvText = String(req.body?.cvText || '').slice(0, 12000);
  try {
    db.addApplication({ listingId: listing.id, applicantId: user.id, name: user.name, email: user.email, coverNote, cvText, status: 'submitted' });
  } catch { return res.status(500).json({ error: 'Application could not be saved.' }); }
  return res.json({ ok: true, applicationUrl: listing.applicationUrl });
});
app.post('/api/admin/listings', requireAdmin, (req, res) => {
  try { const id = upsertListing({ ...req.body, sourceType: 'admin', sourceName: 'NaijaHub admin' }, res.locals.user.id); return res.status(201).json({ listing: listingToDto(db.findListingById(id)) }); }
  catch (error: any) { return res.status(400).json({ error: error.message }); }
});
app.post('/api/admin/import', requireAdmin, (req, res) => {
  const items = Array.isArray(req.body?.items) ? req.body.items : [];
  if (!items.length || items.length > 500) return res.status(400).json({ error: 'Send between 1 and 500 normalized listings.' });
  const sourceType = String(req.body?.sourceType || 'external').slice(0, 80);
  const sourceName = String(req.body?.sourceName || 'External provider').slice(0, 180);
  try { const normalized = items.map((item) => normalizeListingInput({ ...(item as Record<string, unknown>), sourceType, sourceName }, res.locals.user.id)); const ids = normalized.map((item) => upsertListing(item, res.locals.user.id)); return res.status(201).json({ imported: ids.length, ids }); } catch (error: any) { return res.status(400).json({ error: error.message }); }
});
app.post('/api/ai/cv', requireUser, asyncRoute(generateCv));
app.post('/api/ai/cover-letter', requireUser, asyncRoute(generateCoverLetter));

const port = Number(process.env.PORT || 3000);
if (process.env.NODE_ENV !== 'production') {
  const vite = await createViteServer({ root, server: { middlewareMode: true }, appType: 'spa' });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(root, 'dist')));
  app.get('*', (_req, res) => res.sendFile(path.resolve(root, 'dist/index.html')));
}
app.use((error: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => { console.error(error); res.status(error.status || 500).json({ error: 'Unexpected server error.' }); });
app.listen(port, '0.0.0.0', () => console.log(`NaijaHub server listening on http://localhost:${port}`));

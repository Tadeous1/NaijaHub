import { mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import path from 'node:path';

export type ListingKind = 'job' | 'scholarship';
type UserRow = { id: number; name: string; email: string; passwordHash: string; role: 'user' | 'admin'; createdAt: string };
type SessionRow = { tokenHash: string; userId: number; expiresAt: string };
type ListingRow = { id: number; kind: ListingKind; title: string; organization: string; location: string; type: string | null; experienceLevel: string | null; salary: string | null; description: string; category: string | null; fieldOfStudy: string[]; coverage: string | null; deadline: string | null; applicationUrl: string; sourceUrl: string; sourceType: string; sourceName: string; externalId: string | null; status: 'draft' | 'published' | 'archived'; createdBy: number | null; createdAt: string; updatedAt: string };
type ApplicationRow = { id: number; listingId: number; applicantId: number; name: string; email: string; coverNote: string; cvText: string; status: 'submitted' | 'reviewed' | 'withdrawn'; createdAt: string };
type State = { users: UserRow[]; sessions: SessionRow[]; listings: ListingRow[]; applications: ApplicationRow[]; counters: { users: number; listings: number; applications: number } };

const dataDir = path.resolve(process.env.DATA_DIR || 'data');
mkdirSync(dataDir, { recursive: true });
const dataPath = path.resolve(process.env.DATABASE_PATH || path.join(dataDir, 'naijahub-data.json'));
const emptyState = (): State => ({ users: [], sessions: [], listings: [], applications: [], counters: { users: 1, listings: 1, applications: 1 } });
function loadState(): State { try { return JSON.parse(readFileSync(dataPath, 'utf8')) as State; } catch { return emptyState(); } }
let state = loadState();
function save() { const temp = `${dataPath}.tmp`; writeFileSync(temp, JSON.stringify(state, null, 2)); renameSync(temp, dataPath); }
export function initDb() { state = loadState(); }

export const db = {
  findUserByEmail(email: string) { return state.users.find(user => user.email === email.toLowerCase()) || null; },
  findUserById(id: number) { return state.users.find(user => user.id === id) || null; },
  addUser(user: Omit<UserRow, 'id' | 'createdAt'>) { const row = { ...user, id: state.counters.users++, createdAt: new Date().toISOString() }; state.users.push(row); save(); return row; },
  addSession(session: SessionRow) { state.sessions = state.sessions.filter(item => item.expiresAt > new Date().toISOString()); state.sessions.push(session); save(); },
  findSession(tokenHash: string) { return state.sessions.find(session => session.tokenHash === tokenHash && session.expiresAt > new Date().toISOString()) || null; },
  deleteSession(tokenHash: string) { state.sessions = state.sessions.filter(session => session.tokenHash !== tokenHash); save(); },
  findListings(filters: { kind?: ListingKind; q?: string; type?: string; experienceLevel?: string; location?: string; category?: string }) {
    const q = filters.q?.trim().toLowerCase();
    return state.listings.filter(listing => listing.status === 'published' && (!filters.kind || listing.kind === filters.kind) && (!q || [listing.title, listing.organization, listing.description, listing.location].some(value => value.toLowerCase().includes(q))) && (!filters.type || filters.type === 'All' || listing.type === filters.type) && (!filters.experienceLevel || filters.experienceLevel === 'All' || listing.experienceLevel === filters.experienceLevel) && (!filters.location || filters.location === 'All States' || listing.location.toLowerCase().includes(filters.location.toLowerCase())) && (!filters.category || filters.category === 'All' || listing.category === filters.category)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
  findListingById(id: number) { return state.listings.find(listing => listing.id === id) || null; },
  findListingByExternalId(sourceType: string, externalId: string) { return state.listings.find(listing => listing.sourceType === sourceType && listing.externalId === externalId) || null; },
  insertListing(listing: Omit<ListingRow, 'id' | 'createdAt' | 'updatedAt'>) { const now = new Date().toISOString(); const row = { ...listing, id: state.counters.listings++, createdAt: now, updatedAt: now }; state.listings.push(row); save(); return row.id; },
  updateListing(id: number, listing: Omit<ListingRow, 'id' | 'createdAt' | 'updatedAt'>) { const index = state.listings.findIndex(item => item.id === id); if (index < 0) throw new Error('Listing not found'); state.listings[index] = { ...listing, id, createdAt: state.listings[index].createdAt, updatedAt: new Date().toISOString() }; save(); return id; },
  addApplication(application: Omit<ApplicationRow, 'id' | 'createdAt'>) { if (state.applications.some(item => item.listingId === application.listingId && item.applicantId === application.applicantId)) return false; state.applications.push({ ...application, id: state.counters.applications++, createdAt: new Date().toISOString() }); save(); return true; },
};

const adminEmails = new Set((process.env.ADMIN_EMAILS || '').split(',').map(email => email.trim().toLowerCase()).filter(Boolean));
export function isConfiguredAdmin(email: string) { return adminEmails.has(email.toLowerCase()); }

export function normalizeListingInput(input: Record<string, unknown>, userId?: number): Omit<ListingRow, 'id' | 'createdAt' | 'updatedAt'> {
  const kind = input.kind === 'scholarship' ? 'scholarship' : input.kind === 'job' ? 'job' : null;
  if (!kind) throw new Error('kind must be job or scholarship');
  const title = String(input.title || '').trim();
  const organization = String(input.organization || input.company || input.provider || '').trim();
  const description = String(input.description || '').trim();
  const applicationUrl = String(input.applicationUrl || '').trim();
  if (!title || !organization || !description) throw new Error('title, organization, and description are required');
  let parsedUrl: URL;
  try { parsedUrl = new URL(applicationUrl); } catch { throw new Error('applicationUrl must be a valid URL'); }
  if (!['http:', 'https:'].includes(parsedUrl.protocol)) throw new Error('applicationUrl must use http or https');
  const fields = Array.isArray(input.fieldOfStudy) ? input.fieldOfStudy.map(String).slice(0, 20) : [];
  return { kind, title: title.slice(0, 180), organization: organization.slice(0, 180), location: String(input.location || 'Nigeria').trim().slice(0, 120), type: String(input.type || '').trim().slice(0, 80) || null, experienceLevel: String(input.experienceLevel || '').trim().slice(0, 80) || null, salary: String(input.salary || '').trim().slice(0, 120) || null, description: description.slice(0, 6000), category: String(input.category || '').trim().slice(0, 120) || null, fieldOfStudy: fields, coverage: String(input.coverage || '').trim().slice(0, 80) || null, deadline: String(input.deadline || '').trim().slice(0, 80) || null, applicationUrl: applicationUrl.slice(0, 1000), sourceUrl: String(input.sourceUrl || applicationUrl).trim().slice(0, 1000), sourceType: String(input.sourceType || 'admin').trim().slice(0, 80), sourceName: String(input.sourceName || 'NaijaHub admin').trim().slice(0, 180), externalId: String(input.externalId || '').trim().slice(0, 180) || null, status: 'published' as const, createdBy: userId || null };
}

export function listingToDto(row: ListingRow | null) {
  if (!row) return null;
  return { id: String(row.id), kind: row.kind, title: row.title, organization: row.organization, company: row.organization, provider: row.organization, location: row.location, type: row.type, experienceLevel: row.experienceLevel, salary: row.salary, description: row.description, category: row.category, fieldOfStudy: row.fieldOfStudy, coverage: row.coverage, deadline: row.deadline, applicationUrl: row.applicationUrl, sourceUrl: row.sourceUrl || row.applicationUrl, sourceType: row.sourceType, sourceName: row.sourceName, postedAt: row.createdAt };
}

export function upsertListing(input: Record<string, unknown>, userId?: number) {
  const listing = normalizeListingInput(input, userId);
  const existing = listing.externalId ? db.findListingByExternalId(listing.sourceType, listing.externalId) : null;
  return existing ? db.updateListing(existing.id, listing) : db.insertListing(listing);
}

export type User = { id: number; name: string; email: string; role: 'user' | 'admin' };
export type Listing = {
  id: string; kind: 'job' | 'scholarship'; title: string; organization: string; company: string; provider: string; location: string;
  type?: string | null; experienceLevel?: string | null; salary?: string | null; description: string; category?: string | null;
  fieldOfStudy: string[]; coverage?: string | null; deadline?: string | null; applicationUrl: string; sourceName: string; postedAt: string;
};
async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...init, headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) }, credentials: 'include' });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || 'Request failed');
  return payload as T;
}
export const api = {
  me: () => request<{ user: User | null }>('/api/auth/me'),
  login: (body: { email: string; password: string }) => request<{ user: User }>('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  register: (body: { name: string; email: string; password: string }) => request<{ user: User }>('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  logout: () => request<{ ok: true }>('/api/auth/logout', { method: 'POST' }),
  listings: (params: Record<string, string | undefined>) => request<{ listings: Listing[] }>(`/api/listings?${new URLSearchParams(Object.entries(params).filter(([, value]) => value) as [string, string][]).toString()}`),
  listing: (id: string) => request<{ listing: Listing }>(`/api/listings/${id}`),
  apply: (id: string, body: { coverNote: string; cvText: string }) => request<{ ok: true; applicationUrl: string }>(`/api/listings/${id}/apply`, { method: 'POST', body: JSON.stringify(body) }),
  createListing: (body: Record<string, unknown>) => request<{ listing: Listing }>('/api/admin/listings', { method: 'POST', body: JSON.stringify(body) }),
  importListings: (body: { sourceType: string; sourceName: string; items: unknown[] }) => request<{ imported: number; ids: number[] }>('/api/admin/import', { method: 'POST', body: JSON.stringify(body) }),
};

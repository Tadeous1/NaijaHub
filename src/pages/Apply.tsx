import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, type Listing } from '../services/api';
import { useAuth } from '../context/AuthContext';

export function Apply() {
  const { id } = useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [listing, setListing] = useState<Listing | null>(null);
  const [coverNote, setCoverNote] = useState('');
  const [cvText, setCvText] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => { if (id) api.listing(id).then(({ listing }) => setListing(listing)).catch(err => setError(err.message)); }, [id]);
  if (loading || (!listing && !error)) return <div className="p-20 text-center text-slate-500">Loading opportunity…</div>;
  if (error) return <div className="max-w-xl mx-auto px-4 py-20 text-center"><h1 className="text-3xl font-bold">Opportunity unavailable</h1><p className="mt-3 text-rose-600">{error}</p><Link to="/jobs" className="mt-8 inline-flex rounded-full bg-slate-900 px-6 py-3 font-bold text-white">Back to Jobs</Link></div>;
  if (!listing) return null;
  if (!user) return <div className="max-w-xl mx-auto px-4 py-20 text-center"><h1 className="text-3xl font-bold">Sign in to apply</h1><p className="mt-3 text-slate-500">Your application is saved to your account and can be followed up from the listing owner’s workflow.</p><Link to="/auth" className="mt-8 inline-flex rounded-full bg-emerald-600 px-6 py-3 font-bold text-white">Sign In</Link></div>;
  async function submit(event: FormEvent) { event.preventDefault(); setError(''); try { await api.apply(listing.id, { coverNote, cvText }); setSubmitted(true); } catch (err: any) { setError(err.message); } }
  return <div className="max-w-3xl mx-auto px-4 py-12"><Link to={listing.kind === 'job' ? '/jobs' : '/scholarships'} className="text-sm font-bold text-emerald-700">← Back to opportunities</Link><div className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm"><p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">{listing.kind === 'job' ? 'Job application' : 'Scholarship application'}</p><h1 className="mt-2 text-3xl font-bold text-slate-900">{listing.title}</h1><p className="mt-2 font-semibold text-slate-600">{listing.organization} · {listing.location}</p><p className="mt-6 text-slate-600">{listing.description}</p>{submitted ? <div className="mt-8 rounded-2xl bg-emerald-50 p-5"><h2 className="text-xl font-bold text-emerald-900">Application saved</h2><p className="mt-2 text-emerald-800">Your application details were recorded. Continue to the official application page to complete the external submission.</p><a href={listing.applicationUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex rounded-full bg-emerald-600 px-5 py-3 font-bold text-white">Continue to official application ↗</a></div> : <form onSubmit={submit} className="mt-8 space-y-5"><label className="block text-sm font-bold text-slate-700">Cover note<textarea value={coverNote} onChange={e => setCoverNote(e.target.value)} rows={6} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-emerald-500" placeholder="Explain why this opportunity fits you." /></label><label className="block text-sm font-bold text-slate-700">CV text or summary<textarea value={cvText} onChange={e => setCvText(e.target.value)} rows={8} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-emerald-500" placeholder="Paste a concise CV summary or use the AI Career Suite first." /></label>{error ? <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 font-semibold text-rose-700">{error}</p> : null}<button className="rounded-full bg-emerald-600 px-6 py-3 font-bold text-white">Save application and continue</button></form>}</div></div>;
}

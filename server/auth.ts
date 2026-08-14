import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import { db, isConfiguredAdmin } from './db';

const SESSION_COOKIE = 'naijahub_session';
const SESSION_DAYS = 7;

function hashToken(token: string) { return crypto.createHash('sha256').update(token).digest('hex'); }
function readCookie(req: Request, name: string) {
  return (req.headers.cookie || '').split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))?.slice(name.length + 1);
}
function setSessionCookie(res: Response, token: string) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_DAYS * 86400}${secure}`);
}

export function publicUser(user: any) {
  return user ? { id: user.id, name: user.name, email: user.email, role: user.role } : null;
}

export function getUser(req: Request) {
  const token = readCookie(req, SESSION_COOKIE);
  if (!token) return null;
  const session = db.findSession(hashToken(token));
  return session ? db.findUserById(session.userId) : null;
}

export function createUser(name: string, email: string, password: string) {
  if (password.length < 8) throw new Error('Password must be at least 8 characters');
  const normalizedEmail = email.trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) throw new Error('Enter a valid email address');
  if (db.findUserByEmail(normalizedEmail)) throw Object.assign(new Error('An account with that email already exists.'), { code: 'ACCOUNT_EXISTS' });
  const passwordHash = bcrypt.hashSync(password, 12);
  const role = isConfiguredAdmin(normalizedEmail) ? 'admin' : 'user';
  return db.addUser({ name: name.trim().slice(0, 120), email: normalizedEmail, passwordHash, role });
}

export function authenticate(email: string, password: string) {
  const user = db.findUserByEmail(email.trim().toLowerCase()) as any;
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) throw new Error('Invalid email or password');
  return user;
}

export function startSession(res: Response, userId: number) {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + SESSION_DAYS * 86400000).toISOString();
  db.addSession({ tokenHash: hashToken(rawToken), userId, expiresAt: expires });
  setSessionCookie(res, rawToken);
}

export function endSession(req: Request, res: Response) {
  const token = readCookie(req, SESSION_COOKIE);
  if (token) db.deleteSession(hashToken(token));
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
}

export function requireUser(req: Request, res: Response, next: NextFunction) {
  const user = getUser(req);
  if (!user) return res.status(401).json({ error: 'Sign in is required for this action.' });
  res.locals.user = user;
  return next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = getUser(req);
  if (!user) return res.status(401).json({ error: 'Sign in is required.' });
  if (user.role !== 'admin') return res.status(403).json({ error: 'Admin access is required.' });
  res.locals.user = user;
  return next();
}

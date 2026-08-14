import { GoogleGenAI } from '@google/genai';
import type { Request, Response } from 'express';

const limits = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(req: Request) {
  const key = `${req.ip}:${req.path}`;
  const now = Date.now();
  const current = limits.get(key);
  if (!current || current.resetAt <= now) {
    limits.set(key, { count: 1, resetAt: now + 60000 });
    return true;
  }
  if (current.count >= 8) return false;
  current.count += 1;
  return true;
}
function required(value: unknown, label: string, max = 2000) {
  const result = String(value || '').trim();
  if (!result) throw new Error(`${label} is required`);
  if (result.length > max) throw new Error(`${label} is too long`);
  return result;
}
function getAi() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw Object.assign(new Error('AI service is not configured on the server.'), { status: 503 });
  return new GoogleGenAI({ apiKey });
}
async function generate(prompt: string) {
  const response = await getAi().models.generateContent({ model: 'gemini-2.0-flash', contents: prompt });
  if (!response.text) throw new Error('No text content returned from the AI provider');
  return response.text;
}

export async function generateCv(req: Request, res: Response) {
  if (!checkRateLimit(req)) return res.status(429).json({ error: 'Too many AI requests. Please wait a minute and try again.' });
  const body = req.body || {};
  const prompt = `Create a professional, ready-to-use CV for a Nigerian job seeker. Output only polished markdown without code fences.\n\nFull name: ${required(body.fullName, 'Full name', 120)}\nTarget role: ${required(body.targetRole, 'Target role', 160)}\nEmail: ${required(body.email, 'Email', 160)}\nPhone: ${required(body.phone, 'Phone', 80)}\nEducation: ${required(body.education, 'Education', 2000)}\nExperience: ${required(body.experience, 'Experience', 4000)}\nSkills: ${required(body.skills, 'Skills', 2000)}\nTemplate: ${required(body.template, 'Template', 40)}`;
  try { return res.json({ text: await generate(prompt) }); } catch (error: any) { return res.status(error.status || 502).json({ error: error.message || 'AI generation failed.' }); }
}

export async function generateCoverLetter(req: Request, res: Response) {
  if (!checkRateLimit(req)) return res.status(429).json({ error: 'Too many AI requests. Please wait a minute and try again.' });
  const body = req.body || {};
  const prompt = `Write a tailored professional cover letter for the Nigerian job market in markdown without code fences.\n\nApplicant: ${required(body.fullName, 'Full name', 120)}\nRole: ${required(body.jobTitle, 'Job title', 160)}\nCompany: ${required(body.companyName, 'Company name', 160)}\nExperience: ${required(body.experienceSummary, 'Experience summary', 3000)}\nSkills: ${required(body.keySkills, 'Key skills', 2000)}\nHiring manager: ${String(body.hiringManager || 'Hiring Manager').slice(0, 160)}\nCompany values: ${String(body.companyValues || 'Not specified').slice(0, 2000)}\nTone: ${required(body.tone, 'Tone', 40)}`;
  try { return res.json({ text: await generate(prompt) }); } catch (error: any) { return res.status(error.status || 502).json({ error: error.message || 'AI generation failed.' }); }
}

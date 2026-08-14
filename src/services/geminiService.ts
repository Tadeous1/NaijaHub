/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

async function request<T>(path: string, body: T) {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || 'AI request failed');
  return payload.text as string;
}

export async function generateCV(userData: {
  fullName: string;
  email: string;
  phone: string;
  education: string;
  experience: string;
  skills: string;
  targetRole: string;
  template: 'Modern' | 'Traditional' | 'Creative';
}) {
  return request('/api/ai/cv', userData);
}

export async function generateCoverLetter(userData: {
  fullName: string;
  jobTitle: string;
  companyName: string;
  experienceSummary: string;
  keySkills: string;
  hiringManager?: string;
  companyValues?: string;
  tone: 'Professional' | 'Enthusiastic' | 'Confident';
}) {
  return request('/api/ai/cover-letter', userData);
}

export async function getCareerAdviceSummaries() {
  // Optional: Use Gemini to generate dynamic advice if needed
  // For now, we'll use static data for stability
}

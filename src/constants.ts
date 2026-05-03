/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Job, Scholarship, AdviceArticle } from './types';

export const FEATURED_JOBS: Job[] = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'TechFlow Lagos',
    location: 'Lagos (Hybrid)',
    type: 'Full-time',
    experienceLevel: 'Senior Level',
    salary: '₦800,000 - ₦1,200,000',
    description: 'We are looking for a skilled React developer to lead our frontend team...',
    postedAt: '2 days ago',
    category: 'Technology',
    applicationUrl: '#'
  },
  {
    id: '2',
    title: 'Digital Marketing Specialist',
    company: 'Capital Media Abuja',
    location: 'Abuja (Remote)',
    type: 'Full-time',
    experienceLevel: 'Mid Level',
    salary: '₦250,000 - ₦400,000',
    description: 'Execute social media campaigns and SEO strategies for top brands...',
    postedAt: '1 day ago',
    category: 'Marketing',
    applicationUrl: '#'
  },
  {
    id: '3',
    title: 'Accountant',
    company: 'Heritage Bank Port Harcourt',
    location: 'Rivers',
    type: 'Full-time',
    experienceLevel: 'Mid Level',
    salary: 'Negotiable',
    description: 'Maintain financial records and ensure compliance with tax laws...',
    postedAt: '3 hours ago',
    category: 'Finance',
    applicationUrl: '#'
  }
];

export const FEATURED_SCHOLARSHIPS: Scholarship[] = [
  {
    id: 's1',
    title: 'NNPC/Chevron JV National University Scholarship',
    provider: 'Chevron Nigeria Limited',
    coverage: 'Full',
    deadLine: 'Sep 30, 2026',
    category: 'Undergraduate',
    fieldOfStudy: ['Engineering', 'Science', 'Geology'],
    description: 'Offered to second-year university students in Nigeria...',
    requirements: ['Minimum 3.5 CGPA', 'Indigene of specific states', 'National identity number'],
    applicationUrl: '#'
  },
  {
    id: 's2',
    title: 'Commonwealth Masters Scholarships',
    provider: 'Commonwealth Scholarship Commission',
    coverage: 'Full',
    deadLine: 'Oct 15, 2026',
    category: 'Postgraduate',
    fieldOfStudy: ['All Fields'],
    description: 'Fully funded scholarship to study in the UK for Nigerian citizens...',
    requirements: ['Bachelor degree', 'Detailed study plan', 'Two references'],
    applicationUrl: '#'
  }
];

export const ADVICE_ARTICLES: AdviceArticle[] = [
  {
    id: 'a1',
    title: 'How to Ace Your Job Interview in Nigeria',
    excerpt: 'Key cultural nuances and common questions you should prepare for in the Nigerian corporate world.',
    content: `
# How to Ace Your Job Interview in Nigeria

Interviews in Nigeria can be both formal and conversational. Here is how to stand out:

## 1. Professionalism is Key
Nigerians value respect. Address interviewers with appropriate titles (Mr., Mrs., Dr.) and maintain good eye contact. Arriving early (15-30 minutes before) is non-negotiable despite "African time" stereotypes.

## 2. Know the Company & Industry
Research the company's recent projects or news. Mentioning their impact on the Nigerian economy shows genuine interest.

## 3. The "Tell Me About Yourself" Question
Focus on your achievements that relate to the job at hand. In Nigeria, employers value loyalty and a strong work ethic. Mention projects where you took initiative.

## 4. Dressing Matters
Corporate Nigeria still leans towards formal attire. When in doubt, wear a suit or a very neat "traditional" outfit (like a well-tailored Kaftan) if the environment is creative or informal.
    `,
    author: 'Tunde Adeoti',
    date: 'May 1, 2026',
    category: 'Interviews'
  },
  {
    id: 'a2',
    title: 'In-Demand Skills for the Nigerian Workforce 2026',
    excerpt: 'Beyond your degree, these soft and technical skills will get you hired faster in the current economy.',
    content: `
# In-Demand Skills for the Nigerian Workforce 2026

The Nigerian job market is shifting rapidly towards digital-first roles. Here are the top skills you need:

## 1. Digital Literacy & Data Analytics
Whether you are in HR or Engineering, understanding how to interpret data using tools like PowerBI, Tableau, or advanced Excel is a massive advantage.

## 2. Communication & Emotional Intelligence
Employers frequently complain about "unemployable" graduates. Mastery of written and verbal communication sets you apart in the first five minutes of an encounter.

## 3. Project Management
The ability to manage resources and time effectively is highly valued in the fast-paced environments of Lagos and Abuja.

## 4. Digital Marketing & Content Strategy
With the growth of the startup ecosystem (Fintech, Edtech), knowing how to reach customers online is a universal requirement.
    `,
    author: 'Chinelo Okafor',
    date: 'Apr 28, 2026',
    category: 'Skills'
  },
  {
    id: 'a3',
    title: 'Understanding Nigerian Labor Laws for Fresh Graduates',
    excerpt: 'Know your rights regarding contracts, working hours, and termination under the Nigerian Labor Act.',
    content: `
# Understanding Nigerian Labor Laws for Fresh Graduates

Entering the workforce can be daunting. Knowing the legal framework protects you from exploitation.

## 1. The Employment Contract
Under the Nigerian Labor Act, every employee must be given a written contract within 3 months of starting a job. Ensure your pay, duties, and notice periods are clearly stated.

## 2. Working Hours
Standard working hours are typically 40 hours per week. Any time worked beyond this should ideally attract overtime pay or "time-off in lieu," depending on your contract.

## 3. The NYSC Factor
If you are currently serving, you are protected by the NYSC Act. Employers are not allowed to treat "corpers" unfairly compared to regular staff in terms of workplace safety.

## 4. Leave Entitlements
After 12 months of continuous service, you are entitled to at least 6 working days of paid holiday. Maternity leave is also a constitutional right (12 weeks minimum).
    `,
    author: 'Barr. Segun Williams',
    date: 'May 2, 2026',
    category: 'Legal'
  },
  {
    id: 'a4',
    title: 'Building a Professional Network in Nigeria',
    excerpt: 'The "who you know" factor is real – here is how to build a network ethically and effectively.',
    content: `
# Building a Professional Network in Nigeria

In Nigeria, referrals (often called "long-leg") are common, but ethical networking is about value exchange.

## 1. Optimize Your LinkedIn
 recruitiers in Nigeria use LinkedIn daily. Ensure your profile has a professional headshot and a headline that explains exactly what problem you solve.

## 2. Join Professional Bodies
Groups like NIM (Nigerian Institute of Management), ICAN, or sector-specific Slack communities (like Tech-Lagos) are goldmines for connections.

## 3. Attend Events in Person
From the Lagos Start-up Week to industry conferences in Abuja, physical presence builds more trust than a thousand messages.

## 4. The "Cold Email" Strategy
Don't just ask for a job. Ask for "15 minutes of their time for career advice." Most Nigerian leaders are willing to mentor young, respectful talent.
    `,
    author: 'Funmi Balogun',
    date: 'Apr 30, 2026',
    category: 'Networking'
  },
  {
    id: 'a5',
    title: 'Writing Effective Resumes for Nigerian Employers',
    excerpt: 'How to structure your CV to beat the ATS and catch the eye of top recruiters in Lagos.',
    content: `
# Writing Effective Resumes for Nigerian Employers

Your CV is your marketing brochure. Here is how to make it sell you:

## 1. The 10-Second Test
Recruiters spend an average of 10 seconds on a CV. Put your most impressive achievements at the top (under a "Professional Summary").

## 2. Focus on Results, Not Just Duties
Instead of saying "Managed Social Media," say "Increased Instagram followers by 40% in 3 months resulting in ₦2M in new sales."

## 3. Customize for Local ATS
Many big Nigerian firms (banks, telcos) use Applicant Tracking Systems. Use keywords found in the job description to ensure you get shortlisted.

## 4. Keep it Concise
Unless you have 15+ years of experience, a 2-page CV is the gold standard for the Nigerian corporate world.
    `,
    author: 'Kelechi Ibe',
    date: 'May 3, 2026',
    category: 'Resume Tips'
  }
];

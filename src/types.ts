/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  experienceLevel: 'Entry Level' | 'Mid Level' | 'Senior Level';
  salary?: string;
  description: string;
  postedAt: string;
  category: string;
  applicationUrl: string;
}

export interface Scholarship {
  id: string;
  title: string;
  provider: string;
  coverage: 'Full' | 'Partial' | 'Tuition Only';
  deadLine: string;
  description: string;
  requirements: string[];
  fieldOfStudy: string[];
  category: 'Undergraduate' | 'Postgraduate' | 'Research' | 'Short Course';
  applicationUrl: string;
}

export interface AdviceArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  imageUrl?: string;
}

export type ApplicationState = 'idle' | 'loading' | 'success' | 'error';

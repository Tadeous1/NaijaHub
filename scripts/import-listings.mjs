/*
 * Import verified jobs and scholarships into NaijaHub.
 *
 * Example:
 *   NAJIAHUB_BASE_URL=https://your-manus-host.example \
 *   ADMIN_EMAIL=elishao2000@gmail.com \
 *   ADMIN_PASSWORD='provided-at-runtime' \
 *   node scripts/import-listings.mjs
 *
 * Credentials are intentionally read from the environment and never stored
 * in this repository. Each item has an externalId so reruns are idempotent.
 */

const baseUrl = (process.env.NAJIAHUB_BASE_URL || 'http://127.0.0.1:4174').replace(/\/$/, '');
const email = process.env.ADMIN_EMAIL || 'elishao2000@gmail.com';
const password = process.env.ADMIN_PASSWORD;

if (!password || password.length < 8) throw new Error('Set ADMIN_PASSWORD at runtime; it is not stored in the repository.');

const jobs = [
  {
    kind: 'job',
    title: 'Consultancy to Assess the Impact, Cost, and Scalability of the TSTS Intervention on Integrated PHC Service Efficiency',
    organization: 'Pathfinder International',
    location: 'Kano and Kaduna, Nigeria',
    type: 'Consultancy',
    experienceLevel: '5-9 years',
    category: 'Monitoring and Evaluation',
    description: 'Pathfinder International is seeking a consultant to assess the impact of its Task Sharing and Task Shifting intervention across primary health-care facilities in Kano and Kaduna States. The assignment covers an Interrupted Time Series assessment of integrated PHC service efficiency, cost, value for money, and scalability. Proposals are submitted by email and must follow the official RFP.',
    deadline: '2026-08-17',
    applicationUrl: 'https://drive.google.com/file/d/1BRfXXAByEsw1e0pRVPWy1Qfom-x7PRns/view?usp=sharing',
    sourceUrl: 'https://reliefweb.int/job/4225509/consultancy-assess-impact-cost-and-scalability-task-sharing-and-task-shifting-tsts-intervention-integrated-phc-service-efficiency',
    externalId: 'reliefweb-4225509',
  },
  {
    kind: 'job',
    title: 'Capacity Building Officer (CBO)',
    organization: '3iS',
    location: 'Abuja, Nigeria',
    type: 'Employment - Local contract',
    experienceLevel: '5-9 years',
    category: 'Information Management',
    salary: '₦2,100,000-₦2,400,000 monthly gross',
    description: '3iS is recruiting a Capacity Building Officer to design and deliver training and learning modules for health and nutrition information-management systems and tools. The role includes field travel across northeast and northwest Nigeria, assessments, monitoring and learning, reporting, and partner support. The detail page states an expected October 2026 start and an indicative six-month duration.',
    deadline: '2026-08-19',
    applicationUrl: 'https://3is.org/jobs/capacity-building-officer/',
    sourceUrl: 'https://reliefweb.int/job/4224985/capacity-building-officer-cbo',
    externalId: 'reliefweb-4224985',
  },
  {
    kind: 'job',
    title: 'Project Manager, Yankari',
    organization: 'Wildlife Conservation Society',
    location: 'Bauchi, Bauchi State, Nigeria',
    type: 'Full-time, fixed-term',
    experienceLevel: '10+ years',
    category: 'Program/Project Management',
    description: 'The Wildlife Conservation Society is seeking a Project Manager to lead and oversee the Yankari Project in Bauchi State. The role covers conservation leadership, law-enforcement coordination, biomonitoring, community engagement, governance, stakeholder coordination, donor reporting, and project management. The detail page states an expected October 2026 start, a 13-month renewable duration, and that applicants must be Nigerian nationals.',
    deadline: '2026-08-26',
    applicationUrl: 'https://nigeria.wcs.org/Staff/career1/ID/26503/Project-Manager.aspx',
    sourceUrl: 'https://reliefweb.int/job/4224608/project-manager',
    externalId: 'reliefweb-4224608',
  },
];

const scholarships = [
  {
    kind: 'scholarship',
    title: 'Nigeria Award Scholarship - 2025/2026',
    organization: 'Federal Ministry of Education, Nigeria',
    location: 'Nigeria',
    type: 'National scholarship',
    category: 'Education funding',
    coverage: 'Full funding; 100 slots',
    description: 'The official Federal Ministry of Education scholarship portal lists the Nigeria Award Scholarship for the 2025/2026 academic year. The portal provides the official eligibility requirements, supporting-document instructions, and application workflow; applicants should review the live official portal before submitting.',
    deadline: '2026-08-31',
    applicationUrl: 'https://scholarship.education.gov.ng/scholarships',
    sourceUrl: 'https://scholarship.education.gov.ng/scholarships',
    externalId: 'fme-nigeria-award-2025-2026',
  },
];

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: { 'content-type': 'application/json', ...(options.headers || {}) },
  });
  const text = await response.text();
  let body;
  try { body = JSON.parse(text); } catch { body = { raw: text }; }
  return { response, body };
}

function sessionCookie(response) {
  const value = response.headers.get('set-cookie') || '';
  const match = value.match(/naijahub_session=([^;]+)/);
  return match ? `naijahub_session=${match[1]}` : '';
}

const login = await request('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password }),
});
if (!login.response.ok) throw new Error(`Admin login failed (${login.response.status}): ${login.body.error || 'unknown error'}`);
const cookie = sessionCookie(login.response);
if (!cookie) throw new Error('The server did not return an authenticated session cookie.');

async function importItems(items, sourceType, sourceName) {
  const result = await request('/api/admin/import', {
    method: 'POST',
    headers: { cookie },
    body: JSON.stringify({ items, sourceType, sourceName }),
  });
  if (!result.response.ok) throw new Error(`Import failed (${result.response.status}): ${result.body.error || 'unknown error'}`);
  return result.body;
}

const jobResult = await importItems(jobs, 'reliefweb', 'ReliefWeb');
const scholarshipResult = await importItems(scholarships, 'official-portal', 'scholarship.education.gov.ng');
console.log(JSON.stringify({
  imported: { jobs: jobResult.imported, scholarships: scholarshipResult.imported },
  ids: [...jobResult.ids, ...scholarshipResult.ids],
}, null, 2));

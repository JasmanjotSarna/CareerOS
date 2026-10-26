import type { StudentProfile, TargetRole } from '@/types';
import { TARGET_ROLES } from '@/lib/data/mockData';
import type { Job, JobMatch } from '@/types/workspace';

/**
 * A transparent, deterministic match between a candidate profile and a job posting.
 *
 * The score is a *fit heuristic*, not a probability of being hired. It only uses
 * information we actually have: the candidate's declared skills, their target
 * role, and the public text of the posting. It never invents eligibility,
 * sponsorship, salary, or hiring outcomes.
 */

const SKILL_ALIASES: Record<string, string> = {
  js: 'javascript',
  ts: 'typescript',
  postgres: 'postgresql',
  'node': 'node.js',
  'nodejs': 'node.js',
  'react.js': 'react',
  'reactjs': 'react',
  'ml': 'machine learning',
  'dl': 'deep learning',
  'nlp': 'natural language processing',
  'gcp': 'google cloud',
  'aws': 'amazon web services',
  'k8s': 'kubernetes',
  'rest': 'rest apis',
  'restful apis': 'rest apis',
};

function normalizeSkill(value: string): string {
  const lower = value.trim().toLowerCase();
  return SKILL_ALIASES[lower] || lower;
}

function uniqueSkills(values: string[]): string[] {
  const seen = new Set<string>();
  const output: string[] = [];
  for (const value of values) {
    const normalized = normalizeSkill(value);
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    output.push(normalized);
  }
  return output;
}

/**
 * All skill labels we can recognise in a posting. This is intentionally a
 * curated, inspectable vocabulary rather than an opaque model call.
 */
export function knownSkillVocabulary(): string[] {
  const roleSkills = TARGET_ROLES.flatMap((role) =>
    role.requiredSkills.map((skill) => skill.name)
  );
  return uniqueSkills([
    ...roleSkills,
    'Python',
    'JavaScript',
    'TypeScript',
    'Java',
    'C++',
    'C#',
    'Go',
    'Rust',
    'SQL',
    'PostgreSQL',
    'MySQL',
    'MongoDB',
    'Redis',
    'React',
    'Next.js',
    'Vue',
    'Angular',
    'Node.js',
    'Express',
    'Django',
    'Flask',
    'FastAPI',
    'Spring Boot',
    'REST APIs',
    'GraphQL',
    'Docker',
    'Kubernetes',
    'AWS',
    'Azure',
    'Google Cloud',
    'Terraform',
    'CI/CD',
    'Git',
    'Linux',
    'System Design',
    'Data Structures',
    'Algorithms',
    'Machine Learning',
    'Deep Learning',
    'NLP',
    'PyTorch',
    'TensorFlow',
    'scikit-learn',
    'Pandas',
    'NumPy',
    'Tableau',
    'Power BI',
    'Excel',
    'Statistics',
    'A/B Testing',
    'Product Analytics',
    'Communication',
    'Leadership',
  ]);
}

export function extractSkillsFromText(text: string): string[] {
  const haystack = ` ${text.toLowerCase().replace(/[^a-z0-9+#.\s-]/g, ' ')} `;
  const matches = knownSkillVocabulary().filter((skill) => {
    const needle = normalizeSkill(skill);
    if (haystack.includes(` ${needle} `)) return true;
    // Handle dotted names such as node.js and c++ without false positives.
    const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i').test(haystack);
  });
  return uniqueSkills(matches);
}

function tokenizeTitle(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 2 && !['and', 'the', 'for', 'with', 'junior', 'senior'].includes(token));
}

function roleAlignment(job: Job, targetRole: TargetRole): { score: number; detail: string } {
  const targetTokens = new Set(tokenizeTitle(targetRole.title));
  const jobTokens = tokenizeTitle(job.title);
  if (jobTokens.length === 0) return { score: 40, detail: 'Job title is not descriptive.' };

  const overlap = jobTokens.filter((token) => targetTokens.has(token));
  const categoryTokens = new Set(tokenizeTitle(targetRole.category));
  const categoryOverlap = jobTokens.filter((token) => categoryTokens.has(token));
  const score = Math.min(
    100,
    Math.round(((overlap.length + categoryOverlap.length * 0.5) / jobTokens.length) * 100) + 35
  );

  return {
    score,
    detail: overlap.length
      ? `Title shares ${overlap.join(', ')} with your target role.`
      : 'Title differs from your target role; review the responsibilities.',
  };
}

function recencyScore(postedAt?: string, now = Date.now()): { score: number; detail: string } {
  if (!postedAt) return { score: 55, detail: 'Posting date was not provided by the source.' };
  const timestamp = new Date(postedAt).getTime();
  if (Number.isNaN(timestamp)) return { score: 55, detail: 'Posting date could not be parsed.' };
  const days = Math.max(0, Math.floor((now - timestamp) / 86_400_000));
  if (days <= 3) return { score: 100, detail: `Posted ${days === 0 ? 'today' : `${days} day(s) ago`}.` };
  if (days <= 14) return { score: 85, detail: `Posted ${days} days ago.` };
  if (days <= 30) return { score: 65, detail: `Posted ${days} days ago.` };
  return { score: 35, detail: `Posted ${days} days ago — confirm it is still open.` };
}

export function computeJobMatch(
  profile: StudentProfile,
  targetRole: TargetRole,
  job: Job
): JobMatch {
  const jobText = [
    job.title,
    job.description,
    job.tags.join(' '),
    job.employmentType,
  ].join(' ');

  const jobSkills = extractSkillsFromText(jobText);
  const profileSkills = uniqueSkills(profile.skills.map((skill) => skill.name));

  const proficiencyBySkill = new Map<string, { level: number; verified: boolean }>();
  for (const skill of profile.skills) {
    proficiencyBySkill.set(normalizeSkill(skill.name), {
      level: Math.min(100, Math.max(0, skill.currentProficiency)),
      verified: skill.verified,
    });
  }

  const matched = jobSkills.filter((skill) => proficiencyBySkill.has(skill));
  const unmatched = jobSkills.filter((skill) => !proficiencyBySkill.has(skill));

  let evidenceWeight = 0;
  for (const skill of matched) {
    const evidence = proficiencyBySkill.get(skill)!;
    // Declared-but-unverified skills still count, but count less than evidence.
    evidenceWeight += evidence.verified ? evidence.level / 100 : 0.45 + (evidence.level / 100) * 0.25;
  }
  const skillScore = jobSkills.length === 0
    ? 45
    : Math.round((evidenceWeight / jobSkills.length) * 100);

  const alignment = roleAlignment(job, targetRole);
  const recency = recencyScore(job.postedAt);

  const profileEvidence = profile.skills.length === 0
    ? 0
    : Math.min(100, Math.round((profile.skills.filter((skill) => skill.verified).length / profile.skills.length) * 100));

  // Weights are fixed and displayed in the UI so users can see what drove the score.
  const score = Math.round(
    skillScore * 0.55 +
    alignment.score * 0.25 +
    profileEvidence * 0.10 +
    recency.score * 0.10
  );

  const criticalSkills = uniqueSkills(
    targetRole.requiredSkills.filter((skill) => skill.critical).map((skill) => skill.name)
  );
  const preferredSkills = uniqueSkills(
    targetRole.requiredSkills.filter((skill) => !skill.critical).map((skill) => skill.name)
  );

  return {
    score: Math.max(0, Math.min(100, score)),
    matchedSkills: matched.map((skill) => displaySkill(skill)),
    missingRequiredSkills: criticalSkills
      .filter((skill) => !profileSkills.includes(skill))
      .map((skill) => displaySkill(skill)),
    missingPreferredSkills: preferredSkills
      .filter((skill) => !profileSkills.includes(skill))
      .map((skill) => displaySkill(skill)),
    factors: [
      {
        label: 'Skill evidence',
        score: skillScore,
        detail: jobSkills.length
          ? `${matched.length} of ${jobSkills.length} skills named in this posting appear on your profile.`
          : 'This posting names no skills we can verify from its text.',
      },
      { label: 'Role alignment', score: alignment.score, detail: alignment.detail },
      {
        label: 'Profile evidence',
        score: profileEvidence,
        detail: profileEvidence === 0
          ? 'Add skills to your profile to establish evidence.'
          : `${profile.skills.filter((skill) => skill.verified).length} of ${profile.skills.length} skills are verified.`,
      },
      { label: 'Posting recency', score: recency.score, detail: recency.detail },
    ],
    disclaimer: 'This is an explainable fit heuristic based on your profile and the posting text — not a hiring probability.',
  };
}

function displaySkill(normalized: string): string {
  return normalized
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function findDuplicateApplication(
  applications: Array<{ company: string; roleTitle: string; jobUrl?: string }>,
  candidate: { company: string; roleTitle: string; jobUrl?: string }
): boolean {
  const normalizeUrl = (url?: string) =>
    (url || '').trim().toLowerCase().replace(/[#?].*$/, '').replace(/\/$/, '');
  const targetUrl = normalizeUrl(candidate.jobUrl);
  const targetCompany = candidate.company.trim().toLowerCase();
  const targetRole = candidate.roleTitle.trim().toLowerCase();

  return applications.some((application) => {
    const url = normalizeUrl(application.jobUrl);
    if (targetUrl && url && targetUrl === url) return true;
    return (
      application.company.trim().toLowerCase() === targetCompany &&
      application.roleTitle.trim().toLowerCase() === targetRole
    );
  });
}

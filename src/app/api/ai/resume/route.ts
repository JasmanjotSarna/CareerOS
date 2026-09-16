import { NextRequest, NextResponse } from 'next/server';
import { callClaudeJson } from '@/lib/ai/claudeClient';
import { checkRateLimit } from '@/lib/ai/rateLimit';
import { ResumeData, TargetRole } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anon';
    const rateCheck = checkRateLimit(`ai-resume-${ip}`, 25);
    if (!rateCheck.success) {
      return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 });
    }
    const body = await req.json();
    const { action, resumeText, targetRole } = body;

    if (action === 'extractSkills') {
      const fallback = () => {
        const knownKeywords = [
          'Python', 'Java', 'C++', 'JavaScript', 'TypeScript', 'SQL', 'PostgreSQL', 'MySQL',
          'Data Structures', 'Algorithms', 'FastAPI', 'React', 'Node.js', 'Docker', 'Kubernetes',
          'Git', 'System Design', 'REST APIs', 'Pandas', 'NumPy', 'PyTorch', 'Machine Learning',
          'Operating Systems', 'OOP', 'Object-Oriented Design', 'Redis', 'Kafka', 'AWS'
        ];
        const lower = (resumeText || '').toLowerCase();
        return knownKeywords.filter(kw => lower.includes(kw.toLowerCase()));
      };

      const systemPrompt = `You are CareerOS AI Skill Extraction Engine.
Analyze the student resume text and extract all technical skills, programming languages, databases, frameworks, developer tools, and computer science fundamentals.
Return ONLY a JSON array of strings, for example: ["Python", "SQL", "Data Structures", "Docker"].`;

      const userPrompt = `Resume Content:\n${resumeText || 'Python SQL Data Structures Git REST APIs FastAPI Pandas Docker'}`;

      const skills = await callClaudeJson<string[]>({
        systemPrompt,
        userPrompt,
        fallback
      });

      return NextResponse.json({ skills });
    }

    // Default: analyzeResume
    const role: TargetRole = targetRole || {
      id: 'role-sde-1',
      title: 'Software Engineer — SDE-1',
      category: 'Software Engineering',
      description: 'Backend microservices, clean code, scalable systems',
      salaryRange: '₹12 LPA — ₹24 LPA',
      marketDemand: 'Very High',
      experienceLevel: 'Entry Level',
      educationExpectations: 'B.Tech CSE/IT',
      experienceExpectations: 'Projects in REST APIs & databases',
      softSkills: [],
      interviewAreas: [],
      aptitudeAreas: [],
      communicationExpectations: '',
      requiredSkills: [
        { name: 'Python', category: 'Programming', requiredProficiency: 85, weight: 1, critical: true, benchmarkDescription: '' },
        { name: 'Data Structures', category: 'Programming', requiredProficiency: 85, weight: 1, critical: true, benchmarkDescription: '' },
        { name: 'SQL', category: 'Data', requiredProficiency: 80, weight: 0.9, critical: true, benchmarkDescription: '' },
        { name: 'System Design', category: 'Backend', requiredProficiency: 70, weight: 0.8, critical: true, benchmarkDescription: '' }
      ]
    };

    const fallback = (): ResumeData => {
      return {
        fileName: 'Jasmanjot_Singh_Resume_2026.pdf',
        uploadedAt: new Date().toISOString(),
        atsScore: 78,
        scores: {
          keywordMatch: 76,
          impactStatements: 72,
          formatting: 88,
          roleAlignment: 79,
        },
        parsedSkills: ['Python', 'SQL', 'Data Structures', 'Git', 'REST APIs', 'FastAPI'],
        extractedProjects: [
          {
            title: 'Order Processing Microservice',
            description: 'Engineered high-throughput RESTful API backend handling 1,200 req/sec with PostgreSQL connection pooling.',
            technologies: ['FastAPI', 'PostgreSQL', 'Docker', 'Redis']
          }
        ],
        missingKeywords: ['System Design', 'SQL Indexing', 'Kafka'],
        suggestedImprovements: [
          {
            id: 'imp-1',
            section: 'Projects: Order Processing',
            original: 'Built a backend service in Python and PostgreSQL for order processing.',
            improved: 'Architected high-throughput REST API using FastAPI and PostgreSQL with indexing, reducing order processing latency by 38% under 1,500 concurrent requests.',
            explanation: 'Replaced passive phrasing with quantified business impact and specific concurrency metrics.',
            applied: false
          }
        ],
        summaryFeedback: `Resume aligns well with ${role.title} requirements. Quantifying engineering impact statements and incorporating missing keywords will raise ATS score above 85%.`
      };
    };

    const systemPrompt = `You are CareerOS ATS Resume Parser & Optimization Engine.
You evaluate resumes against target job roles.
Your output must conform EXACTLY to this TypeScript interface:
interface ResumeData {
  fileName: string;
  uploadedAt: string;
  atsScore: number; // 0 to 100
  scores: {
    keywordMatch: number; // 0 to 100
    impactStatements: number; // 0 to 100
    formatting: number; // 0 to 100
    roleAlignment: number; // 0 to 100
  };
  parsedSkills: string[];
  extractedProjects: Array<{
    title: string;
    description: string;
    technologies: string[];
  }>;
  missingKeywords: string[];
  suggestedImprovements: Array<{
    id: string;
    section: string;
    original: string;
    improved: string;
    explanation: string;
    applied: boolean;
  }>;
  summaryFeedback: string;
}`;

    const userPrompt = `Target Role: ${role.title} (${role.category})\nRequired Skills: ${role.requiredSkills.map(s => s.name).join(', ')}\n\nResume Text:\n${resumeText || 'Python SQL Data Structures Git REST APIs FastAPI'}`;

    const resumeData = await callClaudeJson<ResumeData>({
      systemPrompt,
      userPrompt,
      fallback
    });

    return NextResponse.json(resumeData);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Resume processing error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { callUniversalAIJson } from '@/lib/ai/universalAI';
import { checkResumeAnalysisRateLimit, computeContentHash, getCachedAnalysis, setCachedAnalysis } from '@/lib/ai/rateLimit';
import { ResumeData, TargetRole } from '@/types';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'text/plain',
];

function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
}

async function extractTextFromBuffer(buffer: Buffer, mimeType: string, filename: string): Promise<string> {
  const ext = filename.split('.').pop()?.toLowerCase();

  if (mimeType === 'application/pdf' || ext === 'pdf') {
    try {
      // Use pdf-parse for robust PDF text extraction
      const pdfParse = require('pdf-parse');
      const data = await pdfParse(buffer);
      return data.text || '';
    } catch (err) {
      console.warn('pdf-parse failed, falling back to basic stream extraction:', err);
      // Basic fallback extraction of printable ASCII/UTF-8 characters
      return buffer.toString('utf-8').replace(/[^\x20-\x7E\t\n\r]/g, ' ');
    }
  }

  if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    ext === 'docx'
  ) {
    try {
      // Extract text content from Word XML
      const raw = buffer.toString('utf-8');
      const matches = raw.match(/<w:t[^>]*>(.*?)<\/w:t>/g);
      if (matches && matches.length > 0) {
        return matches
          .map((m) => m.replace(/<[^>]+>/g, ''))
          .join(' ');
      }
    } catch {
      // fallback to plain text extraction
    }
  }

  // Fallback for text/plain or other documents
  return buffer.toString('utf-8');
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const directText = formData.get('text') as string | null;
    const targetRoleId = (formData.get('targetRoleId') as string) || 'role-sde-1';

    let extractedText = '';
    let fileName = 'Uploaded_Resume.pdf';
    let fileBuffer: Buffer | null = null;
    let mimeType = 'text/plain';

    if (file && typeof file === 'object' && file.size > 0) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File size exceeds the 10MB limit (size: ${(file.size / 1024 / 1024).toFixed(1)}MB).` },
          { status: 400 }
        );
      }

      fileName = file.name;
      mimeType = file.type || 'application/octet-stream';
      const arrayBuffer = await file.arrayBuffer();
      fileBuffer = Buffer.from(arrayBuffer);

      extractedText = await extractTextFromBuffer(fileBuffer, mimeType, fileName);
    } else if (directText && directText.trim().length > 0) {
      extractedText = directText.trim();
      fileName = 'Pasted_Resume_Text.txt';
      fileBuffer = Buffer.from(extractedText, 'utf-8');
      mimeType = 'text/plain';
    } else {
      return NextResponse.json(
        { error: 'No resume file or text content provided.' },
        { status: 400 }
      );
    }

    if (!extractedText || extractedText.trim().length < 20) {
      return NextResponse.json(
        { error: 'Unable to extract legible text from the uploaded document. Please check the file formatting.' },
        { status: 422 }
      );
    }

    // Authenticate user via @supabase/ssr session cookies (only if cookies exist)
    const cookieStore = await cookies();
    const hasSupabaseCookies = cookieStore.getAll().some(c =>
      c.name.startsWith('sb-') || c.name.includes('auth-token')
    );

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    let user = null;
    let supabase: any = null;

    if (supabaseUrl && supabaseAnonKey && hasSupabaseCookies) {
      try {
        supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
          cookies: {
            get(name: string) {
              return cookieStore.get(name)?.value;
            },
            set(name: string, value: string, options: CookieOptions) {
              cookieStore.set({ name, value, ...options });
            },
            remove(name: string, options: CookieOptions) {
              cookieStore.delete({ name, ...options });
            },
          },
        });

        const getUserPromise = supabase.auth.getUser();
        const timeoutPromise = new Promise<{ data: { user: null }; error: Error }>((_, reject) =>
          setTimeout(() => reject(new Error('Auth timeout')), 2500)
        );

        const result = await Promise.race([getUserPromise, timeoutPromise]);
        user = result.data?.user || null;
      } catch {
        user = null;
      }
    }

    let storagePath = '';
    const userId = user?.id;

    // Upload to private Supabase Storage bucket 'resumes' if user is authenticated
    if (supabase && userId && fileBuffer) {
      storagePath = `${userId}/${Date.now()}_${sanitizeFilename(fileName)}`;
      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(storagePath, fileBuffer, {
          contentType: mimeType,
          upsert: true,
        });

      if (uploadError) {
        console.warn('Supabase storage upload notice:', uploadError.message);
      }
    }

    // Apply per-user rate limit
    const rateCheck = checkResumeAnalysisRateLimit(userId || 'anon-upload');
    if (!rateCheck.success) {
      return NextResponse.json(
        {
          error: 'rate_limited',
          message: rateCheck.message || 'Rate limit reached for resume analysis. Please wait before uploading again.',
          reset: rateCheck.reset,
          remaining: 0,
        },
        { status: 429 }
      );
    }

    // Check deduplication cache
    const cacheHash = computeContentHash(extractedText, targetRoleId);
    let parsedData = getCachedAnalysis<ResumeData>(cacheHash);

    if (!parsedData) {
      const systemPrompt = `You are CareerOS ATS Resume Analysis Engine.
Analyze this resume text for a candidate targeting role: "${targetRoleId}".
You must evaluate the ACTUAL resume content provided. Do not hallucinate projects.
Return ONLY valid JSON conforming to this schema:
{
  "fileName": "${fileName}",
  "uploadedAt": "${new Date().toISOString()}",
  "atsScore": number, // 0 to 100
  "scores": {
    "keywordMatch": number, // 0 to 100
    "impactStatements": number, // 0 to 100
    "formatting": number, // 0 to 100
    "roleAlignment": number // 0 to 100
  },
  "parsedSkills": string[], // List of genuine skills found in the text
  "extractedProjects": [ // 1-3 ACTUAL projects from the resume
    {
      "title": string,
      "description": string,
      "technologies": string[]
    }
  ],
  "missingKeywords": string[], // Missing skills for the target role
  "suggestedImprovements": [ // 2-3 specific improvements quoting real lines from the resume and improving them
    {
      "id": "imp-1",
      "section": string,
      "original": string,
      "improved": string,
      "explanation": string,
      "applied": false
    }
  ],
  "summaryFeedback": string // Concise analysis of strengths and next steps
}`;

      const userPrompt = `Target Role ID: ${targetRoleId}

Candidate Resume Text:
${extractedText}`;

      parsedData = await callUniversalAIJson<ResumeData>({
        systemPrompt,
        userPrompt,
        temperature: 0.15,
      });

      parsedData.fileName = fileName;
      parsedData.uploadedAt = new Date().toISOString();
      setCachedAnalysis(cacheHash, parsedData);
    }

    const compositeAtsScore = parsedData.atsScore;

    // Persist to public.resumes table if authenticated
    if (userId) {
      try {
        const { error: insertError } = await supabase.from('resumes').insert({
          student_id: userId,
          storage_path: storagePath || `local_${Date.now()}_${sanitizeFilename(fileName)}`,
          parsed_text: extractedText.slice(0, 10000),
          ats_score: compositeAtsScore,
        });

        if (insertError) {
          console.warn('Notice inserting into public.resumes:', insertError.message);
        }
      } catch (err) {
        console.warn('Error saving to public.resumes:', err);
      }
    }

    return NextResponse.json({
      success: true,
      resumeData: parsedData,
      storagePath,
      atsScore: compositeAtsScore,
    });
  } catch (err: unknown) {
    console.error('Server resume upload error:', err);
    const msg = err instanceof Error ? err.message : 'Internal resume parsing failure.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

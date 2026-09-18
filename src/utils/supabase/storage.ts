import { createClient } from './client';

/**
 * Standardized storage bucket names matching Supabase RLS policies
 */
export const STORAGE_BUCKETS = {
  RESUMES: 'resumes',
  INTERVIEW_RECORDINGS: 'interview-recordings',
} as const;

export type StorageBucket = typeof STORAGE_BUCKETS[keyof typeof STORAGE_BUCKETS];

/**
 * Helper to construct the strictly enforced {student_id}/{filename} storage path
 */
export function getStorageObjectPath(studentId: string, filename: string): string {
  // Sanitize filename to prevent directory traversal or invalid characters
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  return `${studentId}/${sanitizedFilename}`;
}

/**
 * Uploads a file to a private Supabase storage bucket under {student_id}/{filename}
 */
export async function uploadStorageObject({
  bucket,
  studentId,
  filename,
  file,
  contentType,
}: {
  bucket: StorageBucket;
  studentId: string;
  filename: string;
  file: File | Blob;
  contentType?: string;
}) {
  const supabase = createClient();
  const filePath = getStorageObjectPath(studentId, filename);

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      upsert: true,
      contentType,
    });

  if (error) {
    throw error;
  }

  return {
    path: data.path,
    fullPath: data.fullPath,
    bucket,
  };
}

/**
 * Creates a temporary signed URL to download/view a private storage object
 */
export async function createStorageSignedUrl({
  bucket,
  filePath,
  expiresInSeconds = 3600, // 1 hour default
}: {
  bucket: StorageBucket;
  filePath: string;
  expiresInSeconds?: number;
}) {
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(filePath, expiresInSeconds);

  if (error) {
    throw error;
  }

  return data.signedUrl;
}

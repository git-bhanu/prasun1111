import type { Env } from './types';

export async function setCommentStatus(env: Env, id: number, status: 'approved' | 'rejected'): Promise<{ id: number; page_slug: string } | null> {
  return env.DB.prepare('UPDATE comments SET status = ? WHERE id = ? RETURNING id, page_slug').bind(status, id).first<{ id: number; page_slug: string }>();
}

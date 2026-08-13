export interface D1Result<T = unknown> {
  results: T[];
  success: boolean;
  meta: unknown;
}

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(): Promise<T | null>;
  run(): Promise<D1Result>;
  all<T = unknown>(): Promise<D1Result<T>>;
}

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
}

export interface Env {
  DB: D1Database;
  ADMIN_PASSWORD: string;
  TURNSTILE_SECRET_KEY: string;
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
  TELEGRAM_WEBHOOK_SECRET?: string;
}

export interface PagesContext<Params extends Record<string, string> = Record<string, string>> {
  request: Request;
  env: Env;
  params: Params;
  waitUntil: (promise: Promise<unknown>) => void;
}

export interface CommentRow {
  id: number;
  page_slug: string;
  parent_id: number | null;
  author_name: string;
  author_email?: string | null;
  body: string;
  status?: string;
  is_author_reply: number;
  is_pinned: number;
  likes_count?: number;
  created_at: string;
}

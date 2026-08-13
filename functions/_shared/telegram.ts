import type { Env } from './types';

const PAGE_LABELS: Record<string, string> = {
  artworks: 'Artworks',
  installations: 'Installations',
  films: 'Films',
  design: 'Design',
  writings: 'Writings',
};

export function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function titleCase(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}

function pageLabel(pageSlug: string): string {
  const [category, ...rest] = pageSlug.split('/');
  const itemSlug = rest.join('/');
  const categoryLabel = PAGE_LABELS[category] ?? category;
  return itemSlug ? `${categoryLabel}: ${titleCase(itemSlug)}` : categoryLabel;
}

function buildPageUrl(origin: string, pageSlug: string): string {
  const [category, ...rest] = pageSlug.split('/');
  const itemSlug = rest.join('/');
  switch (category) {
    case 'artworks':
      return `${origin}/artworks?artwork=${encodeURIComponent(itemSlug)}`;
    case 'installations':
      return `${origin}/installations?installation=${encodeURIComponent(itemSlug)}`;
    case 'design':
      return `${origin}/design?design=${encodeURIComponent(itemSlug)}`;
    case 'writings':
      return `${origin}/writings?writing=${encodeURIComponent(itemSlug)}`;
    case 'films':
      return `${origin}/films`;
    default:
      return origin;
  }
}

function formatIst(createdAtUtc: string): string {
  const date = new Date(`${createdAtUtc}Z`);
  const formatted = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
  return `${formatted} IST`;
}

function chatIds(env: Env): string[] {
  return (env.TELEGRAM_CHAT_ID ?? '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);
}

async function callTelegram(env: Env, method: string, body: unknown): Promise<Response> {
  const res = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    console.error(`telegram ${method} failed`, res.status, await res.text());
  }
  return res;
}

export interface NewCommentNotification {
  id: number;
  page_slug: string;
  author_name: string;
  body: string;
  created_at: string;
}

export async function notifyNewComment(env: Env, origin: string, comment: NewCommentNotification): Promise<void> {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return;

  const text = [
    '<b>New Comment</b>',
    '',
    `<b>${escapeHtml(comment.author_name)}</b>`,
    escapeHtml(pageLabel(comment.page_slug)),
    '',
    `<blockquote>${escapeHtml(comment.body)}</blockquote>`,
    '',
    formatIst(comment.created_at),
  ].join('\n');

  const replyMarkup = {
    inline_keyboard: [
      [
        { text: 'View page', url: buildPageUrl(origin, comment.page_slug) },
        { text: 'Reject', callback_data: `reject:${comment.id}` },
      ],
    ],
  };

  await Promise.all(
    chatIds(env).map((chatId) =>
      callTelegram(env, 'sendMessage', { chat_id: chatId, text, parse_mode: 'HTML', reply_markup: replyMarkup }).catch((err) =>
        console.error('telegram notify failed', chatId, err)
      )
    )
  );
}

export async function answerCallbackQuery(env: Env, callbackQueryId: string, text?: string): Promise<void> {
  await callTelegram(env, 'answerCallbackQuery', { callback_query_id: callbackQueryId, text }).catch(() => {});
}

export interface ViewPageButton {
  text: string;
  url: string;
}

export async function editRejectedMessage(
  env: Env,
  chatId: number | string,
  messageId: number,
  originalText: string,
  viewButton?: ViewPageButton
): Promise<void> {
  await callTelegram(env, 'editMessageText', {
    chat_id: chatId,
    message_id: messageId,
    text: `${originalText}\n\n<b>Status:</b> Rejected`,
    parse_mode: 'HTML',
    reply_markup: { inline_keyboard: viewButton ? [[viewButton]] : [] },
  }).catch((err) => console.error('telegram edit failed', err));
}

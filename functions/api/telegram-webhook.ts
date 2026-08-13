import { setCommentStatus } from '../_shared/comments';
import { answerCallbackQuery, editRejectedMessage } from '../_shared/telegram';
import type { Env, PagesContext } from '../_shared/types';

interface TelegramInlineButton {
  text: string;
  url?: string;
  callback_data?: string;
}

interface TelegramCallbackQuery {
  id: string;
  data?: string;
  message?: {
    message_id: number;
    text?: string;
    chat: { id: number };
    reply_markup?: { inline_keyboard?: TelegramInlineButton[][] };
  };
}

interface TelegramUpdate {
  callback_query?: TelegramCallbackQuery;
}

function ok() {
  return new Response('ok');
}

function isAllowedChat(env: Env, chatId: number): boolean {
  const allowlist = (env.TELEGRAM_CHAT_ID ?? '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);
  return allowlist.includes(String(chatId));
}

async function handleReject(env: Env, callback: TelegramCallbackQuery, commentId: number) {
  const chatId = callback.message?.chat.id;
  const messageId = callback.message?.message_id;
  if (!chatId || !messageId) return;

  const updated = await setCommentStatus(env, commentId, 'rejected');
  if (!updated) {
    await answerCallbackQuery(env, callback.id, 'Comment not found.');
    return;
  }

  const viewButton = callback.message?.reply_markup?.inline_keyboard?.[0]?.find((button) => button.url);
  await editRejectedMessage(env, chatId, messageId, callback.message?.text ?? '', viewButton ? { text: viewButton.text, url: viewButton.url! } : undefined);
  await answerCallbackQuery(env, callback.id, 'Comment rejected.');
}

export async function onRequest(context: PagesContext) {
  const { request, env } = context;

  if (request.method !== 'POST') {
    return new Response('Not found', { status: 404 });
  }

  if (env.TELEGRAM_WEBHOOK_SECRET) {
    const header = request.headers.get('X-Telegram-Bot-Api-Secret-Token');
    if (header !== env.TELEGRAM_WEBHOOK_SECRET) {
      return new Response('Unauthorized', { status: 401 });
    }
  }

  let update: TelegramUpdate;
  try {
    update = await request.json();
  } catch {
    return ok();
  }

  const callback = update.callback_query;
  if (!callback?.data || !callback.message) return ok();

  if (!isAllowedChat(env, callback.message.chat.id)) return ok();

  const [action, idString] = callback.data.split(':');
  const commentId = Number(idString);

  if (action === 'reject' && Number.isInteger(commentId)) {
    await handleReject(env, callback, commentId);
  } else {
    await answerCallbackQuery(env, callback.id);
  }

  return ok();
}

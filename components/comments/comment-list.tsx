import type { CommentItemData } from '@/components/comments/comment-item';
import { CommentItem } from '@/components/comments/comment-item';
import { cn } from '@/lib/utils';

export interface CommentListProps {
  comments: CommentItemData[];
  dark?: boolean;
  hasPinned?: boolean;
}

export function CommentList({ comments, dark, hasPinned = false }: CommentListProps) {
  const topLevel = comments.filter((c) => c.parent_id === null);
  const repliesByParent = new Map<number, CommentItemData[]>();
  for (const c of comments) {
    if (c.parent_id === null) continue;
    const existing = repliesByParent.get(c.parent_id) ?? [];
    existing.push(c);
    repliesByParent.set(c.parent_id, existing);
  }

  if (topLevel.length === 0) {
    if (hasPinned) return null;
    return <p className={cn('text-[14px]', dark ? 'text-white/50' : 'text-black/50')}>No comments yet.</p>;
  }

  return (
    <div className='flex flex-col gap-2'>
      {topLevel.map((comment) => (
        <CommentItem key={comment.id} comment={comment} replies={repliesByParent.get(comment.id) ?? []} dark={dark} />
      ))}
    </div>
  );
}

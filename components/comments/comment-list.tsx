import type { CommentItemData } from '@/components/comments/comment-item';
import { CommentItem } from '@/components/comments/comment-item';

export interface CommentListProps {
  comments: CommentItemData[];
  pageSlug: string;
  onReplySubmitted: () => void;
}

export function CommentList({ comments, pageSlug, onReplySubmitted }: CommentListProps) {
  const topLevel = comments.filter((c) => c.parent_id === null);
  const repliesByParent = new Map<number, CommentItemData[]>();
  for (const c of comments) {
    if (c.parent_id === null) continue;
    const existing = repliesByParent.get(c.parent_id) ?? [];
    existing.push(c);
    repliesByParent.set(c.parent_id, existing);
  }

  if (topLevel.length === 0) {
    return <p className='text-[14px] text-black/50'>No comments yet.</p>;
  }

  return (
    <div className='flex flex-col gap-4'>
      {topLevel.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          replies={repliesByParent.get(comment.id) ?? []}
          pageSlug={pageSlug}
          onReplySubmitted={onReplySubmitted}
          allowReply
        />
      ))}
    </div>
  );
}

'use client';

import { formatDistanceToNow } from 'date-fns';
import { Heart, Pin } from 'lucide-react';
import { useState } from 'react';

import type { DashboardComment } from '@/components/dashboard/dashboard-view';
import { ReplyDialog } from '@/components/dashboard/reply-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { TableCell, TableRow } from '@/components/ui/table';
import { pageSlugToLabel, pageSlugToUrl } from '@/lib/page-slug';

const STATUS_OPTIONS: DashboardComment['status'][] = ['approved', 'rejected'];

export interface CommentRowProps {
  comment: DashboardComment;
  selected: boolean;
  onToggleSelect: (id: number) => void;
  onChanged: () => void;
}

export function CommentRow({ comment, selected, onToggleSelect, onChanged }: CommentRowProps) {
  const [replyOpen, setReplyOpen] = useState(false);

  async function handleDelete() {
    await fetch(`/api/dashboard/comments/${comment.id}`, { method: 'DELETE' });
    onChanged();
  }

  async function handleStatus(status: DashboardComment['status']) {
    await fetch(`/api/dashboard/comments/${comment.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    onChanged();
  }

  async function handlePin() {
    await fetch(`/api/dashboard/comments/${comment.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pinned: !comment.is_pinned }),
    });
    onChanged();
  }

  return (
    <TableRow>
      <TableCell className='pl-4'>
        <Checkbox checked={selected} onCheckedChange={() => onToggleSelect(comment.id)} aria-label='Select row' />
      </TableCell>
      <TableCell className='font-medium'>
        <div className='flex items-center gap-2'>
          {comment.author_name}
          {comment.is_author_reply ? <Badge variant='outline'>Author</Badge> : null}
          {comment.is_pinned ? (
            <Badge variant='secondary' className='gap-1'>
              <Pin size={11} />
              Pinned
            </Badge>
          ) : null}
        </div>
      </TableCell>
      <TableCell>
        <a
          href={pageSlugToUrl(comment.page_slug)}
          target='_blank'
          rel='noopener noreferrer'
          className='text-muted-foreground underline underline-offset-2 hover:text-foreground'
        >
          {pageSlugToLabel(comment.page_slug)}
        </a>
      </TableCell>
      <TableCell className='max-w-sm truncate'>{comment.body}</TableCell>
      <TableCell className='text-center tabular-nums'>
        <span className='inline-flex items-center gap-1 text-muted-foreground'>
          <Heart size={13} />
          {comment.likes_count ?? 0}
        </span>
      </TableCell>
      <TableCell>
        <RadioGroup value={comment.status} onValueChange={(value) => handleStatus(value as DashboardComment['status'])} className='flex flex-row gap-3'>
          {STATUS_OPTIONS.map((status) => (
            <div key={status} className='flex items-center gap-1.5'>
              <RadioGroupItem value={status} id={`status-${comment.id}-${status}`} />
              <Label htmlFor={`status-${comment.id}-${status}`} className='text-xs capitalize'>
                {status}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </TableCell>
      <TableCell className='text-muted-foreground' title={new Date(`${comment.created_at}Z`).toLocaleString()}>
        {formatDistanceToNow(new Date(`${comment.created_at}Z`), { addSuffix: true })}
      </TableCell>
      <TableCell className='pr-4'>
        <div className='flex gap-2'>
          <Button size='sm' variant='outline' onClick={() => setReplyOpen(true)}>
            Reply
          </Button>
          <Button size='sm' variant='outline' onClick={handlePin}>
            {comment.is_pinned ? 'Unpin' : 'Pin'}
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button size='sm' variant='destructive'>
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete this comment?</DialogTitle>
              </DialogHeader>
              <DialogFooter>
                <Button variant='destructive' onClick={handleDelete}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </TableCell>
      <ReplyDialog open={replyOpen} onOpenChange={setReplyOpen} pageSlug={comment.page_slug} parentId={comment.id} onReplied={onChanged} />
    </TableRow>
  );
}

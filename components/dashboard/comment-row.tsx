'use client';

import { formatDistanceToNow } from 'date-fns';
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

const STATUS_OPTIONS: DashboardComment['status'][] = ['approved', 'rejected'];

function pageSlugToUrl(pageSlug: string): string {
  const [category, ...rest] = pageSlug.split('/');
  const itemSlug = rest.join('/');
  switch (category) {
    case 'artworks':
      return `/artworks?artwork=${encodeURIComponent(itemSlug)}`;
    case 'installations':
      return `/installations?installation=${encodeURIComponent(itemSlug)}`;
    case 'design':
      return `/design?design=${encodeURIComponent(itemSlug)}`;
    case 'writings':
      return `/writings?writing=${encodeURIComponent(itemSlug)}`;
    case 'films':
      return '/films';
    default:
      return '/';
  }
}

function titleCase(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}

function pageSlugToLabel(pageSlug: string): string {
  const [category, ...rest] = pageSlug.split('/');
  const itemSlug = rest.join('/');
  const categoryLabel = category ? category[0].toUpperCase() + category.slice(1) : pageSlug;
  if (!itemSlug) return categoryLabel;
  return `${categoryLabel}: ${titleCase(itemSlug)}`;
}

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
      <TableCell>
        <Checkbox checked={selected} onCheckedChange={() => onToggleSelect(comment.id)} aria-label='Select row' />
      </TableCell>
      <TableCell>
        {comment.author_name}
        {comment.is_author_reply ? (
          <Badge variant='outline' className='ml-2'>
            Author
          </Badge>
        ) : null}
        {comment.is_pinned ? (
          <Badge variant='secondary' className='ml-2'>
            Pinned
          </Badge>
        ) : null}
      </TableCell>
      <TableCell>
        <a href={pageSlugToUrl(comment.page_slug)} target='_blank' rel='noopener noreferrer' className='underline underline-offset-2 hover:no-underline'>
          {pageSlugToLabel(comment.page_slug)}
        </a>
      </TableCell>
      <TableCell className='max-w-sm truncate'>{comment.body}</TableCell>
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
      <TableCell title={new Date(`${comment.created_at}Z`).toLocaleString()}>
        {formatDistanceToNow(new Date(`${comment.created_at}Z`), { addSuffix: true })}
      </TableCell>
      <TableCell className='flex gap-2'>
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
      </TableCell>
      <ReplyDialog open={replyOpen} onOpenChange={setReplyOpen} pageSlug={comment.page_slug} parentId={comment.id} onReplied={onChanged} />
    </TableRow>
  );
}

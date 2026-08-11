'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export interface ReplyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pageSlug: string;
  parentId: number;
  onReplied: () => void;
}

export function ReplyDialog({ open, onOpenChange, pageSlug, parentId, onReplied }: ReplyDialogProps) {
  const [authorName, setAuthorName] = useState('');
  const [body, setBody] = useState('');

  async function handleSubmit() {
    await fetch('/api/dashboard/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page_slug: pageSlug, parent_id: parentId, author_name: authorName, body }),
    });
    setAuthorName('');
    setBody('');
    onOpenChange(false);
    onReplied();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reply as author</DialogTitle>
        </DialogHeader>
        <div className='flex flex-col gap-3'>
          <Label htmlFor='reply-author-name'>Name</Label>
          <Input id='reply-author-name' value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
          <Label htmlFor='reply-body'>Reply</Label>
          <Textarea id='reply-body' value={body} onChange={(e) => setBody(e.target.value)} />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Post reply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

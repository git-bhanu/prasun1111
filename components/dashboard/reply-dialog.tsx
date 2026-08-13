'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const AUTHOR_NAME = 'PRASUN MAZUMDAR';

export interface ReplyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pageSlug: string;
  parentId: number;
  onReplied: () => void;
}

export function ReplyDialog({ open, onOpenChange, pageSlug, parentId, onReplied }: ReplyDialogProps) {
  const [body, setBody] = useState('');

  async function handleSubmit() {
    await fetch('/api/dashboard/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page_slug: pageSlug, parent_id: parentId, author_name: AUTHOR_NAME, body }),
    });
    setBody('');
    onOpenChange(false);
    onReplied();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Reply as {AUTHOR_NAME}</DialogTitle>
        </DialogHeader>
        <div className='flex flex-col gap-3'>
          <Label htmlFor='reply-body'>Reply</Label>
          <Textarea id='reply-body' value={body} onChange={(e) => setBody(e.target.value)} className='min-h-64' />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Post reply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

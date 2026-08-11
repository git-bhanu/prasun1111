'use client';

import { useCallback, useEffect, useState } from 'react';

import { CommentRow } from '@/components/dashboard/comment-row';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export interface DashboardComment {
  id: number;
  page_slug: string;
  parent_id: number | null;
  author_name: string;
  author_email: string | null;
  body: string;
  status: 'pending' | 'approved' | 'rejected';
  is_author_reply: number;
  is_pinned: number;
  created_at: string;
}

const PAGE_CATEGORIES = ['artworks', 'installations', 'films', 'design', 'writings'];
const STATUSES = ['approved', 'rejected'];

export function DashboardView({ onLogout }: { onLogout: () => void }) {
  const [comments, setComments] = useState<DashboardComment[]>([]);
  const [pageFilter, setPageFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const load = useCallback(async () => {
    const params = new URLSearchParams();
    if (pageFilter !== 'all') params.set('page', pageFilter);
    if (statusFilter !== 'all') params.set('status', statusFilter);
    const res = await fetch(`/api/dashboard/comments?${params.toString()}`);
    if (!res.ok) return;
    const payload = await res.json();
    setComments(payload.comments ?? []);
    setSelectedIds(new Set());
  }, [pageFilter, statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  function toggleSelect(id: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    setSelectedIds((prev) => (prev.size === comments.length ? new Set() : new Set(comments.map((c) => c.id))));
  }

  async function bulkSetStatus(status: DashboardComment['status']) {
    await Promise.all(
      Array.from(selectedIds).map((id) =>
        fetch(`/api/dashboard/comments/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        })
      )
    );
    load();
  }

  async function bulkDelete() {
    await Promise.all(Array.from(selectedIds).map((id) => fetch(`/api/dashboard/comments/${id}`, { method: 'DELETE' })));
    load();
  }

  return (
    <div className='flex flex-col gap-6 p-8'>
      <div className='flex items-center justify-between'>
        <h1 className='text-lg font-semibold'>Comments</h1>
        <Button size='sm' variant='outline' onClick={onLogout}>
          Log out
        </Button>
      </div>

      <div className='flex gap-4'>
        <Select value={pageFilter} onValueChange={setPageFilter}>
          <SelectTrigger className='w-48'>
            <SelectValue placeholder='All pages' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All pages</SelectItem>
            {PAGE_CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className='w-48'>
            <SelectValue placeholder='All statuses' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All statuses</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedIds.size > 0 ? (
        <div className='flex items-center gap-3 rounded-md border p-3'>
          <span className='text-sm'>{selectedIds.size} selected</span>
          <Button size='sm' variant='outline' onClick={() => bulkSetStatus('approved')}>
            Approve
          </Button>
          <Button size='sm' variant='outline' onClick={() => bulkSetStatus('rejected')}>
            Reject
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button size='sm' variant='destructive'>
                Delete selected
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete {selectedIds.size} comments?</DialogTitle>
              </DialogHeader>
              <DialogFooter>
                <Button variant='destructive' onClick={bulkDelete}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button size='sm' variant='ghost' onClick={() => setSelectedIds(new Set())}>
            Clear
          </Button>
        </div>
      ) : null}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox checked={comments.length > 0 && selectedIds.size === comments.length} onCheckedChange={toggleSelectAll} aria-label='Select all rows' />
            </TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Page</TableHead>
            <TableHead>Comment</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Posted</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {comments.map((comment) => (
            <CommentRow key={comment.id} comment={comment} selected={selectedIds.has(comment.id)} onToggleSelect={toggleSelect} onChanged={load} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

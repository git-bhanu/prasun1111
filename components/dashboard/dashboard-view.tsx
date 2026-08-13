'use client';

import { useCallback, useEffect, useState } from 'react';

import { CommentRow } from '@/components/dashboard/comment-row';
import { PageCombobox } from '@/components/dashboard/page-combobox';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className='flex flex-col gap-1.5'>
      <span className='text-[11px] font-medium tracking-wide text-muted-foreground uppercase'>{label}</span>
      {children}
    </div>
  );
}

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
  likes_count: number;
  created_at: string;
}

const PAGE_CATEGORIES = ['artworks', 'installations', 'films', 'design', 'writings'];
const STATUSES = ['approved', 'rejected'];
const SORTS = [
  { value: 'recent', label: 'Most recent' },
  { value: 'liked', label: 'Most liked' },
];

export function DashboardView({ onLogout }: { onLogout: () => void }) {
  const [comments, setComments] = useState<DashboardComment[]>([]);
  const [pageFilter, setPageFilter] = useState<string>('all');
  const [specificPage, setSpecificPage] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20, total: 0, totalPages: 1 });
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const load = useCallback(async () => {
    const params = new URLSearchParams();
    const effectivePage = specificPage || (pageFilter !== 'all' ? pageFilter : '');
    if (effectivePage) params.set('page', effectivePage);
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (sortBy !== 'recent') params.set('sort', sortBy);
    params.set('pageNum', String(page));
    const res = await fetch(`/api/dashboard/comments?${params.toString()}`);
    if (!res.ok) return;
    const payload = await res.json();
    setComments(payload.comments ?? []);
    setPagination(payload.pagination ?? { page: 1, pageSize: 20, total: 0, totalPages: 1 });
    setSelectedIds(new Set());
  }, [pageFilter, specificPage, statusFilter, sortBy, page]);

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
    <div className='min-h-screen bg-muted/30'>
      <div className='mx-auto flex max-w-[1400px] flex-col gap-6 p-6 md:p-8'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-xl font-semibold tracking-tight'>Comments</h1>
            <p className='text-sm text-muted-foreground'>Moderate, pin, and reply to comments across the site.</p>
          </div>
          <Button size='sm' variant='outline' onClick={onLogout}>
            Log out
          </Button>
        </div>

        <div className='flex flex-wrap items-end gap-4 rounded-lg border bg-card p-4 shadow-xs'>
          <FilterField label='Category'>
            <Select
              value={pageFilter}
              onValueChange={(value) => {
                setPageFilter(value);
                setSpecificPage('');
                setPage(1);
              }}
            >
              <SelectTrigger className='w-44'>
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
          </FilterField>
          <FilterField label='Page'>
            <PageCombobox
              value={specificPage}
              onChange={(slug) => {
                setSpecificPage(slug);
                setPageFilter('all');
                setPage(1);
              }}
            />
          </FilterField>
          <FilterField label='Sort by'>
            <Select
              value={sortBy}
              onValueChange={(value) => {
                setSortBy(value);
                setPage(1);
              }}
            >
              <SelectTrigger className='w-44'>
                <SelectValue placeholder='Sort by' />
              </SelectTrigger>
              <SelectContent>
                {SORTS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>
          <FilterField label='Status'>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger className='w-44'>
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
          </FilterField>
          <span className='ml-auto pb-2 text-sm text-muted-foreground'>
            {pagination.total} comment{pagination.total === 1 ? '' : 's'}
          </span>
        </div>

        {selectedIds.size > 0 ? (
          <div className='flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3'>
            <span className='text-sm font-medium'>{selectedIds.size} selected</span>
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

        <div className='overflow-hidden rounded-lg border bg-card shadow-xs'>
          <Table>
            <TableHeader>
              <TableRow className='hover:bg-transparent'>
                <TableHead className='h-11 bg-muted/40 pl-4'>
                  <Checkbox
                    checked={comments.length > 0 && selectedIds.size === comments.length}
                    onCheckedChange={toggleSelectAll}
                    aria-label='Select all rows'
                  />
                </TableHead>
                <TableHead className='h-11 bg-muted/40 text-xs font-medium tracking-wide text-muted-foreground uppercase'>Author</TableHead>
                <TableHead className='h-11 bg-muted/40 text-xs font-medium tracking-wide text-muted-foreground uppercase'>Page</TableHead>
                <TableHead className='h-11 bg-muted/40 text-xs font-medium tracking-wide text-muted-foreground uppercase'>Comment</TableHead>
                <TableHead className='h-11 bg-muted/40 text-center text-xs font-medium tracking-wide text-muted-foreground uppercase'>Likes</TableHead>
                <TableHead className='h-11 bg-muted/40 text-xs font-medium tracking-wide text-muted-foreground uppercase'>Status</TableHead>
                <TableHead className='h-11 bg-muted/40 text-xs font-medium tracking-wide text-muted-foreground uppercase'>Posted</TableHead>
                <TableHead className='h-11 bg-muted/40 pr-4 text-xs font-medium tracking-wide text-muted-foreground uppercase'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comments.length === 0 ? (
                <TableRow className='hover:bg-transparent'>
                  <td colSpan={8} className='py-16 text-center text-sm text-muted-foreground'>
                    No comments match these filters.
                  </td>
                </TableRow>
              ) : (
                comments.map((comment) => (
                  <CommentRow key={comment.id} comment={comment} selected={selectedIds.has(comment.id)} onToggleSelect={toggleSelect} onChanged={load} />
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {pagination.totalPages > 1 ? (
          <div className='flex items-center justify-between'>
            <span className='text-sm text-muted-foreground'>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Pagination className='mx-0 w-auto'>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href='#'
                    aria-disabled={page <= 1}
                    className={page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    onClick={(event) => {
                      event.preventDefault();
                      if (page > 1) setPage(page - 1);
                    }}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    href='#'
                    aria-disabled={page >= pagination.totalPages}
                    className={page >= pagination.totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    onClick={(event) => {
                      event.preventDefault();
                      if (page < pagination.totalPages) setPage(page + 1);
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        ) : null}
      </div>
    </div>
  );
}

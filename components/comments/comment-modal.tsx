"use client";

import { createPortal } from "react-dom";

import { CommentForm } from "@/components/comments/comment-form";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils";

export interface CommentModalProps {
  pageSlug: string;
  onClose: () => void;
  onSubmitted: () => void;
  dark?: boolean;
}

export function CommentModal({
  pageSlug,
  onClose,
  onSubmitted,
  dark = false,
}: CommentModalProps) {
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="fixed inset-0 bg-black/60"
      />
      <div
        className={cn(
          "relative w-full max-w-[750px] rounded-2xl p-8",
          dark ? "border border-white/10 bg-neutral-900" : "bg-white",
        )}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-16 -top-7 flex size-14 cursor-pointer items-center justify-center rounded-full bg-brand-orange text-white"
        >
          <Icon name="pinchInZoom" size={24} color="#fff" />
        </button>
        <h2
          className={cn(
            "font-space-grotesk text-[36px] font-bold uppercase leading-[36px] tracking-normal",
            dark ? "text-white" : "text-black",
          )}
        >
          Let&apos;s start
          <br />a conversation
        </h2>
        <p
          className={cn(
            "mt-2 font-sedan text-[24px] font-normal leading-none tracking-normal",
            dark ? "text-white" : "text-black",
          )}
        >
          Leave a thought, question, or reflection.
        </p>
        <div className="mt-6">
          <CommentForm
            pageSlug={pageSlug}
            dark={dark}
            onSubmitted={() => {
              onSubmitted();
              onClose();
            }}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}

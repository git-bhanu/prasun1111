"use client";

import { ActionButton } from "@/components/shared/action-button";

export interface ArtworkDetailActionsProps {
  onClose: () => void;
  shareUrl?: string;
  enquireHref?: string;
  mode?: "all" | "close-only" | "secondary";
}

export function ArtworkDetailActions({
  onClose,
  shareUrl,
  enquireHref = "#",
  mode = "all",
}: ArtworkDetailActionsProps) {
  const handleShare = () => {
    const url = shareUrl ?? window.location.href;
    navigator.clipboard.writeText(url).catch(() => {});
  };

  return (
    <div className="flex flex-col">
      {mode !== "secondary" && (
        <ActionButton
          variant="ghost"
          color="orange"
          icon="pinchInZoom"
          label="Close Overlay"
          onClick={onClose}
        />
      )}
      {mode !== "close-only" && (
        <>
          <ActionButton
            variant="ghost"
            color="black"
            icon="shoppingBagSpeed"
            label="Enquire / Buy"
            href={enquireHref}
          />
          <ActionButton
            variant="ghost"
            color="black"
            icon="addLink"
            label="Share Link"
            onClick={handleShare}
          />
        </>
      )}
    </div>
  );
}

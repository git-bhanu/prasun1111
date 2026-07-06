type Rect = { x: number; y: number; width: number; height: number };

let pending: Rect | null = null;

export function setPendingArrowRect(rect: DOMRect) {
  pending = { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
}

export function hasPendingArrowRect(): boolean {
  return pending !== null;
}

export function consumePendingArrowRect(): Rect | null {
  const r = pending;
  pending = null;
  return r;
}

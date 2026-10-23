import type { ReactNode } from 'react';

// Shared window chrome for the illustration panels, matching the existing
// text-detector panel: dark ink, hairline border, three pixel dots, mono label.

interface FrameProps {
  title: string;
  children: ReactNode;
  frameRef?: React.Ref<HTMLDivElement>;
}

export function VisualFrame({ title, children, frameRef }: FrameProps) {
  return (
    <div ref={frameRef} className="relative flex h-full w-full flex-col gap-4 overflow-hidden border border-line bg-ink p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <span className="flex gap-1" aria-hidden="true">
          <span className="h-2 w-2 bg-[#ff5f56]" />
          <span className="h-2 w-2 bg-[#ffbd2e]" />
          <span className="h-2 w-2 bg-accent-light" />
        </span>
        <span className="label-mono text-mist-muted">{title}</span>
      </div>
      <div className="relative min-h-0 flex-1">{children}</div>
    </div>
  );
}

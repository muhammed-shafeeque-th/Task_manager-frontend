import { cn } from '@/lib/cn';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="grid size-7 place-items-center rounded-md bg-accent" aria-hidden="true">
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="#f2f4f0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </span>
      <span className="text-lg font-bold tracking-tight">Taskboard</span>
    </div>
  );
}

import type { ReactNode } from 'react';

const VARIANTS: Record<string, string> = {
  active: 'bg-accent-teal-bg text-accent-teal',
  suspended: 'bg-accent-amber-bg text-accent-amber',
  revoked: 'bg-accent-red-bg text-accent-red',
  locked: 'bg-accent-red-bg text-accent-red',
  neutral: 'bg-black/5 text-ink/60',
};

export default function Badge({ status, children }: { status: string; children: ReactNode }) {
  const cls = VARIANTS[status] || VARIANTS.neutral;
  return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${cls}`}>{children}</span>;
}

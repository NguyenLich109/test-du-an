export default function StatCard({ label, value, tone = 'default' }: { label: string; value: string | number; tone?: 'default' | 'warn' }) {
  return (
    <div className="bg-surface-raised border border-border rounded-2xl p-5">
      <div className={`text-2xl font-semibold ${tone === 'warn' ? 'text-accent-amber' : 'text-ink'}`}>{value}</div>
      <div className="text-sm text-ink/60 mt-1">{label}</div>
    </div>
  );
}

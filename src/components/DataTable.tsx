import type { ReactNode } from 'react';

export function DataTable({ columns, children }: { columns: string[]; children: ReactNode }) {
  return (
    <div className="bg-surface-raised border border-border rounded-2xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-black/[0.02]">
            {columns.map((c) => (
              <th key={c} className="text-left font-medium text-ink/60 px-5 py-3">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function MockDataNotice({ endpointHint }: { endpointHint: string }) {
  return (
    <div className="mb-4 px-4 py-3 rounded-xl bg-accent-amber-bg text-accent-amber text-sm">
      Màn hình này đang hiển thị <b>dữ liệu mẫu</b> để minh hoạ bố cục. Cần bổ sung endpoint{' '}
      <code className="font-key">{endpointHint}</code> ở backend để nối dữ liệu thật.
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return <div className="px-5 py-10 text-center text-sm text-ink/50">{message}</div>;
}

export default function Pagination({ page, total, limit, onPageChange, onLimitChange }) {
  const pages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(Math.max(page, 1), pages);
  const start = total === 0 ? 0 : (safePage - 1) * limit + 1;
  const end = Math.min(safePage * limit, total);

  const numbers = [];
  const from = Math.max(1, safePage - 2);
  const to = Math.min(pages, safePage + 2);
  for (let i = from; i <= to; i++) numbers.push(i);

  return (
    <div className="flex flex-col gap-3 border-t bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-slate-600">Showing {start}–{end} of {total}</span>
      <div className="flex flex-wrap items-center gap-2">
        <select value={limit} onChange={e => onLimitChange(Number(e.target.value))} className="rounded border px-2 py-1">
          {[10, 20, 50].map(n => <option key={n} value={n}>{n} / page</option>)}
        </select>
        <button disabled={safePage === 1} onClick={() => onPageChange(safePage - 1)} className="rounded border px-3 py-1">Previous</button>
        {numbers.map(n => (
          <button key={n} onClick={() => onPageChange(n)} className={`rounded border px-3 py-1 ${n === safePage ? "bg-slate-900 text-white" : ""}`}>{n}</button>
        ))}
        <button disabled={safePage === pages} onClick={() => onPageChange(safePage + 1)} className="rounded border px-3 py-1">Next</button>
      </div>
    </div>
  );
}

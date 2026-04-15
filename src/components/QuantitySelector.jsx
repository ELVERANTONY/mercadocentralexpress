export default function QuantitySelector({ value, onChange, min = 1 }) {
  const handleDecrease = () => {
    const next = Math.max(min, value - 1);
    onChange(next);
  };

  const handleIncrease = () => {
    onChange(value + 1);
  };

  return (
    <div className="inline-flex items-center gap-1.5 rounded-[14px] bg-slate-100/60 p-1 md:justify-start">
      <button
        type="button"
        onClick={handleDecrease}
        aria-label="Disminuir"
        className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95 disabled:opacity-50"
        disabled={value <= min}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </button>
      <span className="min-w-[32px] text-center text-[0.95rem] font-bold text-slate-800">{value}</span>
      <button
        type="button"
        onClick={handleIncrease}
        aria-label="Aumentar"
        className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </button>
    </div>
  );
}

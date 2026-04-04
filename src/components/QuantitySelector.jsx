export default function QuantitySelector({ value, onChange, min = 1 }) {
  const handleDecrease = () => {
    const next = Math.max(min, value - 1);
    onChange(next);
  };

  const handleIncrease = () => {
    onChange(value + 1);
  };

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
      <button
        type="button"
        onClick={handleDecrease}
        aria-label="Disminuir"
        className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-primary text-sm font-bold transition hover:border-primary"
      >
        -
      </button>
      <span className="font-semibold text-slate-900">{value}</span>
      <button
        type="button"
        onClick={handleIncrease}
        aria-label="Aumentar"
        className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-primary text-sm font-bold transition hover:border-primary"
      >
        +
      </button>
    </div>
  );
}

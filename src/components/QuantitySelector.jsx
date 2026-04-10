export default function QuantitySelector({ value, onChange, min = 1 }) {
  const handleDecrease = () => {
    const next = Math.max(min, value - 1);
    onChange(next);
  };

  const handleIncrease = () => {
    onChange(value + 1);
  };

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-100 bg-white px-3 py-2.5 shadow-[0_6px_16px_rgba(15,23,42,0.06)]">
      <button
        type="button"
        onClick={handleDecrease}
        aria-label="Disminuir"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-primary text-base font-bold transition hover:border-primary/50 hover:bg-primary-soft"
      >
        -
      </button>
      <span className="text-lg font-semibold text-slate-900">{value}</span>
      <button
        type="button"
        onClick={handleIncrease}
        aria-label="Aumentar"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-primary text-base font-bold transition hover:border-primary/50 hover:bg-primary-soft"
      >
        +
      </button>
    </div>
  );
}

import QuantitySelector from "./QuantitySelector.jsx";
import { formatPrice } from "../services/whatsapp.js";

export default function Cart({
  cart,
  total,
  onUpdateItem,
  onCheckout,
  isOpen,
  onClose,
  onRemoveItem,
  customerName,
  onCustomerNameChange,
  variant = "desktop",
}) {
  const isMobile = variant === "mobile";
  return (
    <aside
      className={
        isMobile
          ? "fixed inset-0 z-30 h-screen w-screen overflow-auto bg-white p-6 shadow-card"
          : "rounded-[22px] bg-white/90 p-6 shadow-card backdrop-blur"
      }
    >
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-slate-900">Resumen</h2>
        </div>
        {isMobile && (
          <button
            className="text-2xl text-slate-400 hover:text-slate-600"
            type="button"
            onClick={onClose}
          >
            ×
          </button>
        )}
      </div>
      <label className="grid gap-2 text-sm text-slate-500">
        <span>Nombre del cliente</span>
        <input
          type="text"
          value={customerName}
          onChange={(event) => onCustomerNameChange(event.target.value)}
          placeholder="Ej: Juan Perez"
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
        />
      </label>

      {cart.length === 0 ? (
        <p className="pt-1 text-sm text-slate-400">Tu carrito está vacío.</p>
      ) : (
        <div className="grid gap-3 pt-1">
          {cart.map((item) => (
            <div
              key={item.key}
              className="grid items-center gap-3 rounded-[16px] border border-slate-100 bg-white px-4 py-3 md:grid-cols-[1fr_auto_auto_auto]"
            >
              <div className="grid gap-1">
                <strong className="text-sm font-semibold text-slate-900">
                  {item.nombre}
                </strong>
                <span className="text-xs text-slate-400">{item.variante}</span>
                <span className="text-sm text-slate-500">
                  {formatPrice(item.precio)}
                </span>
              </div>
              <QuantitySelector
                value={item.cantidad}
                onChange={(value) => onUpdateItem(item.key, value)}
                min={1}
              />
              <button
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500 transition hover:border-primary hover:text-primary"
                type="button"
                onClick={() => onRemoveItem(item.key)}
              >
                Eliminar
              </button>
              <span className="text-sm font-semibold text-slate-900">
                {formatPrice(item.subtotal)}
              </span>
            </div>
          ))}
        </div>
      )}
      <div className="grid gap-4 pt-2">
        <div className="flex items-center justify-between text-base">
          <span>Total</span>
          <strong>{formatPrice(total)}</strong>
        </div>
        <button
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark active:scale-[0.98]"
          type="button"
          onClick={onCheckout}
          disabled={cart.length === 0}
        >
          Enviar pedido por WhatsApp
        </button>
      </div>
    </aside>
  );
}

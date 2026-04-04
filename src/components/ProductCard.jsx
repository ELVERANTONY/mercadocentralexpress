import { useState } from "react";
import QuantitySelector from "./QuantitySelector.jsx";
import { formatPrice } from "../services/whatsapp.js";

export default function ProductCard({ product, onAddToCart }) {
  const hasVariants = product.variantes && product.variantes.length > 0;
  const [variant, setVariant] = useState(
    hasVariants ? product.variantes[0] : "Estándar"
  );
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    onAddToCart(product, variant, quantity);
    setQuantity(1);
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-slate-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_rgba(17,24,39,0.12)]">
      <div className="relative grid h-56 place-items-center overflow-hidden bg-slate-100">
        {product.imagen ? (
          <img
            src={product.imagen}
            alt={product.nombre}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="font-medium text-slate-400">Sin imagen</div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="min-h-[48px] text-lg font-semibold leading-snug text-slate-900">
          {product.nombre}
        </h3>
        <p className="min-h-[28px] text-xl font-extrabold tracking-wide text-primary-dark">
          {formatPrice(product.precio)}
        </p>
        {hasVariants && (
          <div className="grid min-h-[72px] content-start gap-2 text-sm text-slate-500">
            <span>Variante</span>
            <div className="flex flex-wrap gap-2">
              {product.variantes.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    variant === item
                      ? "border-primary bg-primary-soft text-primary"
                      : "border-primary-border bg-white text-slate-800 hover:border-primary hover:text-primary"
                  }`}
                  onClick={() => setVariant(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="mt-auto grid gap-3 pt-1">
          <QuantitySelector value={quantity} onChange={setQuantity} />
          <button
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark active:scale-[0.98]"
            type="button"
            onClick={handleAdd}
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </article>
  );
}

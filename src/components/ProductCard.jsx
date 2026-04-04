import { useState } from "react";
import QuantitySelector from "./QuantitySelector.jsx";
import { formatPrice } from "../services/whatsapp.js";

export default function ProductCard({ product, onAddToCart }) {
  const hasVariants = product.variantes && product.variantes.length > 0;
  const allowQuantity = product.allowQuantity !== false;
  const [variant, setVariant] = useState(
    hasVariants ? product.variantes[0] : "Estandar"
  );
  const [quantity, setQuantity] = useState(1);
  const variantPrice =
    product.variantPrices && variant in product.variantPrices
      ? product.variantPrices[variant]
      : product.precio;
  const displayPrice = allowQuantity ? product.precio * quantity : variantPrice;
  const variantQty =
    product.variantQuantities && variant in product.variantQuantities
      ? product.variantQuantities[variant]
      : null;
  const originalPrice =
    typeof product.unitPrice === "number" && variantQty
      ? product.unitPrice * variantQty
      : null;
  const discountAmount =
    originalPrice && variantPrice < originalPrice
      ? originalPrice - variantPrice
      : 0;
  const discountPercent =
    discountAmount > 0
      ? Math.round((discountAmount / originalPrice) * 100)
      : 0;

  const handleAdd = () => {
    const qty = allowQuantity ? quantity : 1;
    onAddToCart(product, variant, qty, variantPrice);
    setQuantity(1);
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-slate-100 bg-white shadow-[0_16px_34px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_44px_rgba(15,23,42,0.12)]">
      <div className="relative grid h-56 place-items-center overflow-hidden bg-[#fafafa] p-3">
        {product.imagen ? (
          <img
            src={product.imagen}
            alt={product.nombre}
            className="h-full w-full object-contain transition duration-500 group-hover:scale-[1.015]"
          />
        ) : (
          <div className="font-medium text-slate-400">Sin imagen</div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <h3 className="min-h-[48px] text-lg font-semibold leading-snug text-slate-900">
          {product.nombre}
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          <p className="min-h-[28px] text-2xl font-extrabold tracking-wide text-primary">
            {formatPrice(displayPrice)}
          </p>
          {discountAmount > 0 && (
            <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
              -{discountPercent}% · Ahorra {formatPrice(discountAmount)}
            </span>
          )}
        </div>
        {discountAmount > 0 && (
          <p className="text-xs text-slate-400">
            Antes {formatPrice(originalPrice)}
          </p>
        )}
        {hasVariants && (
          <div className="grid min-h-[72px] content-start gap-2 text-sm text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
              Variante
            </span>
            <div className="flex flex-wrap gap-2">
              {product.variantes.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    variant === item
                      ? "border-primary/40 bg-primary-soft text-primary"
                      : "border-slate-200 bg-white text-slate-700 hover:border-primary/40 hover:text-primary"
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
          {allowQuantity && (
            <QuantitySelector value={quantity} onChange={setQuantity} />
          )}
          <button
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-dark px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(171,38,34,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_28px_rgba(171,38,34,0.3)] active:translate-y-0"
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


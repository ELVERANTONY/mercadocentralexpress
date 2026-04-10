import { useRef, useState } from "react";
import QuantitySelector from "./QuantitySelector.jsx";
import { formatPrice } from "../services/whatsapp.js";

export default function ProductCard({ product, onAddToCart }) {
  const imageRef = useRef(null);
  const discountEnabled = product.disableDiscount !== true;
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
  const compareAtPrice = allowQuantity
    ? (product.compareAtPrice ?? product.precio) * quantity
    : product.variantCompareAtPrices &&
        variant in product.variantCompareAtPrices
      ? product.variantCompareAtPrices[variant]
      : product.precio;
  const displayPrice = allowQuantity ? product.precio * quantity : variantPrice;
  const selectedImage =
    product.variantImages && variant in product.variantImages
      ? product.variantImages[variant]
      : product.imagen;
  const variantQty =
    product.variantQuantities && variant in product.variantQuantities
      ? product.variantQuantities[variant]
      : null;
  const discountAmount = discountEnabled
    ? Math.max(compareAtPrice - displayPrice, 0)
    : 0;
  const shouldShowDiscountInfo = allowQuantity
    ? discountEnabled && discountAmount > 0
    : typeof variantQty === "number" && variantQty > 3 && discountAmount > 0;
  const variantOfferLabel =
    !allowQuantity && typeof variantQty === "number"
      ? variantQty >= 12
        ? "Mejor precio"
        : variantQty >= 6
          ? "Mas vendido"
          : null
      : null;

  const handleAdd = () => {
    const qty = allowQuantity ? quantity : 1;
    const imageRect = imageRef.current?.getBoundingClientRect();
    onAddToCart(product, variant, qty, variantPrice, {
      imageSrc: selectedImage,
      imageRect,
    });
    setQuantity(1);
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-slate-100 bg-white shadow-[0_16px_34px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_44px_rgba(15,23,42,0.12)]">
      <div className="relative grid h-60 place-items-center overflow-hidden bg-[#fafafa] p-1.5 md:h-56">
        {selectedImage ? (
          <img
            ref={imageRef}
            src={selectedImage}
            alt={product.nombre}
            className="h-full w-full max-h-full max-w-full object-contain object-center transition duration-500 group-hover:scale-[1.015]"
          />
        ) : (
          <div className="font-medium text-slate-400">Sin imagen</div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4 md:gap-2.5 md:p-5">
        <h3 className="text-[1.65rem] font-semibold leading-tight text-slate-900 md:text-[1.45rem]">
          {product.nombre}
        </h3>
        <div className="flex flex-wrap items-end gap-2">
          {shouldShowDiscountInfo && (
            <p className="text-base font-semibold text-slate-400 line-through md:text-sm">
              {formatPrice(compareAtPrice)}
            </p>
          )}
          <p className="text-[2.2rem] font-extrabold tracking-wide text-primary md:text-[1.9rem]">
            {formatPrice(displayPrice)}
          </p>
        </div>
        {(shouldShowDiscountInfo || variantOfferLabel) && (
          <div className="flex flex-wrap items-center gap-2">
            {shouldShowDiscountInfo && (
              <span className="rounded-full bg-primary-soft px-2.5 py-1 text-sm font-semibold text-primary md:text-xs">
                Ahorra {formatPrice(discountAmount)}
              </span>
            )}
            {variantOfferLabel && (
              <span className="w-fit rounded-full border border-primary/30 bg-primary-soft px-2.5 py-1 text-sm font-semibold text-primary md:text-xs">
                {variantQty >= 12 ? "🔥 " : "⭐ "}
                {variantOfferLabel}
              </span>
            )}
          </div>
        )}
        {hasVariants && (
          <div className="grid content-start gap-2 text-sm text-slate-500">
            <span className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-400 md:text-xs">
              Variante
            </span>
            <div className="flex flex-wrap gap-2">
              {product.variantes.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`rounded-full border px-4 py-2 text-[1.05rem] font-semibold transition md:text-[0.95rem] ${
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
        <div className="mt-auto grid gap-2.5 pt-0.5">
          {allowQuantity && (
            <QuantitySelector value={quantity} onChange={setQuantity} />
          )}
          <button
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-dark px-5 py-3 text-base font-semibold text-white shadow-[0_10px_20px_rgba(171,38,34,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_28px_rgba(171,38,34,0.3)] active:translate-y-0 md:text-sm"
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

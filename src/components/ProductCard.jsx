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
  const placeQuantityNextToVariantOnDesktop =
    allowQuantity && hasVariants && product.variantes.length === 1;

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
    <article className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-white/50 bg-white shadow-premium transition-all duration-500 hover:-translate-y-1 md:hover:-translate-y-2 shadow-premium-hover">
      <div className="relative grid h-[78vw] min-h-[300px] max-h-[360px] place-items-center overflow-hidden bg-gradient-to-b from-slate-50 to-white p-4 md:p-2 md:h-[16rem] lg:h-[18rem]">
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
      <div className="flex flex-1 flex-col gap-1.5 p-3.5 md:gap-2 md:p-4">
        <h3 className="text-[20px] font-bold leading-tight text-slate-800 md:text-[21px] tracking-tight">
          {product.nombre}
        </h3>
        <div className="flex flex-wrap items-baseline gap-2">
          {shouldShowDiscountInfo && (
            <p className="text-[15px] font-medium text-slate-400 line-through decoration-slate-300">
              {formatPrice(compareAtPrice)}
            </p>
          )}
          <p className="text-[32px] font-black tracking-tighter text-primary">
            {formatPrice(displayPrice)}
          </p>
        </div>
        {(shouldShowDiscountInfo || variantOfferLabel) && (
          <div className="flex flex-wrap items-center gap-2">
            {shouldShowDiscountInfo && (
              <span className="rounded-full bg-primary-soft px-2.5 py-1 text-[13px] font-bold text-primary">
                Ahorra {formatPrice(discountAmount)}
              </span>
            )}
            {variantOfferLabel && (
              <span className="w-fit rounded-full border border-primary/30 bg-primary-soft px-2.5 py-1 text-[13px] font-bold text-primary">
                {variantQty >= 12 ? "🔥 " : "⭐ "}
                {variantOfferLabel}
              </span>
            )}
          </div>
        )}
        {hasVariants && (
          <div
            className={`grid content-start gap-1.5 text-sm text-slate-500 ${
              placeQuantityNextToVariantOnDesktop
                ? "md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-3"
                : ""
            }`}
          >
            <div className="grid content-start gap-2">
              <span className="text-[12px] font-bold uppercase tracking-widest text-slate-400">
                Seleccionar Variante
              </span>
              <div className="flex flex-wrap gap-2">
                {product.variantes.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`rounded-xl border px-4 py-2 text-[13px] font-bold transition-all duration-300 ${
                      variant === item
                        ? "border-primary bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]"
                        : "border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white"
                    }`}
                    onClick={() => setVariant(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            {placeQuantityNextToVariantOnDesktop && (
              <div className="hidden md:block">
                <QuantitySelector value={quantity} onChange={setQuantity} />
              </div>
            )}
          </div>
        )}
        <div className="mt-auto grid gap-2.5 pt-0.5">
          {allowQuantity && (
            <div
              className={`flex justify-center ${
                placeQuantityNextToVariantOnDesktop
                  ? "md:hidden"
                  : "md:justify-start"
              }`}
            >
              <QuantitySelector value={quantity} onChange={setQuantity} />
            </div>
          )}
          <button
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-dark px-6 py-3 md:py-2 text-[15px] font-bold text-white shadow-[0_10px_20px_rgba(171,38,34,0.25)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_28px_rgba(171,38,34,0.3)] active:scale-95"
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

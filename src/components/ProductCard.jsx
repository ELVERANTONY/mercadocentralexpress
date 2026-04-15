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

  const renderPremiumPrice = (priceVal) => {
    const formatted = formatPrice(priceVal).replace("S/", "").trim();
    const [integer, decimals] = formatted.split(".");
    return (
      <span className="flex items-start">
        <span className="price-symbol">S/</span>
        <span className="leading-none">{integer}</span>
        {decimals && <span className="price-cents">.{decimals}</span>}
      </span>
    );
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-slate-100 bg-white shadow-premium transition-all duration-500 hover:-translate-y-2 hover:shadow-premium-hover hover:border-primary/20 hover:shadow-glow">
      {/* Premium Image Header */}
      <div className="relative grid h-[70vw] min-h-[250px] max-h-[320px] place-items-center overflow-hidden bg-gradient-to-tr from-slate-50 via-white to-slate-50 p-4 md:p-6 md:h-[18rem] md:max-h-none">
        {selectedImage ? (
          <img
            ref={imageRef}
            src={selectedImage}
            alt={product.nombre}
            className="h-full w-full max-h-full max-w-full object-contain object-center transition duration-700 ease-out group-hover:scale-[1.08]"
          />
        ) : (
          <div className="font-medium text-slate-300">Sin imagen</div>
        )}
        
        {/* Dynamic Offer Badge (Premium Floating Seal) */}
        {(variantOfferLabel || shouldShowDiscountInfo) && (
          <div className="absolute top-3 left-3 md:top-4 md:left-4 flex items-center gap-2.5 rounded-full bg-white/95 px-3 py-1.5 md:px-3.5 md:py-2 text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-900 shadow-xl backdrop-blur-lg border border-white/20 animate-chip-pop-in">
            <span className={`flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-full text-white shadow-sm ${
              variantQty >= 12 ? "bg-cyan-500" : variantQty >= 6 ? "bg-orange-500" : "bg-indigo-500"
            }`}>
              {variantQty >= 12 ? (
                <svg className="w-3 md:w-3.5 h-3 md:h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l4 6-10 13L2 9z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/></svg>
              ) : variantQty >= 6 ? (
                <svg className="w-3 md:w-3.5 h-3 md:h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
              ) : (
                <svg className="w-3 md:w-3.5 h-3 md:h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m12 10 2 2m0-2-2 2m-2-6 2 2m0-2-2 2m7 2 2 2m0-2-2 2m-3-4 6 6-1.5 1.5L12 11.5l-4.5 4.5L6 14.5l6-6Z"/></svg>
              )}
            </span>
            <span>
              {variantOfferLabel || (shouldShowDiscountInfo ? "Oferta Especial" : "")}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        {/* Product Title */}
        <div className="mb-2">
          <h3 className="text-[20px] font-black leading-tight text-slate-900 md:text-[22px] tracking-tighter text-left">
            {product.nombre}
          </h3>
        </div>

        {/* Dynamic Pricing */}
        <div className="flex items-baseline justify-start gap-2 mb-4">
          <div className="text-[36px] md:text-[42px] font-black tracking-tighter text-primary leading-none">
            {renderPremiumPrice(displayPrice)}
          </div>
          {shouldShowDiscountInfo && (
            <p className="text-[15px] md:text-[18px] font-bold text-slate-300 line-through decoration-slate-200 opacity-60">
              {formatPrice(compareAtPrice)}
            </p>
          )}
        </div>

        {/* Refined Variant Selection - Centered on Mobile per request */}
        {hasVariants && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {product.variantes.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`rounded-full px-5 py-2 md:px-4 md:py-1.5 text-[12px] md:text-[13px] font-black transition-all duration-300 ${
                    variant === item
                      ? "bg-slate-900 text-white shadow-xl scale-105"
                      : "bg-slate-50 text-slate-400 hover:bg-slate-100 border border-slate-100/50"
                  }`}
                  onClick={() => setVariant(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sophisticated CTA Section */}
        <div className="mt-auto pt-2">
          <div className={`flex gap-3 ${allowQuantity ? "flex-col md:flex-row md:items-center" : "items-center"}`}>
            {allowQuantity && (
              <div className="flex justify-center md:flex-shrink-0">
                <QuantitySelector value={quantity} onChange={setQuantity} />
              </div>
            )}
            <button
              className="shimmer-btn relative flex-1 overflow-hidden inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary via-primary to-primary-dark px-4 py-4 text-[14px] md:text-[15px] font-black text-white shadow-[0_12px_24px_-8px_rgba(171,38,34,0.4)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_35px_-10px_rgba(171,38,34,0.5)] active:scale-95 whitespace-nowrap w-full"
              type="button"
              onClick={handleAdd}
            >
              <span>Agregar al carrito</span>
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.56-7.43H5.12"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

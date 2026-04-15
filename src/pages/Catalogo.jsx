import { useEffect, useMemo, useRef, useState } from "react";
import Cart from "../components/Cart.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { buildWhatsAppMessage, openWhatsApp } from "../services/whatsapp.js";
import logo from "../images/logo.png";
import bolsasPackImg from "../images/Bolsas al vacio.png";
import bolsasVacioX3Img from "../images/BOLSAS AL VACIO X3 UND.png";
import bolsasVacioX6Img from "../images/BOLSAS AL VACIO X6 UND.png";
import bolsasVacioX12Img from "../images/BOLSAS AL VACIO X12 UND.png";
import bolsasCamisasX3Img from "../images/BOLSAS CAMISAS X3 UND.png";
import bolsasCamisasX6Img from "../images/BOLSAS CAMISAS X6 UND.png";
import bolsasCamisasX12Img from "../images/BOLSAS CAMISAS X12 UND.png";

const PHONE_NUMBER = "51994220535";
const CART_STORAGE_KEY = "mce_cart_v1";

const hardcodedProducts = [
  {
    id: "demo-2",
    nombre: "Bolsa al vacío 60 x 80 cm",
    precio: 38.0,
    variantes: ["x3 UND", "x6 UND", "x12 UND"],
    allowQuantity: false,
    unitPrice: 10,
    variantQuantities: {
      "x3 UND": 3,
      "x6 UND": 6,
      "x12 UND": 12,
    },
    variantPrices: {
      "x3 UND": 38,
      "x6 UND": 54,
      "x12 UND": 98,
    },
    variantCompareAtPrices: {
      "x3 UND": 48,
      "x6 UND": 76,
      "x12 UND": 152,
    },
    variantImages: {
      "x3 UND": bolsasVacioX3Img,
      "x6 UND": bolsasVacioX6Img,
      "x12 UND": bolsasVacioX12Img,
    },
    imagen: bolsasVacioX3Img,
  },
  {
    id: "demo-3",
    nombre: "Bolsa al vacío 70 x 100 cm",
    precio: 45.0,
    variantes: ["x3 UND", "x6 UND", "x12 UND"],
    allowQuantity: false,
    unitPrice: 10,
    variantQuantities: {
      "x3 UND": 3,
      "x6 UND": 6,
      "x12 UND": 12,
    },
    variantPrices: {
      "x3 UND": 45,
      "x6 UND": 70,
      "x12 UND": 120,
    },
    variantCompareAtPrices: {
      "x3 UND": 60,
      "x6 UND": 90,
      "x12 UND": 180,
    },
    variantImages: {
      "x3 UND": bolsasVacioX3Img,
      "x6 UND": bolsasVacioX6Img,
      "x12 UND": bolsasVacioX12Img,
    },
    imagen: bolsasVacioX6Img,
  },
  {
    id: "demo-4",
    nombre: "Bolsa al vacío 80 x 110 cm",
    precio: 49.0,
    variantes: ["x3 UND", "x6 UND", "x12 UND"],
    allowQuantity: false,
    unitPrice: 10,
    variantQuantities: {
      "x3 UND": 3,
      "x6 UND": 6,
      "x12 UND": 12,
    },
    variantPrices: {
      "x3 UND": 49,
      "x6 UND": 78,
      "x12 UND": 136,
    },
    variantCompareAtPrices: {
      "x3 UND": 45,
      "x6 UND": 97.9,
      "x12 UND": 195.9,
    },
    variantImages: {
      "x3 UND": bolsasVacioX3Img,
      "x6 UND": bolsasVacioX6Img,
      "x12 UND": bolsasVacioX12Img,
    },
    imagen: bolsasVacioX12Img,
  },
  {
    id: "demo-5",
    nombre: "Bolsa al vacío para colgar camisas y sacos",
    precio: 52.0,
    variantes: ["x3 UND", "x6 UND", "x12 UND"],
    allowQuantity: false,
    unitPrice: 10,
    variantQuantities: {
      "x3 UND": 3,
      "x6 UND": 6,
      "x12 UND": 12,
    },
    variantPrices: {
      "x3 UND": 52,
      "x6 UND": 82,
      "x12 UND": 140,
    },
    variantCompareAtPrices: {
      "x3 UND": 70,
      "x6 UND": 103.9,
      "x12 UND": 207.9,
    },
    variantImages: {
      "x3 UND": bolsasCamisasX3Img,
      "x6 UND": bolsasCamisasX6Img,
      "x12 UND": bolsasCamisasX12Img,
    },
    imagen: bolsasCamisasX3Img,
  },
  {
    id: "demo-1",
    nombre: "Pack de bolsas al vacío",
    precio: 79.0,
    disableDiscount: true,
    variantes: ["Pack"],
    allowQuantity: true,
    imagen: bolsasPackImg,
  },
];

export default function Catalogo() {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [flyingItems, setFlyingItems] = useState([]);
  const [isCartBumpActive, setIsCartBumpActive] = useState(false);
  const cartButtonRef = useRef(null);
  const desktopCartRef = useRef(null);
  const desktopSummaryRef = useRef(null);
  const featureCarouselRef = useRef(null);

  // Auto-play timer removed in favor of CSS marquee for better performance and smoothness

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const now = Date.now();

      const normalizeItems = (items) =>
        items.map((item) => ({
          ...item,
          allowQuantity:
            typeof item.allowQuantity === "boolean"
              ? item.allowQuantity
              : item.variante === "Pack",
        }));

      // Soportar formato antiguo (array directo).
      if (Array.isArray(parsed)) {
        setCart(normalizeItems(parsed));
        return;
      }

      if (
        parsed &&
        Array.isArray(parsed.items) &&
        typeof parsed.expiresAt === "number"
      ) {
        if (now < parsed.expiresAt) {
          setCart(normalizeItems(parsed.items));
        } else {
          localStorage.removeItem(CART_STORAGE_KEY);
        }
      }
    } catch {
      // Si falla, seguimos con carrito vacio.
    }
  }, []);

  useEffect(() => {
    try {
      const payload = {
        items: cart,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      };
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Silenciar errores de almacenamiento.
    }
  }, [cart]);

  useEffect(() => {
    if (!isCartBumpActive) return;
    const timeoutId = window.setTimeout(() => {
      setIsCartBumpActive(false);
    }, 420);
    return () => window.clearTimeout(timeoutId);
  }, [isCartBumpActive]);

  const cartTotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.subtotal, 0),
    [cart]
  );
  const cartItemsCount = useMemo(
    () => cart.reduce((acc, item) => acc + item.cantidad, 0),
    [cart]
  );
  const hasCartItems = cartItemsCount > 0;

  const addFlyingPreview = (flyData) => {
    if (!flyData?.imageSrc || !flyData?.imageRect) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const targetEl = isMobile
      ? cartButtonRef.current
      : desktopSummaryRef.current || desktopCartRef.current;

    if (!targetEl) return;

    const sourceRect = flyData.imageRect;
    const targetRect = targetEl.getBoundingClientRect();
    if (
      sourceRect.width === 0 ||
      sourceRect.height === 0 ||
      targetRect.width === 0 ||
      targetRect.height === 0
    ) {
      return;
    }

    const fromCenterX = sourceRect.left + sourceRect.width / 2;
    const fromCenterY = sourceRect.top + sourceRect.height / 2;
    const toCenterX = targetRect.left + targetRect.width / 2;
    const toCenterY = targetRect.top + targetRect.height / 2;
    const id = `fly-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    setFlyingItems((prev) => [
      ...prev,
      {
        id,
        src: flyData.imageSrc,
        left: sourceRect.left,
        top: sourceRect.top,
        width: sourceRect.width,
        height: sourceRect.height,
        dx: toCenterX - fromCenterX,
        dy: toCenterY - fromCenterY,
        arc: isMobile ? -74 : 118,
      },
    ]);
  };

  const addToCart = (product, variant, quantity, priceOverride, flyData) => {
    if (!quantity || quantity <= 0) return;
    const finalPrice = priceOverride ?? product.precio;
    const key = `${product.id}::${variant || "default"}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.key === key);
      if (existing) {
        return prev.map((item) =>
          item.key === key
            ? {
                ...item,
                cantidad: item.cantidad + quantity,
                subtotal: (item.cantidad + quantity) * item.precio,
              }
            : item
        );
      }
      return [
        ...prev,
        {
          key,
          id: product.id,
          nombre: product.nombre,
          precio: finalPrice,
          variante: variant || "Estandar",
          allowQuantity: product.allowQuantity !== false,
          cantidad: quantity,
          subtotal: quantity * finalPrice,
        },
      ];
    });
    addFlyingPreview(flyData);
    setIsCartBumpActive(true);
  };

  const handleFlyAnimationEnd = (id) => {
    setFlyingItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateCartItem = (key, nextQty) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.key === key
            ? {
                ...item,
                cantidad: nextQty,
                subtotal: nextQty * item.precio,
              }
            : item
        )
        .filter((item) => item.cantidad > 0)
    );
  };

  const clearCart = () => setCart([]);

  const removeCartItem = (key) => {
    setCart((prev) => prev.filter((item) => item.key !== key));
  };

  const handleCheckout = () => {
    const message = buildWhatsAppMessage(cart, cartTotal, {
      itemCount: cartItemsCount,
    });
    openWhatsApp(PHONE_NUMBER, message);
    clearCart();
    setCartOpen(false);
  };

  return (
    <div className="min-h-screen bg-mesh mx-auto max-w-[1400px] px-3 pb-12 pt-4 transition-colors duration-500">

      <div
        className={`sticky top-0 z-40 bg-[#f2f2f2] md:bg-transparent pt-0 ${
          cartOpen ? "hidden md:block" : ""
        }`}
      >
        {/* Header: Responsive style (Flat on Mobile, Card on PC) */}
        <header className="sticky top-0 z-50 mb-4 flex items-center justify-between gap-3 bg-white px-4 py-2 shadow-sm -mx-3 md:mx-0 md:mb-6 md:rounded-[20px] md:border md:border-slate-100 md:bg-white md:px-6 md:py-4 md:shadow-card">
          <div className="flex items-center gap-3">
            <img
              className="h-10 w-10 md:h-12 md:w-12 rounded-full border-2 border-primary bg-white object-cover"
              src={logo}
              alt="Mercado Central Express"
            />
            <div>
              <h1 className="text-lg font-bold leading-tight text-slate-900 md:text-xl">
                Mercado Central Express
              </h1>
              <p className="text-[11px] font-medium text-slate-500 md:text-sm">
                Más espacio, menos volumen
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <button
              ref={cartButtonRef}
              className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[#f1f3f5] transition hover:bg-slate-200 md:h-auto md:w-auto md:bg-transparent"
              onClick={() => {
                if (window.matchMedia("(max-width: 767px)").matches) {
                  setCartOpen(true);
                }
              }}
              aria-label="Abrir carrito"
            >
              <svg
                className={`h-5 w-5 text-slate-700 md:h-6 md:w-6 ${hasCartItems ? "cart-pop" : ""} ${
                  isCartBumpActive ? "cart-bump" : ""
                }`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {hasCartItems && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-sm md:static md:ml-2 md:h-auto md:w-auto md:bg-primary-soft md:px-2 md:py-0.5 md:text-primary">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </header>
      </div>

      {hardcodedProducts.length === 0 ? (
        <section className="empty-state">
          <h2>No hay productos cargados</h2>
          <p>Sube productos desde el panel administrador.</p>
        </section>
      ) : (
        <div className="grid items-start gap-6 md:grid-cols-[minmax(0,1fr)_320px] lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="col-span-full mb-4 grid gap-5">
            {/* Headline section: Premium Badge style - Optimized for PC/Mobile */}
            <div className="px-1 md:rounded-[20px] md:border md:border-white/50 md:bg-white/40 md:p-5 md:shadow-sm md:backdrop-blur-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left Side: Title & Badge - Above the sliding chips */}
                <div className="flex flex-col items-start gap-1.5 relative z-10 bg-white/10 md:bg-transparent backdrop-blur-[2px] md:backdrop-blur-0 pr-2">
                  <div className="flex flex-row items-center flex-wrap gap-2.5 md:gap-4">
                    <h2 className="text-[20px] font-bold tracking-tight text-slate-900 md:text-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-600 bg-clip-text text-transparent">
                      Bolsas al vacío
                    </h2>
                    <span className="headline-chip-red">
                      Hasta -75% volumen
                    </span>
                  </div>
                </div>

                {/* Right Side: Desktop chips (integrated marquee) - Slides behind title */}
                <div className="hidden md:block flex-1 max-w-[950px] desktop-marquee-wrapper ml-[-180px] relative z-0">
                  <div className="marquee-container flex gap-10 w-max">
                    {[1, 2].map((loop) => (
                      <div key={loop} className="flex gap-4">
                        <span className="desktop-benefit-chip border-primary/20 text-slate-600">
                          <svg className="w-4 h-4 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.435-4.5.5-5 1.488 1.442 3.5 3.242 3.5 5.5s-1.5 4.5-3.5 4.5c-1.25 0-1.5-1-1.5-1Z"/><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>
                          </svg>
                          Oferta limitada
                        </span>
                        <span className="desktop-benefit-chip border-slate-200 text-slate-600">
                          <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="1" y="3" width="15" height="13"/><polyline points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                          </svg>
                          Envío rápido
                        </span>
                        <span className="desktop-benefit-chip border-slate-200 text-slate-600">
                          <svg className="w-4 h-4 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>
                          </svg>
                          Calidad Premium
                        </span>
                        <span className="desktop-benefit-chip border-slate-200 text-slate-600">
                          <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>
                          </svg>
                          Stock inmediato
                        </span>
                        <span className="desktop-benefit-chip border-slate-200 text-slate-600">
                          <svg className="w-4 h-4 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/>
                          </svg>
                          100% Reutilizables
                        </span>
                        <span className="desktop-benefit-chip border-slate-200 text-slate-600">
                          <svg className="w-4 h-4 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                          </svg>
                          Protección Total
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Infinite Marquee for mobile */}
            <div className="md:hidden marquee-wrapper -mx-3 py-1">
              <div className="marquee-container px-3">
                {[1, 2].map((i) => (
                  <div key={i} className="flex gap-3">
                    <span className="mobile-chip-colored mobile-chip-green">
                      <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="1" y="3" width="15" height="13"/><polyline points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                      </svg>
                      Envío rápido
                    </span>
                    <span className="mobile-chip-colored mobile-chip-blue">
                      <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>
                      </svg>
                      Stock inmediato
                    </span>
                    <span className="mobile-chip-colored mobile-chip-orange text-slate-600">
                      <svg className="w-4 h-4 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.435-4.5.5-5 1.488 1.442 3.5 3.242 3.5 5.5s-1.5 4.5-3.5 4.5c-1.25 0-1.5-1-1.5-1Z"/><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>
                      </svg>
                      Oferta limitada
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <section className="grid items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {hardcodedProducts.map((product) => (
              <div key={product.id} className="animate-fade-up">
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                />
              </div>
            ))}
          </section>

          <div className="hidden md:block md:sticky md:top-28 md:z-10 md:self-start md:max-h-[calc(100vh-180px)] md:overflow-auto">
            <Cart
              cart={cart}
              total={cartTotal}
              onUpdateItem={updateCartItem}
              onCheckout={handleCheckout}
              onClose={() => setCartOpen(false)}
              onRemoveItem={removeCartItem}
              variant="desktop"
              containerRef={desktopCartRef}
              summaryRef={desktopSummaryRef}
            />
          </div>

          {cartOpen && (
            <Cart
              cart={cart}
              total={cartTotal}
              onUpdateItem={updateCartItem}
              onCheckout={handleCheckout}
              isOpen
              onClose={() => setCartOpen(false)}
              onRemoveItem={removeCartItem}
              variant="mobile"
            />
          )}
          <div
            className={`fixed inset-0 z-20 bg-slate-900/30 transition ${
              cartOpen ? "opacity-100" : "pointer-events-none opacity-0"
            } md:hidden`}
            onClick={() => setCartOpen(false)}
          />
        </div>
      )}

      <div className="pointer-events-none fixed inset-0 z-[70] overflow-hidden">
        {flyingItems.map((item) => (
          <img
            key={item.id}
            src={item.src}
            alt=""
            aria-hidden="true"
            className="fly-to-cart-image"
            style={{
              left: `${item.left}px`,
              top: `${item.top}px`,
              width: `${item.width}px`,
              height: `${item.height}px`,
              "--dx": `${item.dx}px`,
              "--dy": `${item.dy}px`,
              "--arc": `${item.arc}px`,
            }}
            onAnimationEnd={() => handleFlyAnimationEnd(item.id)}
          />
        ))}
      </div>
    </div>
  );
}

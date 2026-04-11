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
    id: "demo-1",
    nombre: "Pack de bolsas al vacío",
    precio: 79.0,
    disableDiscount: true,
    variantes: ["Pack"],
    allowQuantity: true,
    imagen: bolsasPackImg,
  },
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
];

export default function Catalogo() {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [flyingItems, setFlyingItems] = useState([]);
  const [isCartBumpActive, setIsCartBumpActive] = useState(false);
  const cartButtonRef = useRef(null);
  const desktopCartRef = useRef(null);
  const desktopSummaryRef = useRef(null);

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
    <div className="mx-auto max-w-[1400px] px-3 pb-12 pt-4">

      <div
        className={`sticky top-0 z-40 bg-[#f2f2f2] pt-0 ${
          cartOpen ? "hidden md:block" : ""
        }`}
      >
        <header className="mb-4 flex flex-col items-start justify-between gap-4 rounded-[20px] border border-slate-100 bg-white px-6 py-4 shadow-card sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <img
            className="h-12 w-12 rounded-full border-2 border-primary bg-white object-cover"
            src={logo}
            alt="Mercado Central Express"
          />
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              Mercado Central Express
            </h1>
            <p className="text-sm font-medium text-slate-600">
              Más espacio, menos volumen
            </p>
          </div>
        </div>
        <div className="flex w-full items-center justify-end gap-3 sm:w-auto">
          <button
            ref={cartButtonRef}
            className={`inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-primary transition hover:border-primary ${
              hasCartItems ? "ring-2 ring-primary/30" : ""
            }`}
            onClick={() => {
              if (window.matchMedia("(max-width: 767px)").matches) {
                setCartOpen(true);
              }
            }}
            aria-label="Abrir carrito"
          >
            <svg
              className={`h-6 w-6 ${hasCartItems ? "cart-pop" : ""} ${
                isCartBumpActive ? "cart-bump" : ""
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
              <span
                className={`ml-3 inline-flex min-w-[32px] items-center justify-center rounded-full bg-primary-soft px-2 py-1 text-sm font-semibold text-primary ${
                  hasCartItems ? "badge-pulse" : ""
                } ${isCartBumpActive ? "cart-bump" : ""}`}
              >
                {cart.length}
              </span>
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
          <div className="col-span-full mb-1 grid gap-2 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
            <div className="grid gap-1">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-semibold text-slate-900">
                  Colección Destacada
                </h2>
                <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
                  Hasta -75% volumen
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500">
                Aviso: El color de la bolsa es referencial.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 justify-start md:justify-end">
              <span className="rounded-full border border-primary/30 bg-white px-3 py-1 text-xs font-semibold text-primary shadow-[0_6px_14px_rgba(171,38,34,0.12)] transition duration-200 hover:scale-[1.04] hover:border-primary/60 hover:bg-primary-soft hover:shadow-[0_12px_20px_rgba(171,38,34,0.22)] animate-soft-pop">
                Oferta limitada
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 transition duration-200 hover:scale-[1.04] hover:border-primary/40 hover:text-primary hover:bg-primary-soft hover:shadow-[0_12px_20px_rgba(171,38,34,0.18)]">
                Envío rápido
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 transition duration-200 hover:scale-[1.04] hover:border-primary/40 hover:text-primary hover:bg-primary-soft hover:shadow-[0_12px_20px_rgba(171,38,34,0.18)]">
                Stock inmediato
              </span>
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

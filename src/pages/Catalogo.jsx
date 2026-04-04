import { useEffect, useMemo, useState } from "react";
import Cart from "../components/Cart.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { buildWhatsAppMessage, openWhatsApp } from "../services/whatsapp.js";
import logo from "../images/logo.png";

const PHONE_NUMBER = "51994220535";
const CART_STORAGE_KEY = "mce_cart_v1";

const hardcodedProducts = [
  {
    id: "demo-1",
    nombre: "Pack de moldes de paletas",
    precio: 19.9,
    variantes: ["4 moldes", "8 moldes"],
    imagen:
      "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "demo-2",
    nombre: "Set de utensilios",
    precio: 29.5,
    variantes: ["Basico", "Pro"],
    imagen:
      "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "demo-3",
    nombre: "Vasos termicos",
    precio: 24.0,
    variantes: ["350 ml", "500 ml"],
    imagen:
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "demo-4",
    nombre: "Contenedores hermeticos",
    precio: 34.9,
    variantes: ["Set x3", "Set x5"],
    imagen:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "demo-5",
    nombre: "Tabla de picar premium",
    precio: 27.5,
    variantes: ["Bambu", "Madera"],
    imagen:
      "https://images.unsplash.com/photo-1498654200943-1088dd4438ae?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "demo-6",
    nombre: "Tapers apilables",
    precio: 21.9,
    variantes: ["4 piezas", "6 piezas"],
    imagen:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "demo-7",
    nombre: "Pack de vasos termicos",
    precio: 39.0,
    variantes: ["2 unidades", "4 unidades"],
    imagen:
      "https://images.unsplash.com/photo-1527169402691-feff5539e52c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "demo-8",
    nombre: "Set de cuchillos",
    precio: 58.0,
    variantes: ["3 piezas", "5 piezas"],
    imagen:
      "https://images.unsplash.com/photo-1498579397066-22750a3cb424?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "demo-9",
    nombre: "Organizador de cocina",
    precio: 32.0,
    variantes: ["Compacto", "Grande"],
    imagen:
      "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=800&q=80",
  },
];

export default function Catalogo() {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const now = Date.now();

      // Soportar formato antiguo (array directo).
      if (Array.isArray(parsed)) {
        setCart(parsed);
        return;
      }

      if (
        parsed &&
        Array.isArray(parsed.items) &&
        typeof parsed.expiresAt === "number"
      ) {
        if (now < parsed.expiresAt) {
          setCart(parsed.items);
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

  const cartTotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.subtotal, 0),
    [cart]
  );
  const cartItemsCount = useMemo(
    () => cart.reduce((acc, item) => acc + item.cantidad, 0),
    [cart]
  );

  const addToCart = (product, variant, quantity) => {
    if (!quantity || quantity <= 0) return;
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
          precio: product.precio,
          variante: variant || "Estandar",
          cantidad: quantity,
          subtotal: quantity * product.precio,
        },
      ];
    });
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
      customerName: customerName.trim(),
      itemCount: cartItemsCount,
    });
    openWhatsApp(PHONE_NUMBER, message);
    clearCart();
    setCartOpen(false);
  };

  return (
    <div className="mx-auto max-w-[1320px] px-3 pb-12 pt-5">
      <header className="mb-7 flex flex-col items-start justify-between gap-4 rounded-[18px] bg-white/90 px-5 py-4 shadow-card backdrop-blur sm:flex-row sm:items-center">
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
            <p className="text-sm text-slate-400">
              Elige el detalle perfecto para hoy
            </p>
          </div>
        </div>
        <div className="flex w-full items-center justify-end gap-3 sm:w-auto">
          <button
            className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-primary transition hover:border-primary"
            onClick={() => setCartOpen(true)}
            aria-label="Abrir carrito"
          >
            <svg
              className="h-5 w-5"
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
            <span className="ml-2 inline-flex min-w-[26px] items-center justify-center rounded-full bg-primary-soft px-2 py-0.5 text-xs font-semibold text-primary">
              {cart.length}
            </span>
          </button>
        </div>
      </header>

      {hardcodedProducts.length === 0 ? (
        <section className="empty-state">
          <h2>No hay productos cargados</h2>
          <p>Sube productos desde el panel administrador.</p>
        </section>
      ) : (
        <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="col-span-full">
            <h2 className="text-2xl font-semibold text-slate-900">
              Nuestra Coleccion
            </h2>
            <p className="text-sm text-slate-400">
              Explora nuestras opciones destacadas.
            </p>
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
          <div className="lg:sticky lg:top-6 lg:self-start lg:max-h-[calc(100vh-48px)] lg:overflow-auto">
            <Cart
              cart={cart}
              total={cartTotal}
              onUpdateItem={updateCartItem}
            onCheckout={handleCheckout}
            isOpen={cartOpen}
            onClose={() => setCartOpen(false)}
            onRemoveItem={removeCartItem}
            customerName={customerName}
            onCustomerNameChange={setCustomerName}
          />
          </div>
          <div
            className={`fixed inset-0 z-20 bg-slate-900/40 backdrop-blur-[2px] transition ${
              cartOpen ? "opacity-100" : "pointer-events-none opacity-0"
            } lg:hidden`}
            onClick={() => setCartOpen(false)}
          />
        </div>
      )}
    </div>
  );
}






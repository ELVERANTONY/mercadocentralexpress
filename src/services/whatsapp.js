const formatter = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 2,
});

export const formatPrice = (value) => formatter.format(value);

const generateOrderId = () => {
  const timePart = Date.now().toString(36).slice(-4).toUpperCase();
  const randomPart = Math.random().toString(36).slice(2, 4).toUpperCase();
  return `MCE-${timePart}${randomPart}`;
};

const buildUnitLabel = (item) => {
  const variantMatch = String(item.variante || "").match(/x\s*(\d+)\s*und/i);
  if (variantMatch) {
    return `${variantMatch[1]} und`;
  }
  return `${item.cantidad} und`;
};

export const buildWhatsAppMessage = (cart, total, options = {}) => {
  const { landingName = "Bolsas al vacío", orderId } = options;
  const finalOrderId = orderId || generateOrderId();

  const lines = [
    `*Pedido ID: ${finalOrderId} · ${landingName}*`,
    "",
    "*Pedido nuevo*",
    "",
    "Hola, quiero pedir:",
    "",
    ...cart.map(
      (item, index) =>
        `${index + 1}. ${item.nombre} (${buildUnitLabel(item)}) - *${formatPrice(
          item.subtotal
        )}*`
    ),
    "",
    `*Total: ${formatPrice(total)}*`,
  ];

  return lines.join("\n");
};

export const openWhatsApp = (phoneNumber, message) => {
  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${phoneNumber}?text=${encoded}`;
  window.open(url, "_blank", "noopener,noreferrer");
};

const formatter = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 2,
});

export const formatPrice = (value) => formatter.format(value);

const buildUnitLabel = (item) => {
  const variantMatch = String(item.variante || "").match(/x\s*(\d+)\s*und/i);
  if (variantMatch) {
    return `${variantMatch[1]} und`;
  }
  return `${item.cantidad} und`;
};

export const buildWhatsAppMessage = (cart, total) => {
  const lines = [
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

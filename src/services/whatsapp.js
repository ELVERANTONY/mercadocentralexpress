const formatter = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 2,
});

export const formatPrice = (value) => formatter.format(value);

export const buildWhatsAppMessage = (cart, total, options = {}) => {
  const { customerName = "", itemCount = 0 } = options;
  const separator = "--------------------";
  const lines = [
    "*Pedido nuevo*",
    separator,
    customerName ? `Cliente: ${customerName}` : null,
    `Items: ${itemCount}`,
    "",
    ...cart.map(
      (item, index) =>
        `${index + 1}. ${item.nombre} (${item.variante}) x${
          item.cantidad
        } - *${formatPrice(item.subtotal)}*`
    ),
    separator,
    `Subtotal: *${formatPrice(total)}*`,
    `Total: *${formatPrice(total)}*`,
  ].filter(Boolean);
  return lines.join("\n");
};

export const openWhatsApp = (phoneNumber, message) => {
  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${phoneNumber}?text=${encoded}`;
  window.open(url, "_blank", "noopener,noreferrer");
};

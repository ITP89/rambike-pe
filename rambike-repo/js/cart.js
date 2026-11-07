/* ===== RAMBIKE.PE - Lógica de carrito (localStorage) ===== */

function getCart() {
  const raw = localStorage.getItem("rambike_cart");
  try { return raw ? JSON.parse(raw) : []; } catch (e) { return []; }
}

function saveCart(cart) {
  localStorage.setItem("rambike_cart", JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(productId, qty) {
  const cart = getCart();
  const existing = cart.find(i => i.id === Number(productId));
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: Number(productId), qty });
  }
  saveCart(cart);
}

function updateCartQty(productId, qty) {
  let cart = getCart();
  const item = cart.find(i => i.id === Number(productId));
  if (!item) return;
  if (qty <= 0) {
    cart = cart.filter(i => i.id !== Number(productId));
  } else {
    item.qty = qty;
  }
  saveCart(cart);
}

function removeFromCart(productId) {
  const cart = getCart().filter(i => i.id !== Number(productId));
  saveCart(cart);
}

function clearCart() {
  saveCart([]);
}

function cartCount() {
  return getCart().reduce((sum, i) => sum + i.qty, 0);
}

function cartDetailed() {
  const cart = getCart();
  const products = getProducts();
  return cart
    .map(item => {
      const p = products.find(pr => pr.id === item.id);
      if (!p) return null;
      return { ...p, qty: item.qty, subtotal: p.price * item.qty };
    })
    .filter(Boolean);
}

function cartTotal() {
  return cartDetailed().reduce((sum, i) => sum + i.subtotal, 0);
}

function updateCartBadge() {
  document.querySelectorAll(".cart-badge").forEach(el => {
    const count = cartCount();
    el.textContent = count;
    el.style.display = count > 0 ? "flex" : "none";
  });
}

function buildWhatsAppMessage() {
  const items = cartDetailed();
  let msg = "Hola RAMBIKE, quiero hacer el siguiente pedido:\n\n";
  items.forEach(i => {
    msg += `• ${i.qty}x ${i.name} - ${formatPrice(i.subtotal)}\n`;
  });
  msg += `\nTOTAL: ${formatPrice(cartTotal())}`;
  return msg;
}

function whatsappLink() {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppMessage())}`;
}

document.addEventListener("DOMContentLoaded", updateCartBadge);

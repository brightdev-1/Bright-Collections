// BRIGHT COLLECTIONS — SHARED CART LOGIC
// Loaded on every page (home, shop, cart) so the cart stays in sync
// via localStorage, with no backend required.

const CART_KEY = "bc_cart";

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    if (existing.qty >= existing.stock) {
      return { success: false, reason: "max-stock" };
    }
    existing.qty += 1;
  } else {
    if (product.stock <= 0) {
      return { success: false, reason: "out-of-stock" };
    }
    cart.push({ ...product, qty: 1 });
  }

  saveCart(cart);
  return { success: true };
}

function updateCartCount() {
  const badge = document.querySelector("#cart-count");
  if (!badge) return;

  const totalItems = getCart().reduce((sum, item) => sum + item.qty, 0);
  badge.textContent = totalItems;
}

document.addEventListener("DOMContentLoaded", () => {
  // keep the nav badge correct on every page load
  updateCartCount();

  // delegated listener catches every .add-to-cart-btn,
  // whether it's on the home page or the shop page
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".add-to-cart-btn");
    if (!btn) return;

    const result = addToCart({
      id: btn.dataset.id,
      name: btn.dataset.name,
      price: Number(btn.dataset.price),
      image: btn.dataset.image,
      stock: Number(btn.dataset.stock)
    });

    const originalText = btn.textContent;

    if (result.success) {
      btn.textContent = "Added ✓";
      btn.classList.add("is-added");
    } else {
      btn.textContent = "Max Stock Reached";
    }

    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = originalText;
      btn.classList.remove("is-added");
      btn.disabled = false;
    }, 1200);
  });

  // only runs on cart.html, where #cart-items actually exists
  if (document.querySelector("#cart-items")) {
    renderCart();
  }
});

// ==========================
// CART PAGE — render, qty controls, checkout
// ==========================

function increaseQty(id) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (item && item.qty < item.stock) item.qty += 1;
  saveCart(cart);
  renderCart();
}

function decreaseQty(id) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);

  if (item) {
    item.qty -= 1;
    if (item.qty <= 0) {
      saveCart(cart.filter(i => i.id !== id));
      renderCart();
      return;
    }
  }

  saveCart(cart);
  renderCart();
}

function removeFromCart(id) {
  const cart = getCart().filter(item => item.id !== id);
  saveCart(cart);
  renderCart();
}

function renderCart() {
  const cart = getCart();
  const container = document.querySelector("#cart-items");
  const emptyMessage = document.querySelector("#cart-empty");
  const totalEl = document.querySelector("#cart-total");
  const checkoutBtn = document.querySelector("#checkout-btn");

  if (!container) return;

  container.innerHTML = "";

  if (cart.length === 0) {
    if (emptyMessage) emptyMessage.style.display = "block";
    if (totalEl) totalEl.textContent = "₦0";
    if (checkoutBtn) checkoutBtn.disabled = true;
    return;
  }

  if (emptyMessage) emptyMessage.style.display = "none";
  if (checkoutBtn) checkoutBtn.disabled = false;

  let total = 0;

  cart.forEach(item => {
    const lineTotal = item.price * item.qty;
    total += lineTotal;
    const atMax = item.qty >= item.stock;

    container.innerHTML += `
      <div class="cart-item">
        <img src="../${item.image}" alt="${item.name}">
        <span class="cart-item-name">
          ${item.name}
          ${atMax ? `<small class="stock-note">Max stock reached</small>` : ""}
        </span>
        <div class="qty-controls">
          <button type="button" onclick="decreaseQty('${item.id}')" aria-label="Decrease quantity">−</button>
          <span>${item.qty}</span>
          <button type="button" onclick="increaseQty('${item.id}')" aria-label="Increase quantity" ${atMax ? "disabled" : ""}>+</button>
        </div>
        <span class="cart-item-price">₦${lineTotal.toLocaleString()}</span>
        <button type="button" class="remove-btn" onclick="removeFromCart('${item.id}')">Remove</button>
      </div>`;
  });

  if (totalEl) totalEl.textContent = `₦${total.toLocaleString()}`;
}

function checkoutViaWhatsApp() {
  const cart = getCart();
  if (cart.length === 0) return alert("Your cart is empty.");

  let message = "🧾 *New Order — Bright Collections*\n\n";
  let total = 0;

  cart.forEach((item, i) => {
    const lineTotal = item.price * item.qty;
    total += lineTotal;
    message += `${i + 1}. ${item.name} x${item.qty} — ₦${lineTotal.toLocaleString()}\n`;
  });

  message += `\n*Total: ₦${total.toLocaleString()}*\n\nPlease confirm this order.`;

  const phoneNumber = "2349165932331"; // matches the number already used on index.html
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank");
}
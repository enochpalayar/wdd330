import { getLocalStorage } from "./utils.mjs";

export function getCartCount() {
  const cartItems = getLocalStorage("so-cart");
  return Array.isArray(cartItems) ? cartItems.length : 0;
}

export function renderCartCount() {
  const cartWrapper = document.querySelector(".cart");
  if (!cartWrapper) return;

  let badge = cartWrapper.querySelector(".cart-count");
  if (!badge) {
    badge = document.createElement("span");
    badge.className = "cart-count";
    cartWrapper.appendChild(badge);
  }

  badge.textContent = String(getCartCount());
}

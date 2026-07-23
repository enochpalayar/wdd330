import ShoppingCart from "./ShoppingCart.mjs";
import { loadHeaderFooter, getLocalStorage } from "./utils.mjs";

loadHeaderFooter();

const cart = new ShoppingCart("so-cart", ".product-list");
cart.init();

const cartItems = getLocalStorage("so-cart") || [];
const checkoutBtn = document.querySelector("#checkout-btn");

if (checkoutBtn && cartItems.length === 0) {
  checkoutBtn.style.display = "none";
}

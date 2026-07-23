import { getLocalStorage, setLocalStorage, updateCartCount } from "./utils.mjs";

function cartItemTemplate(item) {
  const qty = item.Quantity || 1;
  const itemTotal = (item.FinalPrice * qty).toFixed(2);

  return `<li class="cart-card">
    <a href="/product_pages/index.html?product=${item.Id}" class="cart-card__image">
      <img src="${item.Images?.PrimaryMedium || item.Image}" alt="${item.Name}" />
    </a>
    <a href="/product_pages/index.html?product=${item.Id}">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors && item.Colors[0] ? item.Colors[0].ColorName : ""}</p>
    
    <div class="cart-card__quantity">
      <button class="qty-btn qty-decrease" data-id="${item.Id}">-</button>
      <span class="qty-val">${qty}</span>
      <button class="qty-btn qty-increase" data-id="${item.Id}">+</button>
    </div>

    <p class="cart-card__price">$${itemTotal}</p>
    <button class="cart-card__remove" data-id="${item.Id}" title="Remove item">✕</button>
  </li>`;
}

export default class ShoppingCart {
  constructor(key, parentSelector) {
    this.key = key;
    this.parentSelector = parentSelector;
  }

  async init() {
    this.renderCartContents();
  }

  renderCartContents() {
    const cartItems = getLocalStorage(this.key) || [];

    const parentElement = typeof this.parentSelector === "string"
      ? document.querySelector(this.parentSelector)
      : this.parentSelector;

    const cartFooter = document.querySelector(".cart-footer");

    if (!parentElement) {
      console.error(`ShoppingCart Error: Target element not found.`);
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      parentElement.innerHTML = `<li class="empty-cart-msg"><p>Your cart is currently empty.</p></li>`;
      if (cartFooter) cartFooter.classList.add("hide");
      return;
    }

    if (cartFooter) cartFooter.classList.remove("hide");

    const htmlItems = cartItems.map((item) => cartItemTemplate(item));
    parentElement.innerHTML = htmlItems.join("");

    this.calculateTotal(cartItems);
    this.attachEventListeners(parentElement);
  }

  calculateTotal(cartItems) {
    const total = cartItems.reduce((sum, item) => sum + item.FinalPrice * (item.Quantity || 1), 0);
    const totalEl = document.querySelector(".cart-total");
    if (totalEl) {
      totalEl.innerText = `Total: $${total.toFixed(2)}`;
    }
  }

  attachEventListeners(parentElement) {
    if (!parentElement) return;

    parentElement.onclick = (e) => {
      const id = e.target.dataset.id;
      if (!id) return;

      let cart = getLocalStorage(this.key) || [];

      if (e.target.classList.contains("cart-card__remove")) {
        cart = cart.filter((item) => item.Id !== id);
      } else if (e.target.classList.contains("qty-increase")) {
        const item = cart.find((item) => item.Id === id);
        if (item) item.Quantity = (item.Quantity || 1) + 1;
      } else if (e.target.classList.contains("qty-decrease")) {
        const item = cart.find((item) => item.Id === id);
        if (item) {
          item.Quantity = (item.Quantity || 1) - 1;
          if (item.Quantity <= 0) {
            cart = cart.filter((item) => item.Id !== id);
          }
        }
      }

      setLocalStorage(this.key, cart);
      this.renderCartContents();
      updateCartCount();
    };
  }
}
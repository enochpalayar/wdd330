import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const myCheckout = new CheckoutProcess("so-cart", ".order-summary");
myCheckout.init();

document.querySelector("#zip").addEventListener("blur", () => {
  myCheckout.calculateOrderTotal();
});

document.querySelector("#checkout-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.target;

  myCheckout.calculateOrderTotal();
  myCheckout.checkout(form);
});

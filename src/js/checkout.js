import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const myCheckout = new CheckoutProcess("so-cart", ".order-summary");
myCheckout.init();

const zipInput = document.querySelector("#zip");
if (zipInput) {
  zipInput.addEventListener("blur", () => {
    myCheckout.calculateOrderTotal();
  });
}

const submitBtn = document.querySelector("#checkoutSubmit");
const myForm =
  document.forms["checkout"] || document.querySelector("#checkout-form");

if (myForm) {
  myForm.addEventListener("submit", (e) => e.preventDefault());
}

if (submitBtn) {
  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();

    if (myForm) {
      const chck_status = myForm.checkValidity();
      myForm.reportValidity();

      if (chck_status) {
        myCheckout.checkout(myForm);
      }
    }
  });
}

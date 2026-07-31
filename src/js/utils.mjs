// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param);
  return product
}

export function renderListWithTemplate(template, parentElement, list, position = "afterbegin", clear = false) {
  const htmlStrings = list.map(template);
  // if clear is true we need to clear out the contents of the parent.
  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;

  if (callback) {
    callback(data);
  }
}

async function loadTemplate(path) {
  const response = await fetch(path);
  if (response.ok) {
    const template = await response.text();
    return template;
  }
}

export function updateCartCount() {
  const cartItems = getLocalStorage("so-cart") || [];
  const countElement = document.querySelector(".cart-count");

  if (!countElement) return;

  const totalCount = Array.isArray(cartItems)
    ? cartItems.reduce((sum, item) => sum + (item.Quantity || 1), 0)
    : 0;

  countElement.textContent = totalCount;

  if (totalCount > 0) {
    countElement.classList.remove("hide");
  } else {
    countElement.classList.add("hide");
  }
}

export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("/partials/header.html");
  const footerTemplate = await loadTemplate("/partials/footer.html");

  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");

  if (headerElement && headerTemplate) {
    renderWithTemplate(headerTemplate, headerElement);
  }
  if (footerElement && footerTemplate) {
    renderWithTemplate(footerTemplate, footerElement);
  }

  updateCartCount();
}

// Alert message function to display messages to the user
export function alertMessage(message, scroll = true) {
  const alert = document.createElement("div");
  alert.classList.add("alert");

  alert.innerHTML = `<span>${message}</span><span class="alert-close">X</span>`;

  alert.addEventListener("click", function (e) {
    if (e.target.tagName === "SPAN" && e.target.classList.contains("alert-close")) {
      const main = document.querySelector("main");
      if (main && main.contains(this)) {
        main.removeChild(this);
      }
    }
  });

  const main = document.querySelector("main");
  if (main) {
    main.prepend(alert);
  }

  if (scroll) {
    window.scrollTo(0, 0);
  }
}

export function removeAllAlerts() {
  const alerts = document.querySelectorAll(".alert");
  alerts.forEach((alert) => alert.remove());
}

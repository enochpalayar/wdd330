import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { renderCartCount } from "./cartCount.mjs";

const dataSource = new ProductData("tents");
const element = document.querySelector(".product-list");

async function initHomePage() {
    renderCartCount();

    if (!element) return;

    const productList = new ProductList("Tents", dataSource, element);
    await productList.init();
}

window.addEventListener("DOMContentLoaded", initHomePage);

import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

loadHeaderFooter();

const category = getParam("category");
const dataSource = new ProductData();
const listElement = document.querySelector(".product-list");
const myList = new ProductList(category, dataSource, listElement);

myList.init();

if (category) {
  const titleElement = document.querySelector(".products h2");
  if (titleElement) {
    const formattedCategory =
      category.charAt(0).toUpperCase() + category.slice(1);
    titleElement.textContent = `Top Products: ${formattedCategory}`;
  }
}

import { getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./productDetails.mjs";
import { renderCartCount } from "./cartCount.mjs";

const dataSource = new ProductData("tents");
const productId = getParam("product");

async function initProductPage() {
  const product = new ProductDetails(productId, dataSource);
  await product.init();
  renderCartCount();
}

window.addEventListener("DOMContentLoaded", initProductPage);

//function addProductToCart(product) {
//const cartItems = getLocalStorage("so-cart") || [];
//cartItems.push(product);
//setLocalStorage("so-cart", cartItems);
//}
// add to cart button event handler
//async function addToCartHandler(e) {
//const product = await dataSource.findProductById(e.target.dataset.id);
//addProductToCart(product);
//}

// add listener to Add to Cart button
//document
//.getElementById("addToCart")
//.addEventListener("click", addToCartHandler);

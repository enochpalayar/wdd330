import { getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./productDetails.mjs";

const dataSource = new ProductData("tents");
const productId = getParam("product");

//console.log(dataSource.findProductById(productId));
const product = new ProductDetails(productId, dataSource);
product.init();

const description = document.querySelector(".description");

const dialog = document.querySelector("#descriptionDialog");
const dialogContent = document.querySelector("#descriptionDialog div");
const closeButton = document.querySelector("#closeDialog");

description.addEventListener("click", () => {
    dialogContent.innerHTML = "Enjoy a fun night under stars with your favorite people in The North Face's Talus four-person tent, featuring durable construction with a roomy interior, an advanced DAC Featherlite NSL pole system and aneasy to pitch design.";
    dialog.showModal();
});

closeButton.addEventListener("click", () => {
    dialog.close();
});

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

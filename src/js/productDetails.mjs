import { getLocalStorage, setLocalStorage, alertMessage, updateCartCount } from "./utils.mjs";

export default class ProductDetails {

    constructor(productId, dataSource) {
        this.productId = productId;
        this.product = {};
        this.dataSource = dataSource;
    }

    async init() {
        this.product = await this.dataSource.findProductById(this.productId);
       
        this.renderProductDetails("main");
        
        document
            .getElementById("addToCart")
            .addEventListener("click", this.addToCart.bind(this));
    }

    addToCart() {
        let cart = getLocalStorage("so-cart") || [];
        if (!Array.isArray(cart)) cart = [];

        const existingItem = cart.find((item) => item.Id === this.product.Id);

        if (existingItem) {
            existingItem.Quantity = (existingItem.Quantity || 1) + 1;
        } else {
            const itemToAdd = { ...this.product, Quantity: 1 };
            cart.push(itemToAdd);
        }

        setLocalStorage("so-cart", cart);
        updateCartCount();
        alertMessage(`${this.product.NameWithoutBrand || this.product.Name} added to cart!`);
    }

    renderProductDetails() {
        productDetailsTemplate(this.product);
    }
}

function productDetailsTemplate(product) {
    document.querySelector('h2').textContent = product.Brand.Name;
    document.querySelector('h3').textContent = product.NameWithoutBrand;

    const productImage = document.getElementById('productImage');
    productImage.src = product.Images.PrimaryLarge;
    productImage.alt = product.NameWithoutBrand;

   //---- ADDED DISCOUNT TO PRODUCT DETAIL PAGES
    const finalPriceEl = document.getElementById('productPrice');
    const originalPriceEl = document.getElementById('originalPrice');
    const discountBadgeEl = document.getElementById('discountBadge');

    
    finalPriceEl.textContent = `$${product.FinalPrice}`;

    //This check if the item has a discount
    if (product.ListPrice > product.FinalPrice) {
        const cashSavings = product.ListPrice - product.FinalPrice;
        const discountPercent = Math.round((cashSavings / product.ListPrice) * 100);

        // Original Price
        originalPriceEl.textContent = `$${product.ListPrice}`;
        originalPriceEl.style.display = "inline";

        // Calculated savings
        discountBadgeEl.textContent = `${discountPercent}% OFF`;
        discountBadgeEl.style.display = "inline-block";
    } else {
        // If the item not sale, hide optional layout parts
        originalPriceEl.style.display = "none";
        discountBadgeEl.style.display = "none";
    }
    // --- DISCOUNT RENDER ADDED END-------
   
    document.getElementById('productColor').textContent = product.Colors[0].ColorName;
    document.getElementById('productDesc').innerHTML = product.DescriptionHtmlSimple;

    document.getElementById('addToCart').dataset.id = product.Id;
}
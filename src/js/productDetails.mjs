import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {

    constructor(productId, dataSource) {
        this.productId = productId;
        this.product = {};
        this.dataSource = dataSource;
    }

    async init() {
        this.product = await this.dataSource.findProductById(this.productId);
       
        this.renderProductDetails();
        
        document
            .getElementById('addToCart')
            .addEventListener('click', this.addProductToCart.bind(this));
    }

    addProductToCart() {
        const cartItems = getLocalStorage("so-cart") || [];
        cartItems.push(this.product);
        setLocalStorage("so-cart", cartItems);
    }

    renderProductDetails() {
        productDetailsTemplate(this.product);
    }
}

function productDetailsTemplate(product) {
    document.querySelector('h2').textContent = product.Brand.Name;
    document.querySelector('h3').textContent = product.NameWithoutBrand;

    const productImage = document.getElementById('productImage');
    productImage.src = product.Image;
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
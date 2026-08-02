import { getLocalStorage, setLocalStorage, alertMessage, updateCartCount, getParam } from "./utils.mjs";

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
    // populate the existing page elements
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

    // --- Breadcrumb rendering (uses the data already placed on the page) ---
    renderBreadcrumbFromPage(product);
}

/**
 * Build a simple accessible breadcrumb using values already on the page.
 * Uses the product.Brand.Name as the category/brand and product.NameWithoutBrand as the product name.
 * If these are not available, falls back to reading the H2/H3 text on the page (the existing template uses them).
 * Breadcrumb will be inserted into the #site-breadcrumb container (below the navbar). If that container
 * is not present, it will fall back to inserting above the product title as before.
 */
function renderBreadcrumbFromPage(product) {
    const siteContainer = document.getElementById('site-breadcrumb');

    // find existing values (prefer the product object we already have)
    const categoryName = (product && product.Brand && product.Brand.Name) ||
                         (document.querySelector('.product-detail h2') && document.querySelector('.product-detail h2').textContent.trim()) ||
                         (document.querySelector('.product-detail h3') && document.querySelector('.product-detail h3').textContent.trim()) ||
                         null;
    const category = getParam("category");
  
    const productName = (product && (product.NameWithoutBrand || product.Name)) ||
                        (document.querySelector('.product-detail h3') && document.querySelector('.product-detail h3').textContent.trim()) ||
                        (document.querySelector('.product-detail h2') && document.querySelector('.product-detail h2').textContent.trim()) ||
                        null;

    // If we don't have a category or product name, don't render
    if (!categoryName && !productName) return;

    // Build nav element
    const nav = document.createElement('nav');
    nav.setAttribute('aria-label', 'Breadcrumb');
    nav.id = 'breadcrumbs';

    const ol = document.createElement('ol');
    ol.className = 'breadcrumb-list';

    // Home
    const liHome = document.createElement('li');
    liHome.className = 'breadcrumb-item';
    const aHome = document.createElement('a');
    aHome.href = '/';
    aHome.textContent = 'Home';
    liHome.appendChild(aHome);
    ol.appendChild(liHome);

    
    // Category (if available) - prefer the real category from the URL,
    // fall back to brand name for old links that don't have ?category=
    if (category) {
        const liCat = document.createElement('li');
        liCat.className = 'breadcrumb-item';
        const aCat = document.createElement('a');
        aCat.href = `/product_listing/index.html?category=${category}`;
        aCat.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        liCat.appendChild(aCat);
        ol.appendChild(liCat);
    } else if (categoryName) {
        const liCat = document.createElement('li');
        liCat.className = 'breadcrumb-item';
        liCat.textContent = categoryName;
        ol.appendChild(liCat);
    }

    // Product name — this is the current page
    if (productName) {
        const liProduct = document.createElement('li');
        liProduct.className = 'breadcrumb-item current';
        liProduct.setAttribute('aria-current', 'page');
        liProduct.textContent = productName;
        ol.appendChild(liProduct);
    }

    // If we have a site breadcrumb container, insert there; otherwise put above title in product-detail
    if (siteContainer) {
        nav.appendChild(ol);
        siteContainer.innerHTML = '';
        siteContainer.appendChild(nav);
    } else {
        // fallback: insert before first heading inside product-detail
        const container = document.querySelector('.product-detail');
        if (!container) return;
        const firstHeading = container.querySelector('h1,h2,h3,h4,h5');
        if (firstHeading) {
            container.insertBefore(nav, firstHeading);
            nav.appendChild(ol);
        } else {
            container.prepend(nav);
            nav.appendChild(ol);
        }
    }
}

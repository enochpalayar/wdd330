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
 */
function renderBreadcrumbFromPage(product) {
    const container = document.querySelector('.product-detail');
    if (!container) return;

    // find existing values (prefer the product object we already have)
    const categoryName = (product && product.Brand && product.Brand.Name) ||
                         (document.querySelector('h2') && document.querySelector('h2').textContent.trim()) ||
                         null;

    const productName = (product && (product.NameWithoutBrand || product.Name)) ||
                        (document.querySelector('h3') && document.querySelector('h3').textContent.trim()) ||
                        null;

    if (!productName) return; // nothing sensible to show

    // Create or reuse breadcrumb nav
    let breadcrumbNav = document.getElementById('breadcrumbs');
    if (!breadcrumbNav) {
        breadcrumbNav = document.createElement('nav');
        breadcrumbNav.id = 'breadcrumbs';
        breadcrumbNav.setAttribute('aria-label', 'Breadcrumb');
        // insert breadcrumb at the top of the product-detail block
        container.prepend(breadcrumbNav);
    }

    // Build list: Home › Category › Product
    const ol = document.createElement('ol');
    ol.className = 'breadcrumb-list';

    // Helper to create list items
    function makeItem(text, href, isCurrent = false) {
        const li = document.createElement('li');
        li.className = 'breadcrumb-item';
        if (isCurrent) {
            li.classList.add('current');
            li.setAttribute('aria-current', 'page');
            li.textContent = text;
        } else {
            const a = document.createElement('a');
            a.textContent = text;
            a.href = href || '#';
            li.appendChild(a);
        }
        return li;
    }

    // Home
    ol.appendChild(makeItem('Home', '/'));

    // Category (if available)
    if (categoryName) {
        // You can replace '#' with a real category URL if your site exposes one
        ol.appendChild(makeItem(categoryName, '#'));
    }

    // Product (current)
    ol.appendChild(makeItem(productName, null, true));

    // Replace existing content
    breadcrumbNav.innerHTML = '';
    breadcrumbNav.appendChild(ol);
}

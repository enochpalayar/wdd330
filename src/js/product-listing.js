import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

loadHeaderFooter();

const category = getParam("category");
const dataSource = new ExternalServices();
const listElement = document.querySelector(".product-list");
const myList = new ProductList(category, dataSource, listElement);

(async () => {
  await myList.init();

  // After list is loaded, render breadcrumb under header
  renderListingBreadcrumb();

  if (category) {
    const titleElement = document.querySelector(".products h2");
    if (titleElement) {
      const formattedCategory =
        category.charAt(0).toUpperCase() + category.slice(1);
      titleElement.textContent = `Top Products: ${formattedCategory}`;
    }
  }
})();

// Update breadcrumb when sorting changes (ProductList re-renders)
const sortSelector = document.getElementById('sortSelector');
if (sortSelector) {
  sortSelector.addEventListener('change', () => {
    // allow ProductList to re-render immediately, then update breadcrumb
    setTimeout(renderListingBreadcrumb, 50);
  });
}

function renderListingBreadcrumb() {
  const container = document.getElementById('site-breadcrumb');
  if (!container) return;

  // If no category param, do not show breadcrumb on home
  if (!category) {
    container.innerHTML = '';
    return;
  }

  const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);

  // Prefer DOM count (in case data source shape differs). Fall back to myList.list length.
  const domCount = document.querySelectorAll('.product-list > li').length;
  const count = domCount || (Array.isArray(myList.list) ? myList.list.length : 0);

  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Breadcrumb');
  nav.id = 'breadcrumbs';

  const ol = document.createElement('ol');
  ol.className = 'breadcrumb-list';

  // Home -> Category (with count)
  const liHome = document.createElement('li');
  liHome.className = 'breadcrumb-item';
  const aHome = document.createElement('a');
  aHome.href = '/';
  aHome.textContent = 'Home';
  liHome.appendChild(aHome);
  ol.appendChild(liHome);

  const liCat = document.createElement('li');
  liCat.className = 'breadcrumb-item current';
  liCat.setAttribute('aria-current', 'page');
  liCat.textContent = `${formattedCategory} -> (${count} items)`;
  ol.appendChild(liCat);

  nav.appendChild(ol);
  container.innerHTML = '';
  container.appendChild(nav);
}

import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
    return `
        <li class="product-card">
        <a href="product_pages/?product=${product.Id}">
            <img src="${product.Image}"alt="Image of ${product.Name}"/>
            <h3 class="card__brand">${product.Brand.Name}</h3>
            <h2 class="card__name">${product.NameWithoutBrand}</h2>
            <p class="product-card__price">$${product.FinalPrice}</p>
        </a>
        </li>`;
}


export default class ProductList {
    constructor(category, datasource, listElement) {
        this.category = category;
        this.datasource = datasource;
        this.listElement = listElement;
    }

    async init() {
        const list = await this.datasource.getData();

        const originalTents = ["880RR", "985RF", "985PR", "344YJ"];

        const filteredList = list.filter(product => originalTents.includes(product.Id));
        
        this.renderList(filteredList);
    }

    renderList(list) {
        //const htmlStrings = list.map(productCardTemplate);
        //this.listElement.insertAdjacentHTML('afterbegin', htmlStrings.join(''));
        renderListWithTemplate(productCardTemplate, this.listElement, list);
    }

}


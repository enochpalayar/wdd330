import { getLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";


function formDataToJSON(formElement) {
    const formData = new FormData(formElement);
    const convertedJSON = {};
    formData.forEach((value, key) => {
        convertedJSON[key] = value; 
    });
    return convertedJSON;
}

function packageItems(items) {
    return items.map((item) => ({
        id: item.Id,
        name: item.Name,
        price: item.FinalPrice,
        quantity: item.Quantity || 1,
    }));
}

export default class CheckoutProcess {
    constructor(key, outputSelector) {
        this.key = key;
        this.outputSelector = outputSelector;
        this.list = [];
        this.itemTotal = 0;
        this.shipping = 0;
        this.tax = 0;
        this.orderTotal = 0;
    }

    init() {
        this.list = getLocalStorage(this.key) || [];
        this.calculateItemSubTotal();
    }

    calculateItemSubTotal() {
        const summaryElement = document.querySelector(`${this.outputSelector} #subtotal`);
        const countElement = document.querySelector(`${this.outputSelector} #num-items`);

        const totalQuantity = this.list.reduce((sum, item) => sum + (item.Quantity || 1), 0);
        this.itemTotal = this.list.reduce((sum, item) => sum + item.FinalPrice * (item.Quantity || 1),
            0
        );

        if (countElement) countElement.innerText = totalQuantity;
        if (summaryElement) summaryElement.innerText = `$${this.itemTotal.toFixed(2)}`;
    }

    calculateOrderTotal() {
        const totalQuantity = this.list.reduce((sum, item) => sum + (item.Quantity || 1), 0);

        this.shipping = totalQuantity > 0 ? 10 + (totalQuantity - 1) * 2 : 0;
        this.tax = this.itemTotal * 0.06;
        this.orderTotal = this.itemTotal + this.shipping + this.tax;
        
        this.displayOrderTotals();
    }

    displayOrderTotals() {
        const shippingEl = document.querySelector(`${this.outputSelector} #shipping`);
        const taxEl = document.querySelector(`${this.outputSelector} #tax`);
        const orderTotalEl = document.querySelector(`${this.outputSelector} #order-total`);

        if (shippingEl) shippingEl.innerText = `$${this.shipping.toFixed(2)}`;
        if (taxEl) taxEl.innerText = `$${this.tax.toFixed(2)}`;
        if (orderTotalEl) orderTotalEl.innerText = `$${this.orderTotal.toFixed(2)}`;
    }

    async checkout(form) {
        const jsonPayload = formDataToJSON(form);

        jsonPayload.orderDate = new Date().toISOString();
        jsonPayload.orderTotal = this.orderTotal.toFixed(2);
        jsonPayload.tax = this.tax.toFixed(2);
        jsonPayload.shipping = this.shipping.toFixed(2);
        jsonPayload.items = packageItems(this.list);
    
        try {
            const services = new ExternalServices();
            const res = await services.checkout(jsonPayload);
            console.log("Server Response:", res);
            return res;
        } catch (err) {
            console.error("Checkout failed:", err);
        }
    }
}
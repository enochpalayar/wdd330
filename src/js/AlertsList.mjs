import { renderListWithTemplate } from "./utils.mjs";

function alertTemplate(alert) {
  return `<li class="alert-banner" style="background-color: ${alert.backgroundColor}">
    <p>${alert.message}</p>
  </li>`;
}

export default class AlertsList {
  constructor(path, listElement) {
    this.path = path;
    this.listElement = listElement;
  }

  async init() {
    const alerts = await this.getData();
    this.renderAlerts(alerts);
  }

  async getData() {
    const res = await fetch(this.path);
    if (!res.ok) throw new Error("Bad Response");
    return res.json();
  }

  renderAlerts(alerts) {
    renderListWithTemplate(alertTemplate, this.listElement, alerts);
  }
}
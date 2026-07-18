import { loadHeaderFooter } from "./utils.mjs";
import AlertsList from "./AlertsList.mjs";

const alertElement = document.querySelector(".alert-list");
const alertsList = new AlertsList("/json/alerts.json", alertElement);
alertsList.init();
loadHeaderFooter();

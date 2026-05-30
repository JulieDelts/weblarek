import "./scss/styles.scss";

import { EventEmitter } from "./components/base/Events";
import { Cart } from "./components/dataModels/Cart";
import { Customer } from "./components/dataModels/Customer";
import { ProductCatalogue } from "./components/dataModels/ProductCatalogue";
import { ViewFactory } from "./components/factories/ViewFactory";
import { Presenter } from "./components/presenters/Presenter";
import { Api } from "./components/base/Api";
import { WebLarekApi } from "./components/dataSources/WebLarekApi";
import { API_URL } from "./utils/constants";

const events = new EventEmitter();

const catalogueContainer = document.querySelector(".gallery") as HTMLElement;
const modalContainer = document.getElementById(
  "modal-container",
) as HTMLElement;
const headerContainer = document.querySelector(".header") as HTMLElement;

if (!catalogueContainer) throw new Error("Контейнер для каталога не найден.");
if (!modalContainer)
  throw new Error("Контейнер для модального окна не найден.");
if (!headerContainer) throw new Error("Контейнер для шапки не найден.");

const templates = {
  cardCatalog: document.getElementById("card-catalog") as HTMLTemplateElement,
  cardPreview: document.getElementById("card-preview") as HTMLTemplateElement,
  cardCart: document.getElementById("card-basket") as HTMLTemplateElement,
  cart: document.getElementById("basket") as HTMLTemplateElement,
  order: document.getElementById("order") as HTMLTemplateElement,
  contacts: document.getElementById("contacts") as HTMLTemplateElement,
  success: document.getElementById("success") as HTMLTemplateElement,
};

for (const [key, template] of Object.entries(templates)) {
  if (!template) throw new Error(`Шаблон "${key}" не найден.`);
}

const productCatalogue = new ProductCatalogue(events);
const cart = new Cart(events);
const customer = new Customer();

const viewFactory = new ViewFactory(
  events,
  templates,
  catalogueContainer,
  modalContainer,
  headerContainer,
);

const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

const app = new Presenter(
  events,
  viewFactory,
  webLarekApi,
  productCatalogue,
  cart,
  customer,
);

app.loadCatalogue();

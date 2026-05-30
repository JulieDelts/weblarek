import { IProductCatalogueView } from "../../types";
import { Component } from "../base/Component";

export class ProductCatalogueView extends Component<IProductCatalogueView> {
  protected catalogueElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.catalogueElement = container;
  }

  set catalog(items: HTMLElement[]) {
    this.catalogueElement.innerHTML = "";
    items.forEach((item) => {
      this.catalogueElement.appendChild(item);
    });
  }
}

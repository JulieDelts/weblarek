import {
  IContactsFormView,
  IOrderFormView,
  IOrderSentRequest,
  IProduct,
  PaymentMethod,
} from "../../types";
import { IEvents } from "../base/Events";
import { Cart } from "../dataModels/Cart";
import { Customer } from "../dataModels/Customer";
import { ProductCatalogue } from "../dataModels/ProductCatalogue";
import { WebLarekApi } from "../dataSources/WebLarekApi";
import { ViewFactory } from "../factories/ViewFactory";

export class Presenter {
  constructor(
    events: IEvents,
    private viewFactory: ViewFactory,
    private webApi: WebLarekApi,
    private productCatalogue: ProductCatalogue,
    private cart: Cart,
    private customer: Customer,
  ) {
    this.initEventHandlers(events);
  }

  async loadCatalogue(): Promise<void> {
    try {
      const products = await this.webApi.getProductsAsync();
      this.productCatalogue.addProducts(products.items);
    } catch (error) {
      console.log(error);
    }
  }

  private initEventHandlers(events: IEvents): void {
    events.on("catalogue:changed", this.handleCatalogueChanged.bind(this));
    events.on("cart:changed", this.handleCartChanged.bind(this));
    events.on("card:select", this.handleProductSelected.bind(this));
    events.on("basket:add", this.handleProductAddedToCart.bind(this));
    events.on("basket:remove", this.handleProductRemovedFromCart.bind(this));
    events.on("basket:open", this.handleCartOpened.bind(this));
    events.on("modal:close", this.handleModalClosed.bind(this));
    events.on("order:start", this.handleOrderStart.bind(this));
    events.on("order:form:submit", this.handleOrderFormSubmit.bind(this));
    events.on("contacts:form:submit", this.handleContactsFormSubmit.bind(this));
    events.on("order:form:change", this.handleOrderFormChange.bind(this));
    events.on("contacts:form:change", this.handleContactsFormChange.bind(this));
  }

  private handleCatalogueChanged(data: { products: IProduct[] }): void {
    this.viewFactory.updateCatalogue(data.products);
    this.viewFactory.updateHeaderCounter(this.cart.getAllProductsCount());
  }

  private handleCartChanged(data: {
    items: IProduct[];
    count: number;
    total: number;
  }): void {
    this.viewFactory.updateHeaderCounter(data.count);
    const modal = this.viewFactory.getModal();
    if (modal.isOpen()) {
      const content = modal.getContent();
      if (content.querySelector(".basket")) {
        const products = this.cart.getAllProducts();
        const total = products.reduce((sum, p) => sum + (p.price ?? 0), 0);
        this.viewFactory.createCart(products, total);
      }
    }
  }

  private handleProductSelected(data: { id: string }): void {
    const product = this.productCatalogue.getProductById(data.id);
    if (!product) return;
    this.viewFactory.createPreviewCard(
      product,
      this.cart.hasProduct(product.id),
    );
  }

  private handleProductAddedToCart(data: { id: string }): void {
    const product = this.productCatalogue.getProductById(data.id);
    if (product && !this.cart.hasProduct(product.id)) {
      this.cart.addProduct(product);
    }
  }

  private handleProductRemovedFromCart(data: { id: string }): void {
    const product = this.productCatalogue.getProductById(data.id);
    if (product) {
      this.cart.removeProduct(product);
    }
  }

  private handleCartOpened(): void {
    const products = this.cart.getAllProducts();
    const total = products.reduce((sum, p) => sum + (p.price ?? 0), 0);

    this.viewFactory.createCart(products, total);
  }

  private handleOrderStart(): void {
    this.viewFactory.createOrderForm(true, []);
  }

  private handleOrderFormChange(data: IOrderFormView): void {
    this.customer.setPayment(data.payment as PaymentMethod);
    this.customer.setAddress(data.address);
    var validation = this.customer.validateOrderData();
    this.viewFactory.createOrderForm(
      validation.isValid,
      validation.errors,
      data.payment,
      data.address,
    );
  }

  private handleContactsFormChange(data: IContactsFormView): void {
    this.customer.setEmail(data.email);
    this.customer.setPhone(data.phone);
    var validation = this.customer.validateContactsData();
    this.viewFactory.createContactsForm(
      validation.isValid,
      validation.errors,
      data.email,
      data.phone,
    );
  }

  private handleOrderFormSubmit(data: IOrderFormView): void {
    this.customer.setPayment(data.payment as PaymentMethod);
    this.customer.setAddress(data.address);
    const validation = this.customer.validateOrderData();

    if (validation.isValid) {
      this.viewFactory.createContactsForm(true, []);
    } else {
      this.viewFactory.createOrderForm(
        validation.isValid,
        validation.errors,
        data.payment,
        data.address,
      );
    }
  }

  private handleContactsFormSubmit(data: IContactsFormView): void {
    this.customer.setEmail(data.email);
    this.customer.setPhone(data.phone);
    const validation = this.customer.validateContactsData();

    if (validation.isValid) {
      this.submitOrder();
    } else {
      this.viewFactory.createContactsForm(
        validation.isValid,
        validation.errors,
        data.email,
        data.phone,
      );
    }
  }

  private handleModalClosed(): void {
    var modal = this.viewFactory.getModal();
    modal.close();
  }

  private async submitOrder(): Promise<void> {
    const order: IOrderSentRequest = {
      items: this.cart.getAllProducts().map((p) => p.id),
      total: this.cart.getAllProductsCost(),
      ...this.customer.getData(),
    };

    try {
      const orderResult = await this.webApi.postOrderAsync(order);

      this.cart.clearCart();
      this.customer.clearData();
      this.viewFactory.createSuccessModal(orderResult.total);
    } catch (error: unknown) {
      console.log(error);
    }
  }
}

import { IOrderSentResponse, IProduct, PaymentMethod } from "../../types";
import { IEvents } from "../base/Events";
import { Cart } from "../dataModels/Cart";
import { Customer } from "../dataModels/Customer";
import { ProductCatalogue } from "../dataModels/ProductCatalogue";
import { ViewFactory } from "../factories/ViewFactory";

export class AppPresenter {
  constructor(
    events: IEvents,
    private viewFactory: ViewFactory,
    private productCatalogue: ProductCatalogue,
    private cart: Cart,
    private customer: Customer,
  ) {
    this.initEventHandlers(events);
  }

  loadCatalogue(products: IProduct[]): void {
    this.productCatalogue.addProducts(products);
  }

  private initEventHandlers(events: IEvents): void {
    events.on("catalogue:changed", this.handleCatalogueChanged.bind(this));
    events.on("cart:changed", this.handleCartChanged.bind(this));
    events.on("card:select", this.handleProductSelected.bind(this));
    events.on("basket:add", this.handleProductAddedToCart.bind(this));
    events.on("basket:remove", this.handleProductRemovedFromCart.bind(this));
    events.on("basket:open", this.handleCartOpened.bind(this));
    events.on("order:start", this.handleOrderProcessStarted.bind(this));
    events.on("order:next", this.handleOrderNextStepStarted.bind(this));
    events.on("contacts:submit", this.handleSubmitOrder.bind(this));
    events.on("modal:close", this.handleModalClosed.bind(this));
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

  private handleOrderProcessStarted(): void {
    const customerData = this.customer.getData();
    this.viewFactory.createOrderForm(
      customerData.payment,
      customerData.address,
    );
  }

  private handleOrderNextStepStarted(data: {
    payment: PaymentMethod;
    address: string;
  }): void {
    this.customer.setPayment(data.payment);
    this.customer.setAddress(data.address);
    const customerData = this.customer.getData();
    this.viewFactory.createContactsForm(customerData.email, customerData.phone);
  }

  private handleModalClosed(): void {
    var modal = this.viewFactory.getModal();
    modal.close();
  }

  private async handleSubmitOrder(): Promise<void> {
    const orderData = {
      items: this.cart.getAllProducts().map((p) => p.id),
      total: this.cart.getAllProductsCost(),
      ...this.customer.getData(),
    };
    const result: IOrderSentResponse = { id: "123", total: orderData.total };

    this.cart.clearCart();
    this.customer.clearData();
    this.viewFactory.createSuccessModal(result.total);
  }
}

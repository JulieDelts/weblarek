import {
  ICartModel,
  ICustomerModel,
  IOrderSentRequest,
  IProduct,
  IProductCatalogueModel,
  IViewFactory,
  IWebLarekApi,
  PaymentMethod,
} from "../../types";
import { IEvents } from "../base/Events";

export class Presenter {
  constructor(
    events: IEvents,
    private viewFactory: IViewFactory,
    private webApi: IWebLarekApi,
    private productCatalogue: IProductCatalogueModel,
    private cart: ICartModel,
    private customer: ICustomerModel,
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
    events.on("basket:remove", this.handleProductRemovedFromCart.bind(this));
    events.on("basket:open", this.handleCartOpened.bind(this));
    events.on("preview:toggle", this.handlePreviewToggle.bind(this));
    events.on("order:start", this.handleOrderStart.bind(this));
    events.on(
      "order:payment:changed",
      this.handleOrderPaymentChanged.bind(this),
    );
    events.on(
      "order:address:changed",
      this.handleOrderAddressChanged.bind(this),
    );
    events.on("order:form:submit", this.handleOrderFormSubmit.bind(this));
    events.on(
      "contacts:email:changed",
      this.handleContactsEmailChanged.bind(this),
    );
    events.on(
      "contacts:phone:changed",
      this.handleContactsPhoneChanged.bind(this),
    );
    events.on("contacts:form:submit", this.submitOrder.bind(this));
    events.on(
      "customer:payment-changed",
      this.handleCustomerPaymentChanged.bind(this),
    );
    events.on(
      "customer:address-changed",
      this.handleCustomerAddressChanged.bind(this),
    );
    events.on(
      "customer:email-changed",
      this.handleCustomerEmailChanged.bind(this),
    );
    events.on(
      "customer:phone-changed",
      this.handleCustomerPhoneChanged.bind(this),
    );
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
    const products = this.cart.getAllProducts();
    const total = products.reduce((sum, p) => sum + (p.price ?? 0), 0);
    this.viewFactory.updateCart(products, total);
  }

  private handleProductSelected(data: { id: string }): void {
    const product = this.productCatalogue.getProductById(data.id);
    if (!product) return;
    this.productCatalogue.setSelectedProduct(product);
    this.viewFactory.createPreviewCard(
      product,
      this.cart.hasProduct(product.id),
    );
  }

  private handleProductRemovedFromCart(data: { id: string }): void {
    const product = this.productCatalogue.getProductById(data.id);
    if (product) {
      this.cart.removeProduct(product);
    }
  }

  private handlePreviewToggle(): void {
    const product = this.productCatalogue.getSelectedProduct();
    if (!product) return;
    if (this.cart.hasProduct(product.id)) {
      this.cart.removeProduct(product);
    } else {
      this.cart.addProduct(product);
    }
  }

  private handleCartOpened(): void {
    const cart = this.viewFactory.getCart();
    const modal = this.viewFactory.getModal();
    modal.content = cart.render();
    modal.open();
  }

  private handleOrderStart(): void {
    this.viewFactory.createOrderForm();
  }

  private handleOrderPaymentChanged(payment: string): void {
    this.customer.setPayment(payment as PaymentMethod);
  }

  private handleOrderAddressChanged(address: string): void {
    this.customer.setAddress(address);
  }

  private updateOrderFormValidity(): void {
    const orderForm = this.viewFactory.getOrderFormView();
    const paymentValidation = this.customer.validatePayment();
    const addressValidation = this.customer.validateAddress();
    const isFormValid = paymentValidation.isValid && addressValidation.isValid;
    orderForm.setValidState(isFormValid);

    if (!paymentValidation.isValid) {
      orderForm.setValidationError(paymentValidation.error ?? "");
    } else if (!addressValidation.isValid) {
      orderForm.setValidationError(addressValidation.error ?? "");
    } else {
      orderForm.setValidationError("");
    }
  }

  private handleOrderFormSubmit(): void {
    this.viewFactory.createContactsForm();
  }

  private handleContactsEmailChanged(email: string): void {
    this.customer.setEmail(email);
  }

  private handleContactsPhoneChanged(phone: string): void {
    this.customer.setPhone(phone);
  }

  private updateContactsFormValidity(): void {
    const contactsForm = this.viewFactory.getContactsFormView();
    const emailValidation = this.customer.validateEmail();
    const phoneValidation = this.customer.validatePhone();
    const isFormValid = emailValidation.isValid && phoneValidation.isValid;
    contactsForm.setValidState(isFormValid);

    if (!emailValidation.isValid) {
      contactsForm.setValidationError(emailValidation.error ?? "");
    } else if (!phoneValidation.isValid) {
      contactsForm.setValidationError(phoneValidation.error ?? "");
    } else {
      contactsForm.setValidationError("");
    }
  }

  private handleCustomerPaymentChanged(payment: string): void {
    const orderForm = this.viewFactory.getOrderFormView();
    orderForm.payment = payment;
    this.updateOrderFormValidity();
  }

  private handleCustomerAddressChanged(address: string): void {
    const orderForm = this.viewFactory.getOrderFormView();
    orderForm.address = address;
    this.updateOrderFormValidity();
  }

  private handleCustomerEmailChanged(email: string): void {
    const contactsForm = this.viewFactory.getContactsFormView();
    contactsForm.email = email;
    this.updateContactsFormValidity();
  }

  private handleCustomerPhoneChanged(phone: string): void {
    const contactsForm = this.viewFactory.getContactsFormView();
    contactsForm.phone = phone;
    this.updateContactsFormValidity();
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

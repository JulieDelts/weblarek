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
    events.on("basket:add", this.handleProductAddedToCart.bind(this));
    events.on("basket:remove", this.handleProductRemovedFromCart.bind(this));
    events.on("basket:open", this.handleCartOpened.bind(this));
    events.on("order:start", this.handleOrderStart.bind(this));
    events.on("review:done", this.modalClose.bind(this));
    events.on("success:done", this.modalClose.bind(this));
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
  }

  private handleCatalogueChanged(data: { products: IProduct[] }): void {
    this.viewFactory.updateCatalogue(data.products);
    this.viewFactory.updateHeaderCounter(this.cart.getAllProductsCount());
  }

  private modalClose(): void {
    const modal = this.viewFactory.getModal();
    modal.close();
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
    this.viewFactory.updateCart(products, total);
    const cart = this.viewFactory.getCart();
    const modal = this.viewFactory.getModal();
    modal.content = cart.render();
    modal.open();
  }

  private handleOrderStart(): void {
    this.viewFactory.createOrderForm();
  }

  private handleOrderPaymentChanged(payment: string): void {
    const validation = this.customer.validatePayment(payment as PaymentMethod);
    if (validation.isValid) {
      this.customer.setPayment(payment as PaymentMethod);
    }

    const orderForm = this.viewFactory.getOrderFormView();
    orderForm.payment = payment;

    if (validation.error) {
      orderForm.setValidationError(validation.error);
    } else {
      orderForm.setValidationError("");
    }

    this.updateOrderFormValidity();
  }

  private handleOrderAddressChanged(address: string): void {
    const validation = this.customer.validateAddress(address);
    if (validation.isValid) {
      this.customer.setAddress(address);
    } else {
      this.customer.setAddress("");
    }
    const orderForm = this.viewFactory.getOrderFormView();
    orderForm.address = address;
    if (validation.error) {
      orderForm.setValidationError(validation.error);
    } else {
      orderForm.setValidationError("");
    }
    this.updateOrderFormValidity();
  }

  private updateOrderFormValidity(): void {
    const customerData = this.customer.getData();
    const orderForm = this.viewFactory.getOrderFormView();
    const isPaymentValid = this.customer.validatePayment(
      customerData.payment,
    ).isValid;
    const isAddressValid = this.customer.validateAddress(
      customerData.address,
    ).isValid;
    const isFormValid = isPaymentValid && isAddressValid;
    orderForm.setValidState(isFormValid);
    if (isFormValid) {
      orderForm.setValidationError("");
    }
  }

  private handleOrderFormSubmit(): void {
    this.viewFactory.createContactsForm();
  }

  private handleContactsEmailChanged(email: string): void {
    const validation = this.customer.validateEmail(email);
    if (validation.isValid) {
      this.customer.setEmail(email);
    } else {
      this.customer.setEmail("");
    }
    const contactsForm = this.viewFactory.getContactsFormView();
    contactsForm.email = email;
    if (validation.error) {
      contactsForm.setValidationError(validation.error);
    } else {
      contactsForm.setValidationError("");
    }
    this.updateContactsFormValidity();
  }

  private handleContactsPhoneChanged(phone: string): void {
    const validation = this.customer.validatePhone(phone);
    if (validation.isValid) {
      this.customer.setPhone(phone);
    } else {
      this.customer.setPhone("");
    }
    const contactsForm = this.viewFactory.getContactsFormView();
    contactsForm.phone = phone;
    if (validation.error) {
      contactsForm.setValidationError(validation.error);
    } else {
      contactsForm.setValidationError("");
    }
    this.updateContactsFormValidity();
  }

  private updateContactsFormValidity(): void {
    const customerData = this.customer.getData();
    const contactsForm = this.viewFactory.getContactsFormView();
    const isEmailValid = this.customer.validateEmail(
      customerData.email,
    ).isValid;
    const isPhoneValid = this.customer.validatePhone(
      customerData.phone,
    ).isValid;
    const isFormValid = isEmailValid && isPhoneValid;
    contactsForm.setValidState(isFormValid);
    if (isFormValid) {
      contactsForm.setValidationError("");
    }
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

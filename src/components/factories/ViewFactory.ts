import { IProduct, IViewTemplates } from "../../types";
import { IEvents } from "../base/Events";
import { CartCardView } from "../views/cards/CartCardView";
import { CatalogueCardView } from "../views/cards/CatalogueCardView";
import { PreviewCardView } from "../views/cards/PreviewCardView";
import { CartView } from "../views/CartView";
import { ContactsFormView } from "../views/forms/ContactsFormView";
import { OrderFormView } from "../views/forms/OrderFormView";
import { HeaderView } from "../views/HeaderView";
import { ModalView } from "../views/ModalView";
import { ProductCatalogueView } from "../views/ProductCatalogueView";
import { SuccessModalView } from "../views/SuccessModalView";

export class ViewFactory {
  private events: IEvents;
  private templates: IViewTemplates;

  private catalogue: ProductCatalogueView | null = null;
  private modal: ModalView | null = null;
  private header: HeaderView | null = null;

  private catalogueContainer: HTMLElement;
  private modalContainer: HTMLElement;
  private headerContainer: HTMLElement;

  constructor(
    events: IEvents,
    templates: IViewTemplates,
    galleryContainer: HTMLElement,
    modalContainer: HTMLElement,
    headerContainer: HTMLElement,
  ) {
    this.events = events;
    this.templates = templates;
    this.catalogueContainer = galleryContainer;
    this.modalContainer = modalContainer;
    this.headerContainer = headerContainer;
  }

  getCatalogue(): ProductCatalogueView {
    if (!this.catalogue) {
      this.catalogue = new ProductCatalogueView(this.catalogueContainer);
    }
    return this.catalogue;
  }

  getModal(): ModalView {
    if (!this.modal) {
      this.modal = new ModalView(this.modalContainer, this.events);
    }
    return this.modal;
  }

  getHeader(): HeaderView {
    if (!this.header) {
      this.header = new HeaderView(this.headerContainer, this.events);
    }
    return this.header;
  }

  updateCatalogue(products: IProduct[]): void {
    const catalogue = this.getCatalogue();
    const cards = products.map((product) => this.createCatalogueCard(product));
    catalogue.catalog = cards;
  }

  updateHeaderCounter(count: number): void {
    const header = this.getHeader();
    header.counter = count;
  }

  createCatalogueCard(product: IProduct): HTMLElement {
    const element = this.cloneElement("cardCatalog");
    const card = new CatalogueCardView(element, this.events);
    card.id = product.id;
    card.title = product.title;
    card.price = product.price ?? null;
    card.image = product.image;
    card.category = product.category;
    return card.render();
  }

  createCartCard(product: IProduct, index: number): HTMLElement {
    const element = this.cloneElement("cardCart");
    const basketCard = new CartCardView(element, this.events);
    basketCard.id = product.id;
    basketCard.title = product.title;
    basketCard.price = product.price ?? null;
    basketCard.index = index;
    return basketCard.render();
  }

  createPreviewCard(product: IProduct, inBasket: boolean): void {
    const element = this.cloneElement("cardPreview");
    const previewCard = new PreviewCardView(element, this.events);
    previewCard.id = product.id;
    previewCard.title = product.title;
    previewCard.price = product.price ?? null;
    previewCard.image = product.image;
    previewCard.category = product.category;
    previewCard.description = product.description;
    previewCard.isProductInBasket = inBasket;

    const modal = this.getModal();
    modal.content = previewCard.render();
    modal.open();
  }

  createCart(products: IProduct[], total: number): void {
    const element = this.cloneElement("cart");
    const cart = new CartView(element, this.events);

    const cards = products.map((product, index) =>
      this.createCartCard(product, index + 1),
    );

    cart.items = cards;
    cart.total = total;

    const modal = this.getModal();
    modal.content = cart.render();
    modal.open();
  }

  createOrderForm(
    isValid: boolean,
    errors: string[],
    payment?: string,
    address?: string,
  ): void {
    const element = this.cloneElement("order");
    const orderForm = new OrderFormView(element, this.events);
    if (payment) orderForm.payment = payment;
    if (address) orderForm.address = address;
    orderForm.setValidState(isValid);
    orderForm.setValidationErrors(errors);
    const modal = this.getModal();
    modal.content = orderForm.render();
  }

  createContactsForm(
    isValid: boolean,
    errors: string[],
    email?: string,
    phone?: string,
  ): void {
    const element = this.cloneElement("contacts");
    const contactsForm = new ContactsFormView(element, this.events);
    if (email) contactsForm.email = email;
    if (phone) contactsForm.phone = phone;
    contactsForm.setValidState(isValid);
    contactsForm.setValidationErrors(errors);
    const modal = this.getModal();
    modal.content = contactsForm.render();
  }

  createSuccessModal(total: number): void {
    const element = this.cloneElement("success");
    const successModal = new SuccessModalView(element, this.events);
    successModal.total = total;

    const modal = this.getModal();
    modal.content = successModal.render();
  }

  private getTemplate(templateName: keyof IViewTemplates): HTMLTemplateElement {
    return this.templates[templateName];
  }

  private cloneElement(templateName: keyof IViewTemplates): HTMLElement {
    const template = this.getTemplate(templateName);
    const content = template.content.cloneNode(true) as DocumentFragment;
    const element = content.firstElementChild as HTMLElement;
    if (!element) {
      throw new Error(`Шаблон "${templateName}" не найден. `);
    }
    return element;
  }
}

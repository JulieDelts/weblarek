import type {
  IHeaderView,
  IModalView,
  IProduct,
  IProductCatalogueView,
  ICartView,
  IOrderFormView,
  IContactsFormView,
  ISuccessModalView,
  IViewConstructors,
  IViewTemplates,
  IViewFactory,
} from "../../types";
import { IEvents } from "../base/Events";

export class ViewFactory implements IViewFactory {
  private events: IEvents;
  private templates: IViewTemplates;

  private catalogue: IProductCatalogueView | null = null;
  private modal: IModalView | null = null;
  private header: IHeaderView | null = null;
  private cartView: ICartView | null = null;
  private orderForm: IOrderFormView | null = null;
  private contactsForm: IContactsFormView | null = null;
  private successModalView: ISuccessModalView | null = null;
  private viewConstructors: IViewConstructors;

  private catalogueContainer: HTMLElement;
  private modalContainer: HTMLElement;
  private headerContainer: HTMLElement;

  constructor(
    events: IEvents,
    templates: IViewTemplates,
    galleryContainer: HTMLElement,
    modalContainer: HTMLElement,
    headerContainer: HTMLElement,
    viewConstructors: IViewConstructors,
  ) {
    this.events = events;
    this.templates = templates;
    this.viewConstructors = viewConstructors;
    this.catalogueContainer = galleryContainer;
    this.modalContainer = modalContainer;
    this.headerContainer = headerContainer;
  }

  getCatalogue(): IProductCatalogueView {
    if (!this.catalogue) {
      this.catalogue = new this.viewConstructors.ProductCatalogueView(
        this.catalogueContainer,
      );
    }
    return this.catalogue;
  }

  getModal(): IModalView {
    if (!this.modal) {
      this.modal = new this.viewConstructors.ModalView(
        this.modalContainer,
        this.events,
      );
    }
    return this.modal;
  }

  getHeader(): IHeaderView {
    if (!this.header) {
      this.header = new this.viewConstructors.HeaderView(
        this.headerContainer,
        this.events,
      );
    }
    return this.header;
  }

  getCart(): ICartView {
    if (!this.cartView) {
      this.cartView = new this.viewConstructors.CartView(
        this.cloneElement("cart"),
        this.events,
      );
    }
    return this.cartView;
  }

  getOrderFormView(): IOrderFormView {
    if (!this.orderForm) {
      this.orderForm = new this.viewConstructors.OrderFormView(
        this.cloneElement("order"),
        this.events,
      );
    }
    return this.orderForm;
  }

  getContactsFormView(): IContactsFormView {
    if (!this.contactsForm) {
      this.contactsForm = new this.viewConstructors.ContactsFormView(
        this.cloneElement("contacts"),
        this.events,
      );
    }
    return this.contactsForm;
  }

  getSuccessModalView(): ISuccessModalView {
    if (!this.successModalView) {
      this.successModalView = new this.viewConstructors.SuccessModalView(
        this.cloneElement("success"),
        this.events,
        () => this.getModal().close(),
      );
    }
    return this.successModalView;
  }

  updateCatalogue(products: IProduct[]): void {
    const catalogue = this.getCatalogue();
    const cards = products.map((product) => this.createCatalogueCard(product));
    catalogue.catalogue = cards;
  }

  updateHeaderCounter(count: number): void {
    const header = this.getHeader();
    header.counter = count;
  }

  updateCart(products: IProduct[], total: number): void {
    const cart = this.getCart();
    const cards = products.map((product, index) =>
      this.createCartCard(product, index + 1),
    );
    cart.items = cards;
    cart.total = total;
  }

  createCatalogueCard(product: IProduct): HTMLElement {
    const element = this.cloneElement("cardCatalog");
    const card = new this.viewConstructors.CatalogueCardView(element, () =>
      this.events.emit("card:select", { id: product.id }),
    );
    card.title = product.title;
    card.price = product.price ?? null;
    card.image = product.image;
    card.category = product.category;
    return card.render();
  }

  createCartCard(product: IProduct, index: number): HTMLElement {
    const element = this.cloneElement("cardCart");
    const basketCard = new this.viewConstructors.CartCardView(element, () =>
      this.events.emit("basket:remove", { id: product.id }),
    );
    basketCard.title = product.title;
    basketCard.price = product.price ?? null;
    basketCard.index = index;
    return basketCard.render();
  }

  createPreviewCard(product: IProduct, inBasket: boolean): void {
    const element = this.cloneElement("cardPreview");
    const modal = this.getModal();
    const previewCard = new this.viewConstructors.PreviewCardView(
      element,
      () => this.events.emit("preview:toggle"),
      () => modal.close(),
    );
    previewCard.title = product.title;
    previewCard.price = product.price ?? null;
    previewCard.image = product.image;
    previewCard.category = product.category;
    previewCard.description = product.description;
    previewCard.isProductInBasket = inBasket;
    modal.content = previewCard.render();
    modal.open();
  }

  createCart(products: IProduct[], total: number): void {
    this.updateCart(products, total);
    const modal = this.getModal();
    modal.content = this.getCart().render();
    modal.open();
  }

  createOrderForm(): void {
    const orderForm = this.getOrderFormView();
    const modal = this.getModal();
    modal.content = orderForm.render();
    modal.open();
  }

  createContactsForm(): void {
    const contactsForm = this.getContactsFormView();
    const modal = this.getModal();
    modal.content = contactsForm.render();
    modal.open();
  }

  createSuccessModal(total: number): void {
    const modal = this.getModal();
    const successModal = this.getSuccessModalView();
    successModal.total = total;
    modal.content = successModal.render();
    modal.open();
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

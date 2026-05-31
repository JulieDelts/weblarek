import { IEvents } from "../components/base/Events";

export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T>;
}

export interface ICustomer {
  payment: PaymentMethod;
  address: string;
  email: string;
  phone: string;
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export type PaymentMethod = "card" | "cash" | "";

export interface IProductsResponse {
  total: number;
  items: IProduct[];
}

export interface IOrderSentRequest extends ICustomer {
  total: number;
  items: string[];
}

export interface IOrderSentResponse {
  id: string;
  total: number;
}

export interface IViewTemplates {
  cardCatalog: HTMLTemplateElement;
  cardPreview: HTMLTemplateElement;
  cardCart: HTMLTemplateElement;
  cart: HTMLTemplateElement;
  order: HTMLTemplateElement;
  contacts: HTMLTemplateElement;
  success: HTMLTemplateElement;
}

export interface IComponent<T> {
  render(data?: Partial<T>): HTMLElement;
}

export interface IProductCatalogueViewData {
  catalogue: HTMLElement[];
}

export interface IModalViewData {
  content: HTMLElement;
}

export interface IHeaderViewData {
  counter: number;
}

export interface ICartViewData {
  items: HTMLElement[];
  total: number;
}

export interface ICardViewData {
  id: string;
  title: string;
  price: number | null;
}

export interface ICatalogueCardViewData extends ICardViewData {
  image: string;
  category: string;
}

export interface IPreviewCardViewData extends ICatalogueCardViewData {
  description: string;
  isProductInBasket: boolean;
}

export interface IFormViewData {}

export interface ISuccessModalViewData {
  total: number;
}

export interface IProductCatalogueView
  extends IComponent<IProductCatalogueViewData>, IProductCatalogueViewData {}

export interface IModalView extends IComponent<IModalViewData>, IModalViewData {
  isOpen(): boolean;
  getContent(): HTMLElement;
  open(): void;
  close(): void;
}

export interface ICartCardViewData extends ICardViewData {
  index: number;
}

export interface IContactsFormViewData extends IFormViewData {
  email: string;
  phone: string;
}

export interface IOrderFormViewData extends IFormViewData {
  payment: string;
  address: string;
}

export interface IHeaderView
  extends IComponent<IHeaderViewData>, IHeaderViewData {}

export interface ICartView extends IComponent<ICartViewData>, ICartViewData {}

export interface ICardView extends IComponent<ICardViewData>, ICardViewData {}

export interface ICatalogueCardView extends ICardView, ICatalogueCardViewData {}

export interface ICartCardView extends ICardView, ICartCardViewData {}

export interface IPreviewCardView
  extends ICatalogueCardView, IPreviewCardViewData {}

export interface IFormView extends IComponent<IFormViewData> {
  valid: boolean;
  errors: string;
  setValidState(isValid: boolean): void;
  setValidationError(error: string): void;
}

export interface IContactsFormView extends IFormView, IContactsFormViewData {}

export interface IOrderFormView extends IFormView, IOrderFormViewData {}

export interface ISuccessModalView extends IComponent<ISuccessModalViewData> {
  total: number;
}

export interface IViewConstructors {
  ProductCatalogueView: IViewConstructor<IProductCatalogueView, [HTMLElement]>;
  ModalView: IViewConstructor<IModalView, [HTMLElement, IEvents]>;
  HeaderView: IViewConstructor<IHeaderView, [HTMLElement, IEvents]>;
  CartView: IViewConstructor<ICartView, [HTMLElement, IEvents]>;
  OrderFormView: IViewConstructor<IOrderFormView, [HTMLElement, IEvents]>;
  ContactsFormView: IViewConstructor<IContactsFormView, [HTMLElement, IEvents]>;
  SuccessModalView: IViewConstructor<ISuccessModalView, [HTMLElement, IEvents]>;
  CatalogueCardView: IViewConstructor<
    ICatalogueCardView,
    [HTMLElement, IEvents]
  >;
  CartCardView: IViewConstructor<ICartCardView, [HTMLElement, IEvents]>;
  PreviewCardView: IViewConstructor<IPreviewCardView, [HTMLElement, IEvents]>;
}

export interface IViewConstructor<T, A extends any[] = any[]> {
  new (...args: A): T;
}

export interface IWebLarekApi {
  getProductsAsync(): Promise<IProductsResponse>;
  postOrderAsync(orderData: IOrderSentRequest): Promise<IOrderSentResponse>;
}

export interface IProductCatalogueModel {
  addProducts(products: IProduct[]): void;
  getAllProducts(): IProduct[];
  getProductById(id: string): IProduct | undefined;
  setSelectedProduct(product: IProduct): void;
  getSelectedProduct(): IProduct | null;
}

export interface ICustomerModel {
  getData(): ICustomer;
  setPayment(payment: PaymentMethod): void;
  setAddress(address: string): void;
  setEmail(email: string): void;
  setPhone(phone: string): void;
  clearData(): void;
  validatePayment(payment?: PaymentMethod): {
    isValid: boolean;
    error?: string;
  };
  validateAddress(address?: string): { isValid: boolean; error?: string };
  validateEmail(email?: string): { isValid: boolean; error?: string };
  validatePhone(phone?: string): { isValid: boolean; error?: string };
}

export interface ICartModel {
  getAllProducts(): IProduct[];
  getAllProductsCount(): number;
  getAllProductsCost(): number;
  hasProduct(productId: string): boolean;
  addProduct(product: IProduct): void;
  removeProduct(product: IProduct): void;
  clearCart(): void;
}

export interface IViewFactory {
  getCatalogue(): IProductCatalogueView;
  getModal(): IModalView;
  getHeader(): IHeaderView;
  getCart(): ICartView;
  getOrderFormView(): IOrderFormView;
  getContactsFormView(): IContactsFormView;
  getSuccessModalView(): ISuccessModalView;
  updateCatalogue(products: IProduct[]): void;
  updateHeaderCounter(count: number): void;
  updateCart(products: IProduct[], total: number): void;
  createCatalogueCard(product: IProduct): HTMLElement;
  createCartCard(product: IProduct, index: number): HTMLElement;
  createPreviewCard(product: IProduct, inBasket: boolean): void;
  createCart(products: IProduct[], total: number): void;
  createOrderForm(): void;
  createContactsForm(): void;
  createSuccessModal(total: number): void;
}

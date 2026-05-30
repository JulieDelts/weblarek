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

export interface ICardView {
  id: string;
  title: string;
  price: number | null;
}

export interface ICartCardView extends ICardView {
  index: number;
}

export interface IFormView {
  valid: boolean;
  errors: string;
}

export interface IContactsFormView {
  email: string;
  phone: string;
}

export interface IOrderFormView {
  payment: string;
  address: string;
}

export interface ICartView {
  items: HTMLElement[];
  total: number;
}

export interface IHeaderView {
  counter: number;
}

export interface IProductCatalogueView {
  catalogue: HTMLElement[];
}

export interface IModalView {
  content: HTMLElement;
}

export interface ISuccessModalView {
  total: number;
}

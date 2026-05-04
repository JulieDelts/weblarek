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

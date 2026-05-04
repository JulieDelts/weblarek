import { IApi } from "../../types";
import {
  IOrderSentRequest,
  IOrderSentResponse,
  IOrderSentErrorResponse,
  IProductsResponse,
} from "../../types";
import { settings } from "../../utils/constants";

export class WebLarekApi {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  async getProductsAsync(): Promise<IProductsResponse> {
    return await this.api.get<IProductsResponse>(
      `${settings.webLarekProductsEndpoint}`,
    );
  }

  async postOrderAsync(
    orderData: IOrderSentRequest,
  ): Promise<IOrderSentResponse | IOrderSentErrorResponse> {
    return await this.api.post<IOrderSentResponse | IOrderSentErrorResponse>(
      `${settings.webLarekOrderSentEndpoint}`,
      orderData,
      "POST",
    );
  }
}

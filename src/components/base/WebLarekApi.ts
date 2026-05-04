import { Api } from "./Api";
import {
  IProduct,
  IOrderSentRequest,
  IOrderSentResponse,
  IProductsResponse,
} from "../../types";
import { settings, API_URL } from "../../utils/constants";

export class WebLarekApi {
  private api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  async getProductsAsync(): Promise<{
    success: boolean;
    data?: IProduct[];
    error?: string;
  }> {
    try {
      const response = await this.api.get<IProductsResponse>(
        `${settings.webLarekProductsEndpoint}`,
      );

      return {
        success: true,
        data: response.items,
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Неизвестная ошибка при загрузке товаров";
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  async postOrderAsync(
    orderData: IOrderSentRequest,
  ): Promise<{ success: boolean; data?: IOrderSentResponse; error?: string }> {
    try {
      const response = await this.api.post<IOrderSentResponse>(
        `${settings.webLarekOrderSentEndpoint}`,
        orderData,
        "POST",
      );

      return {
        success: true,
        data: response,
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Неизвестная ошибка при отправке заказа";
      return {
        success: false,
        error: errorMessage,
      };
    }
  }
}

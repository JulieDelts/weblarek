import { ICartModel, IProduct } from "../../types/index";
import { IEvents } from "../base/Events";

export class Cart implements ICartModel {
  private products: IProduct[] = [];

  constructor(private events: IEvents) {}

  getAllProducts(): IProduct[] {
    return this.products;
  }

  getAllProductsCount(): number {
    return this.products.length;
  }

  getAllProductsCost(): number {
    return this.products.reduce(
      (sum, product) => sum + (product.price ?? 0),
      0,
    );
  }

  hasProduct(productId: string): boolean {
    return this.products.some((product) => product.id === productId);
  }

  addProduct(product: IProduct): void {
    this.products.push(product);
    this.events.emit("cart:changed", {
      items: this.products,
      count: this.getAllProductsCount(),
      total: this.getAllProductsCost(),
    });
  }

  removeProduct(product: IProduct): void {
    const index = this.products.findIndex((p) => p.id === product.id);
    if (index === -1) {
      return;
    }
    this.products.splice(index, 1);
    this.events.emit("cart:changed", {
      items: this.products,
      count: this.getAllProductsCount(),
      total: this.getAllProductsCost(),
    });
  }

  clearCart(): void {
    this.products = [];
    this.events.emit("cart:changed", {
      items: this.products,
      count: 0,
      total: 0,
    });
  }
}

import { IProduct } from "../../types/index";

export class Cart {
  private products: IProduct[] = [];

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
  }

  removeProduct(product: IProduct): void {
    const index = this.products.findIndex((p) => p.id === product.id);
    if (index === -1) {
      return;
    }
    this.products.splice(index, 1);
  }

  clearCart(): void {
    this.products = [];
  }
}

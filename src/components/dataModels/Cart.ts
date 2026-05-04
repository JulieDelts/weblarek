import { IProduct } from "../../types/index";

export class Cart {
  private products: Map<string, { product: IProduct; quantity: number }> =
    new Map();

  constructor(products: IProduct[] = []) {
    products.forEach((product) => {
      this.addProduct(product);
    });
  }

  getAllProducts(): Map<string, { product: IProduct; quantity: number }> {
    return this.products;
  }

  getAllProductsCount(): number {
    return Array.from(this.products.values()).reduce(
      (sum, item) => sum + item.quantity,
      0,
    );
  }

  getAllProductsCost(): number {
    return Array.from(this.products.values()).reduce(
      (sum, { product, quantity }) => sum + product.price! * quantity,
      0,
    );
  }

  hasProduct(productId: string): boolean {
    return this.products.has(productId);
  }

  addProduct(
    product: IProduct,
    quantity: number = 1,
  ): { success: boolean; error?: string } {
    if (quantity <= 0) {
      return {
        success: false,
        error: "Количество товара должно быть больше 0.",
      };
    }

    if (product.price === null) {
      return {
        success: false,
        error: `Товар "${product.title}" в данный момент не выставлен на продажу.`,
      };
    }

    const existingItem = this.products.get(product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.products.set(product.id, {
        product,
        quantity,
      });
    }

    return { success: true };
  }

  decrementProduct(product: IProduct): { success: boolean; error?: string } {
    const item = this.products.get(product.id);

    if (!item) {
      return {
        success: false,
        error: `Товар "${product.title}" не найден в корзине.`,
      };
    }

    if (item.quantity <= 1) {
      this.products.delete(product.id);
    } else {
      item.quantity--;
    }

    return { success: true };
  }

  removeProduct(product: IProduct): { success: boolean; error?: string } {
    if (!this.products.has(product.id)) {
      return {
        success: false,
        error: `Товар "${product.title}" не найден в корзине.`,
      };
    }

    this.products.delete(product.id);
    return { success: true };
  }

  clearCart(): void {
    this.products.clear();
  }
}

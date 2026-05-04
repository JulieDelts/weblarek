import { IProduct } from "../../types/index";

export class ProductCatalogue {
  private products: IProduct[] = [];
  private selectedProduct: IProduct | null = null;

  addProducts(products: IProduct[]): void {
    this.products = products;
  }

  getAllProducts(): IProduct[] {
    return this.products;
  }

  getProductById(id: string): IProduct | undefined {
    return this.products.find((product) => product.id === id);
  }

  setSelectedProduct(product: IProduct): void {
    this.selectedProduct = product;
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}

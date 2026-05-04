import { IProduct } from "../../types/index";

export class ProductCatalogue {
  private products: IProduct[];
  private selectedProduct: IProduct | null;

  constructor(
    products: IProduct[] = [],
    selectedProduct: IProduct | null = null,
  ) {
    this.products = products;
    this.selectedProduct = selectedProduct;
  }

  addProducts(products: IProduct[]): void {
    this.products =
      this.products.length > 0 ? [...this.products, ...products] : products;
  }

  getAllProducts(): IProduct[] {
    return this.products;
  }

  getProductById(id: string): { product?: IProduct; error?: string } {
    const product = this.products.find((product) => product.id === id);

    if (!product) {
      return {
        error: `Товар с идентификатором "${id}" не найден`,
      };
    }

    return {
      product: product,
    };
  }

  setSelectedProduct(product: IProduct): void {
    this.selectedProduct = product;
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}

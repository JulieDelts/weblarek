import { IProduct, IProductCatalogueModel } from "../../types/index";
import { IEvents } from "../base/Events";

export class ProductCatalogue implements IProductCatalogueModel {
  private products: IProduct[] = [];
  private selectedProduct: IProduct | null = null;

  constructor(private events: IEvents) {}

  addProducts(products: IProduct[]): void {
    this.products = products;
    this.events.emit("catalogue:changed", { products: this.products });
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

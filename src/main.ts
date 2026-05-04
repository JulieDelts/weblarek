import "./scss/styles.scss";
import { PaymentMethod, IProduct, IOrderSentRequest } from "./types/index.ts";
import { Customer } from "./components/dataModels/Customer.ts";
import { Cart } from "./components/dataModels/Cart.ts";
import { ProductCatalogue } from "./components/dataModels/ProductCatalogue.ts";
import { apiProducts } from "./utils/data";
import { Api } from "./components/base/Api.ts";
import { API_URL } from "./utils/constants.ts";
import { WebLarekApi } from "./components/base/WebLarekApi.ts";

const customer = new Customer();
console.log("Тестирование Customer");

console.log("Метод setPayment()");
const payment = customer.setPayment(PaymentMethod.CARD);
console.log("Результат:", payment);

console.log("Метод setAddress()");
const address = customer.setAddress("ул. Набережная, д. 29");
console.log("Результат:", address);

console.log("Метод setEmail()");
const email = customer.setEmail("test@yandex.ru");
console.log("Результат:", email);

console.log("Метод setPhone()");
const phone = customer.setPhone("+89163577897");
console.log("Результат:", phone);

console.log("Метод getData()");
const data = customer.getData();
console.log("Данные покупателя:", data.data);

console.log("Метод clearData():");
customer.clearData();
const clearedData = customer.getData();
console.log("Данные после очистки:", clearedData.data);

console.log("----------------------------------------------------------");

const cart = new Cart();
const testProducts: IProduct[] = apiProducts.items.map((item) => ({
  id: item.id,
  description: item.description,
  image: item.image,
  title: item.title,
  category: item.category,
  price: item.price,
}));
console.log("Тестирование Cart");

console.log("Метод addProduct()");
const addProduct = cart.addProduct(testProducts[0], 2);
console.log("Результат:", addProduct);

console.log("Метод getAllProducts()");
const allCartProducts = cart.getAllProducts();
console.log("Товары в корзине:", allCartProducts.entries());

console.log("Метод getAllProductsCount()");
const totalCount = cart.getAllProductsCount();
console.log("Общее количество товаров:", totalCount);

console.log("Метод getAllProductsCost()");
const totalCost = cart.getAllProductsCost();
console.log("Общая стоимость:", totalCost);

console.log("Метод hasProduct()");
const hasProduct = cart.hasProduct(testProducts[0].id);
console.log(`Есть ли товар "${testProducts[0].title}":`, hasProduct);

console.log("Метод decrementProduct()");
const decrementResult = cart.decrementProduct(testProducts[0]);
console.log("Результат:", decrementResult);

console.log("Метод removeProduct()");
const removeResult = cart.removeProduct(testProducts[0]);
console.log("Результат:", removeResult);

console.log("Метод clearCart()");
cart.clearCart();
const clearedCart = cart.getAllProducts();
console.log("Корзина после очистки:", Array.from(clearedCart.entries()));

console.log("----------------------------------------------------------");

const catalogue = new ProductCatalogue();
console.log("Тестирование ProductCatalogue");

console.log("Метод addProducts()");
catalogue.addProducts([testProducts[0], testProducts[1]]);

console.log("Метод getAllProducts()");
const allCatalogueProducts = catalogue.getAllProducts();
console.log("Все товары:", allCatalogueProducts);

console.log("Метод getProductById()");
const existingProduct = catalogue.getProductById(testProducts[0].id);
console.log("Результат:", existingProduct);

console.log("Метод setSelectedProduct()");
catalogue.setSelectedProduct(testProducts[0]);
console.log("Результат: выбран товар", testProducts[0].title);

console.log("Метод getSelectedProduct()");
const selectedProduct = catalogue.getSelectedProduct();
console.log(
  "Выбранный товар:",
  selectedProduct
    ? { id: selectedProduct.id, title: selectedProduct.title }
    : null,
);

console.log("----------------------------------------------------------");

const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);
console.log("Тестирование WebLarekApi");

console.log("Метод getProductsAsync()");
const products = await webLarekApi.getProductsAsync();
console.log("Полученные товары:", products);

console.log("Метод postOrderAsync(order)");
const order: IOrderSentRequest = {
  payment: "online",
  email: "test@test.ru",
  phone: "+71234567890",
  address: "Spb Vosstania 1",
  total: 2200,
  items: [
    "854cef69-976d-4c2a-a18c-2aa45046c390",
    "c101ab44-ed99-4a54-990d-47aa2bb4e7d9",
  ],
};

const orderResult = await webLarekApi.postOrderAsync(order);
console.log("Результат создания заказа:", orderResult);

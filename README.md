# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```

## Сборка

```
npm run build
```

или

```
yarn build
```

# Интернет-магазин «Web-Larёk»

«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component

Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`

#### Интерфейс IApi

Интерфейс для адаптера HTTP-запросов.

Методы интерфейса:  
`get<T extends object>(uri: string): Promise<T>` - выполняет GET запрос на переданный в параметрах эндпоинт и возвращает промис с объектом указанного типа.  
`post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>` - выполняет POST/PUT/DELETE запрос на указанный эндпоинт, отправляя данные в теле. Параметр `method` опционален и определяется типом `ApiPostMethods`.

#### Класс EventEmitter

Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` - хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

### Данные

#### Интерфейс IProduct

Данный интерфейс описывает структуру объекта данных товара.

Поля интерфейса:
`id: string` - уникальный идентификатор товара,
`description: string` - описание товара,
`image: string` - ссылка на изображение товара,
`title: string` - название товара,
`category: string` - категория товара,
`price: number | null` - цена товара; значение null означает, что цена не указана.

#### Интерфейс ICustomer

Интерфейс описывает структуру объекта данных покупателя.

Поля интерфейса:
`payment: PaymentMethod` - способ оплаты,
`address: string` - адрес доставки покупателя,
`email: string` - электронная почта покупателя,
`phone: string` - номер телефона покупателя.

#### Тип PaymentMethod

Тип представляет собой варианты оплаты на сайте.

Варианты:
`cash`,
`card`,
``

#### Интерфейс IProductsResponse

Интерфейс описывает структуру ответа сервера при запросе списка товаров.

Поля интерфейса:
`total: number` - общее количество товаров в каталоге,
`items: IProduct[]` - массив объектов товаров, каждый из которых соответствует интерфейсу IProduct.

#### Интерфейс IOrderSentRequest

Интерфейс описывает структуру данных, отправляемых на сервер при оформлении заказа. Он расширяет интерфейс ICustomer.

Поля интерфейса:
`total: number` - итоговая сумма заказа,
`items: string[]` - массив идентификаторов товаров, включённых в заказ.

#### Интерфейс IOrderSentResponse

Интерфейс описывает структуру успешного ответа сервера после оформления заказа.

Поля интерфейса:
`id: string` - уникальный идентификатор созданного заказа,
`total: number` - итоговая сумма заказа.

#### Интерфейс IViewTemplates

Интерфейс для хранения шаблонов

Поля интерфейса:
`cardCatalog: HTMLTemplateElement`
`cardPreview: HTMLTemplateElement`
`cardCart: HTMLTemplateElement`
`cart: HTMLTemplateElement`
`order: HTMLTemplateElement`
`contacts: HTMLTemplateElement`
`success: HTMLTemplateElement`

#### Интерфейсы ViewData

Набор интерфейсов, описывающих структуру данных, которая передаётся в View через метод `render()`.

`IProductCatalogueViewData` — данные для каталога товаров: `catalogue: HTMLElement[]`.

`IModalViewData` — данные для модального окна: `content: HTMLElement`.

`IHeaderViewData` — данные для шапки сайта: `counter: number`.

`ICartViewData` — данные для корзины: `items: HTMLElement[]`, `total: number`.

`ICardViewData` — базовые данные карточки товара: `id: string`, `title: string`, `price: number | null`.

`ICatalogueCardViewData` — расширяет `ICardViewData`, добавляя `image: string`, `category: string`.

`IPreviewCardViewData` — расширяет `ICatalogueCardViewData`, добавляя `description: string`, `isProductInBasket: boolean`.

`ICartCardViewData` — расширяет `ICardViewData`, добавляя `index: number`.

`IFormViewData` — пустой базовый интерфейс для форм.

`IContactsFormViewData` — расширяет `IFormViewData`, добавляя `email: string`, `phone: string`.

`IOrderFormViewData` — расширяет `IFormViewData`, добавляя `payment: string`, `address: string`.

`ISuccessModalViewData` — данные для окна успешного заказа: `total: number`.

#### Интерфейс IViewConstructors

Интерфейс определяет набор конструкторов для всех View-компонентов, используемых в `ViewFactory`.

Поля интерфейса:
`ProductCatalogueView` — конструктор каталога товаров
`ModalView` — конструктор модального окна
`HeaderView` — конструктор шапки сайта
`CartView` — конструктор корзины
`OrderFormView` — конструктор формы заказа
`ContactsFormView` — конструктор формы контактов
`SuccessModalView` — конструктор окна успешного заказа
`CatalogueCardView` — конструктор карточки каталога
`CartCardView` — конструктор карточки корзины
`PreviewCardView` — конструктор карточки превью

#### ICardView

Описывает базовую структуру данных для карточки товара

Поля интерфейса:
`id: string` - идентификатор товара
`title: string`- название товара
`price: number | null` - цена товара

#### ICartCardView

Расширяет ICardView, добавляя поле для карточки товара в корзине.

Поля интерфейса:
`index: number` - порядковый номер товара в корзине

#### Интерфейс IFormView

Интерфейс для хранения состояния формы

`valid: boolean`
`errors: string`
`setValidState(isValid: boolean): void`
`setValidationError(error: string): void`

#### Интерфейс IOrderFormView

`payment: string`
`address: string`

#### IContactsFormView

Описывает данные формы контактов.

Поля интерфейса:
email: string - введённый email
phone: string - введённый номер телефона

#### ICartView

Описывает структуру данных для отображения корзины.

Поля интерфейса:
`items: HTMLElement[]` - массив DOM-элементов карточек товаров в корзине
`total: number` - общая стоимость товаров в корзине

#### IHeaderView

Описывает структуру данных для отображения шапки сайта.

Поля интерфейса:
`counter: number` - количество товаров в корзине

#### IModalView

Описывает структуру данных для модального окна.

Поля интерфейса:
`content: HTMLElement` - содержимое модального окна

#### ISuccessModalView

Описывает структуру данных для модального окна успешного заказа.

Поля интерфейса:
`total: number` - списанная сумма заказа

### Модели данных

#### Класс Customer

Класс отвечает за управление данными покупателя: хранение, сбор, валидацию.

Конструктор класса не принимает параметров.

Поля класса:
`customer: ICustomer` - приватное поле, хранящее объект с данными покупателя, структура которого соответствует интерфейсу ICustomer

Методы класса:
`getData(): ICustomer` возвращает данные покупателя в виде объекта `ICustomer`.

`setPayment(payment: PaymentMethod): void ` устанавливает способ оплаты. Параметром метода является способ оплаты (PaymentMethod), возвращаемого значения нет.

`setAddress(address: string): void` устанавливает адрес доставки. Параметром метода является `address: string`, возвращаемого значения нет.

`setEmail(email: string): void` устанавливает электронную почту. Параметром метода является `email: string`, электронная почта, возвращаемого значения нет.

`setPhone(phone: string): void` устанавливает номер телефона. Параметром метода является `phone: string`, номер телефона, возвращаемого значения нет.

`clearData(): void` очищает все данные покупателя, устанавливая все поля равными "". У метода нет параметров и возвращаемого значения.

`validatePayment(payment?: PaymentMethod): { isValid: boolean; error?: string }` проверяет, выбран ли способ оплаты.

`validateAddress(address?: string): { isValid: boolean; error?: string }` проверяет, заполнен ли адрес.

`validateEmail(email?: string): { isValid: boolean; error?: string }` проверяет, заполнен ли email.

`validatePhone(phone?: string): { isValid: boolean; error?: string }` проверяет, заполнен ли телефон.

#### Класс Cart

Класс отвечает за управление корзиной c товарами, а именно хранение товаров, их добавление, удаление, изменение количества, подсчет стоимости и количества.

Конструктор класса не принимает параметров.

Поля класса:
`products: IProduct[]` - приватный массив, который хранит добавленные товары IProduct.
`events: IEvents` - приватное поле, хранит ссылку на брокер событий.

Методы класса:
`getAllProducts(): IProduct[]` возвращает массив со всеми товарами в корзине. Метод не принимает параметров. Возвращаемым значением является массив с товарами.

`getAllProductsCount(): number` - возвращает общее количество товаров в корзине. Метод не принимает параметров. Возвращаемым значением является целое число.

`getAllProductsCost(): number` - возвращает стоимость всех товаров в корзине. Метод не принимает параметров. Возвращаемым значением является целое число.

`hasProduct(productId: string): boolean` - проверяет наличие товара в корзине. Параметром метода является идентификатор товара (id: string). Возвращаемым значением является флаг наличия товара типа boolean.

`addProduct(product: IProduct): void` - добавляет товар в корзину. Параметром метода является product: IProduct, добавляемый товар. После добавления генерирует событие `cart:changed` с обновленными данными корзины.

`removeProduct(product: IProduct): void` - удаляет товар из корзины по его id. Если товар не найден, метод завершается. После удаления генерирует событие `cart:changed` с обновленными данными корзины.

`clearCart(): void` - очищает корзину, удаляя все товары. Генерирует событие `cart:changed` с нулевыми значениями. У метода нет параметров и возвращаемого значения.

#### Класс ProductCatalogue

Данный класс отвечает за работу с каталогом товаров, включая хранение массива с товарами, добавление новых товаров, поиск товаров по идентификатору и управление выбранным товаром для подробного отображения.

Конструктор класса не принимает параметров.

Конструктор класса `constructor(events: IEvents)` принимает брокер событий events для отправки уведомлений.

Поля класса:
`products IProduct[]` - закрытое поле, которое хранит массив всех товаров в каталоге,
`selectedProduct IProduct | null` - закрытое поле, хранящее товар, выбранный для подробного отображения.
`events: IEvents` - приватное поле, хранит ссылку на брокер событий.

Методы класса:
`addProducts(products: IProduct[]): void` - добавляет новые товары в каталог. Параметром является массив товаров для добавления products: IProduct[]. Генерирует событие `catalogue:changed` с новым массивом товаров.

`getAllProducts(): IProduct[]` - возвращает массив всех товаров из каталога. Параметров нет. Возвращаемым значением является массив всех товаров в каталоге IProduct[].

`getProductById(id: string): IProduct | undefined` - возвращает товар по его идентификатору id: string. Метод возвращает IProduct, найденный товар, если он был найден, иначе undefined.

`setSelectedProduct(product: IProduct): void` - сохраняет товар для подробного отображения. Параметром является товар, который будет отображаться product: IProduct. Возвращаемого значения нет.

`getSelectedProduct(): IProduct | null` - возвращает товар, выбранный для подробного отображения. У метода нет параметров, возвращаемым значением является IProduct | null, выбранный товар или null, если товар не был выбран для подробного отображения.

### Слой коммуникации

#### Класс WebLarekApi

Класс отвечает за взаимодействие с API приложения, а именно за получение списка товаров и отправку данных заказа на сервер.

Конструктор класса принимает параметр `api: IApi` — объект, реализующий интерфейс IApi, который предоставляет методы для выполнения HTTP-запросов.

Поля класса:
`api: IApi` — приватное поле, в котором хранится объект, реализующий интерфейс `IApi`, для выполнения запросов к серверу.

Методы класса:
`getProductsAsync(): Promise<IProductsResponse>` получает список доступных товаров с сервера. У метода нет параметров. Возвращаемым значением является объект Promise, который разрешается в объект, реализующий интерфейс `IProductsResponse`.

`postOrderAsync(orderData: IOrderSentRequest): Promise<IOrderSentResponse>` отправляет данные заказа на сервер. Параметром метода является объект, содержащий данные заказа `orderData: IOrderSentRequest`. Возвращаемым значением является объект Promise, который разрешается в объект, реализующий интерфейс `IOrderSentResponse`.

### Слой представления

#### Класс ViewFactory

Фабрика для создания и управления представлениями приложения. Отвечает за инкапсуляцию логики создания View-компонентов из темплейтов, их размещение в модальных окнах или на странице, а также кеширование часто используемых представлений (модальное окно, каталог, шапка).

Конструктор `constructor(events: IEvents, templates: IViewTemplates, galleryContainer: HTMLElement, modalContainer: HTMLElement, headerContainer: HTMLElement, viewConstructors: IViewConstructors)` принимает брокер событий, объект с HTML-шаблонами, корневые DOM-элементы для галереи, модального окна и шапки, а также набор конструкторов представлений.

Поля класса:
`events: IEvents` - приватное поле, хранит ссылку на брокер событий для передачи в создаваемые представления.
`templates: IViewTemplates` - приватное поле, хранит объект с HTML-шаблонами, используемыми для клонирования и создания компонентов.
`catalogue: ProductCatalogueView | null` - приватное поле для кеширования экземпляра представления каталога. Значение null до первого вызова getCatalogue().
`modal: ModalView | null` - приватное поле для кеширования экземпляра модального окна. Значение null до первого вызова getModal().
`header: HeaderView | null` - приватное поле для кеширования экземпляра шапки страницы. Значение null до первого вызова getHeader().
`cartView: CartView | null` - приватное поле для кеширования представления корзины.
`orderForm: OrderFormView | null` - приватное поле для кеширования формы заказа.
`contactsForm: ContactsFormView | null` - приватное поле для кеширования формы контактов.
`successModalView: SuccessModalView | null` - приватное поле для кеширования окна успешного заказа.
`viewConstructors: IViewConstructors` - приватное поле с набором конструкторов для всех представлений.
`catalogueContainer: HTMLElement` - приватное поле, хранит DOM-элемент, в который будет рендериться каталог товаров.
`modalContainer: HTMLElement` - приватное поле, хранит DOM-элемент, который является корневым контейнером для модального окна.
`headerContainer: HTMLElement` - приватное поле, хранит DOM-элемент шапки страницы.

Методы класса:
`getCatalogue(): ProductCatalogueView` возвращает (или создает, если его нет) экземпляр представления каталога.

`getModal(): ModalView` возвращает (или создает) экземпляр модального окна.

`getHeader(): HeaderView` возвращает (или создает) экземпляр шапки страницы.

`getCart(): CartView` возвращает (или создает) экземпляр представления корзины.

`getOrderFormView(): OrderFormView` возвращает (или создает) экземпляр формы заказа.

`getContactsFormView(): ContactsFormView` возвращает (или создает) экземпляр формы контактов.

`getSuccessModalView(): SuccessModalView` возвращает (или создает) экземпляр успешного модального окна.

`updateCatalogue(products: IProduct[]): void` обновляет содержимое каталога, создавая новые карточки CatalogueCardView для каждого переданного товара.

`updateHeaderCounter(count: number): void` обновляет счетчик товаров в корзине в шапке.

`createPreviewCard(product: IProduct, inBasket: boolean): void` создает карточку PreviewCardView для детального просмотра и открывает её в модальном окне.

`createCatalogueCard(product: IProduct): HTMLElement` создает карточку каталога

`createCartCard(product: IProduct, index: number): HTMLElement` создает карточку корзины

`createCart(products: IProduct[], total: number): void` создает представление CartView со списком карточек CartCardView и открывает его в модальном окне.

`createOrderForm(): void` создает форму OrderFormView для ввода адреса и способа оплаты и размещает её в модальном окне.

`createContactsForm(): void` создает форму ContactsFormView для ввода email и телефона и размещает её в модальном окне.

`createSuccessModal(total: number): void` создает представление SuccessModalView с итоговой суммой и открывает его в модальном окне.

`getTemplate(templateName: keyof IViewTemplates): HTMLTemplateElement` получает HTML-шаблон.

`cloneElement(templateName: keyof IViewTemplates): HTMLElement` клонирует элемент из шаблона.

#### Абстрактный класс CardView

Базовый класс для всех карточек товара. Отвечает за отображение общей для всех карточек информации.

Конструктор `constructor(container: HTMLElement, events: IEvents)` принимает DOM-элемент и брокер событий.

Поля класса:
`titleElement: HTMLElement` - DOM-элемент для отображения названия товара
`priceElement: HTMLElement` - DOM-элемент для отображения цены товара
`productPrice: number | null` - приватное поле для хранения текущей `цены

Методы :
`set id(value: string)` и `get id(): string` записывает/считывает идентификатор товара в/из data-id атрибута контейнера.
`set title(value: string)` устанавливает текст названия товара.
`set price(value: number | null)` и `get price(): number | null` устанавливает текст цены товара ("Бесценно", если цена равна null) и запоминает значение.

#### Класс CatalogueCardView

Представление карточки товара для каталога. Расширяет CardView. Добавляет отображение изображения и категории товара, а также обработку клика для выбора товара.

Конструктор `constructor(container: HTMLElement, events: IEvents)` принимает DOM-элемент и брокер событий.

Поля класса:
`imageElement: HTMLImageElement` - элемент изображения
`categoryElement: HTMLElement` - элемент категории
`events: IEvents` - брокер событий

Методы:
`set image(value: string)` устанавливает источник изображения, используя CDN_URL.
`set category(value: string)` устанавливает текст категории и соответствующий CSS-класс из categoryMap.

При клике на контейнер генерируется событие `card:select` с id товара.

#### Класс PreviewCardView

Представление карточки товара для детального просмотра в модальном окне. Расширяет CatalogueCardView. Добавляет описание и кнопку добавления/удаления товара из корзины.

Конструктор `constructor(container: HTMLElement, onPreviewAction: () => void, closeModal: () => void)` принимает DOM-элемент, callback для переключения состояния товара и callback для закрытия модального окна.

Поля класса:
`descriptionElement: HTMLElement` - элемент описания
`buttonElement: HTMLButtonElement` - элемент кнопки

Методы класса:
`set description(value: string)` устанавливает текст описания товара.
`set isProductInBasket(value: boolean)` устанавливает состояние кнопки, в зависимости от того, находится ли товар в корзине. Если true, кнопка меняет текст на "Удалить из корзины". Если false, текст становится "Купить". Кнопка блокируется, если цена товара null.
`set price(value: number | null)` обновляет цену и включает или отключает кнопку в зависимости от доступности товара.
При клике на кнопку вызывается callback `preview:toggle` через фабрику и затем закрывается модальное окно.

#### Класс CartCardView

Представление карточки товара внутри корзины. Расширяет CardView. Добавляет отображение порядкового номера и кнопку удаления.

Конструктор `constructor(container: HTMLElement, events: IEvents)` принимает DOM-элемент и брокер событий.

Поля класс:
`indexElement: HTMLElement` - элемент порядкового номера
`deleteButtonElement: HTMLButtonElement` - кнопка удаления
`events: IEvents` - брокер событий

Методы :
`set index(value: number)` устанавливает порядковый номер товара в корзине.

При клике на кнопку удаления генерируется событие `basket:remove` с id товара.

#### Абстрактный класс FormView

Базовый класс для всех форм в приложении. Управляет отображением ошибок и состоянием кнопки отправки.

Конструктор `constructor(container: HTMLElement, events: IEvents)` принимает DOM-контейнер формы и брокер событий. Подписывается на события submit, input, change для запуска механизма валидации.

Поля класса:
`errorsElement: HTMLElement` - элемент для ошибок
`submitButtonElement: HTMLButtonElement` - кнопка отправки
`events: IEvents` - брокер событий

Абстрактные методы:
`handleSubmit(): void` должен быть реализован для обработки отправки формы.
`getFormData(): T` должен быть реализован для возврата объекта с данными формы.

Методы:
`set valid(value: boolean)` делает кнопку отправки активной/неактивной.
`set errors(value: string)` отображает текст ошибки.
`setValidState(isValid: boolean): void` устанавливает состояние кнопки.
`setValidationErrors(errors: string[]): void` отображает ошибки.

#### Класс OrderFormView

Форма для выбора способа оплаты и ввода адреса доставки.

Конструктор `constructor(container: HTMLElement, events: IEvents)` принимает DOM-контейнер и брокер событий.

Поля класса:
`cardButtonElement: HTMLButtonElement` - кнопка "Онлайн"
`cashButtonElement: HTMLButtonElement` - кнопка "При получении"
`addressInputElement: HTMLInputElement` - поле ввода адреса
`paymentElement: string` - выбранный способ оплаты

Методы:
`set payment(value: string)` устанавливает визуально активную кнопку способа оплаты ("card" или "cash").
`set address(value: string)` устанавливает значение в поле ввода адреса.

Реализация `handleSubmit`: при успешной валидации генерирует событие `order:next` с данными формы.
Реализация `getFormData`: возвращает объект с полями payment и address.
Реализация `validate`: проверяет, заполнены ли поля способа оплаты и адреса.

#### Класс ContactsFormView

Форма для ввода email и телефона пользователя.

Конструктор `constructor(container: HTMLElement, events: IEvents)` принимает DOM-контейнер и брокер событий.

Поля класса:
`emailInputElement: HTMLInputElement`- поле для электронной почты
`phoneInputElement: HTMLInputElement`- поле для телефона

Методы:
`set email(value: string)` устанавливает значение в поле ввода email.
`set phone(value: string)` устанавливает значение в поле ввода телефона.

Реализация `handleSubmit`: при успешной валидации генерирует событие `contacts:submit` с данными формы.
Реализация `getFormData`: возвращает объект с полями email и phone.
Реализация `validate`: проверяет, заполнены ли оба поля.

#### Класс CartView

Представление корзины с товарами. Отображает список товаров, итоговую сумму и кнопку начала оформления заказа.

Конструктор `constructor(container: HTMLElement, events: IEvents)` принимает DOM-контейнер и брокер событий.

Поля класса:
`listElement: HTMLElement` - список товаров
`totalElement: HTMLElement` - общая стоимость
`buttonElement: HTMLButtonElement` - кнопка оформления
`events: IEvents` - брокер событий

Методы:
`set items(items: HTMLElement[])` заполняет список товарами. Если список пуст, отображает сообщение "Корзина пуста" и блокирует кнопку оформления.
`set total(value: number)` отображает итоговую стоимость товаров.

При клике на кнопку оформления генерируется событие `order:start`.

#### Класс HeaderView

Представление шапки сайта. Отображает счетчик товаров в корзине и обрабатывает клик по кнопке корзины.

Конструктор `constructor(container: HTMLElement, events: IEvents)` принимает DOM-контейнер и брокер событий.

Поля класса:
`counterElement: HTMLElement` - элемент счётчика
`basketButtonElement: HTMLButtonElement` - кнопка корзины
`events: IEvents` - брокер событий

Методы:
`set counter(value: number)` обновляет текст счетчика.

При клике на кнопку корзины генерируется событие `basket:open`.

#### Класс ModalView

Представление модального окна. Управляет отображением контента в модальном окне, его открытием и закрытием.

Конструктор `constructor(container: HTMLElement, events: IEvents)` принимает DOM-контейнер и брокер событий.

Поля класса:
`closeButtonElement: HTMLButtonElement` - кнопка закрытия
`contentElement: HTMLElement` - контейнер содержимого
`events: IEvents` - брокер событий

Методы:
`set content(value: HTMLElement)` заменяет содержимое модального окна.
`isOpen(): boolean` проверяет, открыто ли модальное окно.
`getContent(): HTMLElement` возвращает DOM-элемент, в который помещается контент.
`open(): void` открывает модальное окно.
`close(): void` закрывает модальное окно и очищает его содержимое.

При клике на кнопку закрытия или оверлей генерируется событие `modal:close`.

#### Класс ProductCatalogueView

Представление каталога товаров.

Поля класса:
`catalogueElement: HTMLElement` (protected) - контейнер каталога

Методы:
`set catalog(items: HTMLElement[])` заменяет содержимое каталога на новый массив элементов карточек.

#### Класс SuccessModalView

Представление модального окна успешного оформления заказа.

Конструктор `constructor(container: HTMLElement, events: IEvents)` принимает DOM-контейнер и брокер событий.

Поля:
`descriptionElement: HTMLElement` - элемент описания
`closeButtonElement: HTMLButtonElement` - кнопка закрытия
`events: IEvents` - брокер событий

Методы (сеттеры):
`set total(value: number)` отображает сообщение о списанной сумме.

При клике на кнопку закрытия генерируется событие `modal:close`.

### Слой Презентера

#### Класс Presenter

Связывает модели данных с фабрикой представлений через брокер событий. Инициализирует обработчики событий и реализует бизнес-логику приложения.

Конструктор:
`constructor(events: IEvents, viewFactory: IViewFactory, webApi: IWebLarekApi, productCatalogue: IProductCatalogueModel, cart: ICartModel, customer: ICustomerModel)` принимает брокер событий, фабрику представлений, API и модели приложения.

Поля класса:
`viewFactory: IViewFactory` - фабрика представлений
`webApi: IWebLarekApi` - API для запросов
`productCatalogue: IProductCatalogueModel` - модель каталога товаров
`cart: ICartModel` - модель корзины
`customer: ICustomerModel` - модель покупателя

Методы:
`loadCatalogue(): Promise<void>` загружает товары с API и отправляет их в каталог

`initEventHandlers(events: IEvents): void` регистрирует обработчики событий в момент создания Presenter

`handleCatalogueChanged(data: { products: IProduct[] }): void` обновляет список товаров каталога и счётчик корзины

`handleCartChanged(data: { items: IProduct[]; count: number; total: number }): void` обновляет счётчик и содержимое корзины

`handleProductSelected(data: { id: string }): void` выбирает товар и открывает PreviewCard

`handleProductRemovedFromCart(data: { id: string }): void` удаляет товар из корзины

`handlePreviewToggle(): void` переключает выбранный товар в корзине (добавляет или удаляет)

`handleCartOpened(): void` открывает корзину в модальном окне

`handleOrderStart(): void` открывает форму заказа

`handleOrderPaymentChanged(payment: string): void` обновляет способ оплаты в модели и форме, выполняет валидацию

`handleOrderAddressChanged(address: string): void` обновляет адрес доставки в модели и форме, выполняет валидацию

`updateOrderFormValidity(): void` пересчитывает валидность формы заказа

`handleOrderFormSubmit(): void` открывает форму контактов

`handleContactsEmailChanged(email: string): void` обновляет email в модели и форме, выполняет валидацию

`handleContactsPhoneChanged(phone: string): void` обновляет телефон в модели и форме, выполняет валидацию

`updateContactsFormValidity(): void` пересчитывает валидность формы контактов

`submitOrder(): Promise<void>` отправляет заказ на сервер, очищает корзину и данные покупателя, открывает окно успешного заказа

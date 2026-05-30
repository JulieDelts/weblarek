import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { ICartView } from "../../types";

export class CartView extends Component<ICartView> {
  protected listElement: HTMLElement;
  protected totalElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this.listElement = ensureElement<HTMLElement>(
      ".basket__list",
      this.container,
    );
    this.totalElement = ensureElement<HTMLElement>(
      ".basket__price",
      this.container,
    );
    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".basket__button",
      this.container,
    );

    this.buttonElement.addEventListener("click", () => {
      events.emit("order:start");
    });
  }

  set items(items: HTMLElement[]) {
    if (items.length === 0) {
      this.listElement.innerHTML = '<p class="basket__empty">Корзина пуста</p>';
      this.buttonElement.disabled = true;
    } else {
      this.listElement.innerHTML = "";
      items.forEach((item) => {
        this.listElement.appendChild(item);
      });
      this.buttonElement.disabled = false;
    }
  }

  set total(value: number) {
    this.totalElement.textContent = `${value} синапсов`;
  }
}

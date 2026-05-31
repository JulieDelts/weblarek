import { CatalogueCardView } from "./CatalogueCardView";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";

export class PreviewCardView extends CatalogueCardView {
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;
  protected inBasket: boolean = false;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this.descriptionElement = ensureElement<HTMLElement>(
      ".card__text",
      this.container,
    );
    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container,
    );

    this.buttonElement.addEventListener("click", (event) => {
      event.stopPropagation();
      if (this.inBasket) {
        events.emit("preview:remove", { id: this.id });
      } else {
        events.emit("preview:add", { id: this.id });
      }
      events.emit("preview:done");
    });
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set price(value: number | null) {
    super.price = value;
    this.updateButtonState();
  }

  set isProductInBasket(value: boolean) {
    this.inBasket = value;
    this.updateButtonState();
  }

  get isProductInBasket(): boolean {
    return this.inBasket;
  }

  protected updateButtonState(): void {
    if (super.price === null) {
      this.buttonElement.disabled = true;
      this.buttonElement.textContent = "Недоступно";
      return;
    }

    this.buttonElement.disabled = false;

    if (this.isProductInBasket) {
      this.buttonElement.textContent = "Удалить из корзины";
    } else {
      this.buttonElement.textContent = "Купить";
    }
  }
}

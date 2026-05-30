import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";
import { ICardView } from "../../../types";

export abstract class CardView extends Component<ICardView> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;
  private productPrice: number | null = null;

  constructor(container: HTMLElement) {
    super(container);

    this.titleElement = ensureElement<HTMLElement>(
      ".card__title",
      this.container,
    );
    this.priceElement = ensureElement<HTMLElement>(
      ".card__price",
      this.container,
    );
  }

  set id(value: string) {
    this.container.dataset.id = value;
  }

  get id(): string {
    return this.container.dataset.id || "";
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set price(value: number | null) {
    this.productPrice = value;
    if (value === null) {
      this.priceElement.textContent = "Бесценно";
    } else {
      this.priceElement.textContent = `${value} синапсов`;
    }
  }

  get price(): number | null {
    return this.productPrice;
  }
}

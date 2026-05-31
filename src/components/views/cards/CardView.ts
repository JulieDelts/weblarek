import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";
import { ICardView } from "../../../types";

export abstract class CardView extends Component<ICardView> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;

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

  set id(_value: string) {
    // no-op: view does not store model identifiers
  }

  get id(): string {
    return "";
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set price(value: number | null) {
    if (value === null) {
      this.priceElement.textContent = "Бесценно";
    } else {
      this.priceElement.textContent = `${value} синапсов`;
    }
  }

  get price(): number | null {
    return null;
  }
}

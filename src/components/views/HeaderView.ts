import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

interface IHeaderView {
  counter: number;
}

export class HeaderView extends Component<IHeaderView> {
  protected counterElement: HTMLElement;
  protected basketButtonElement: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);
    this.counterElement = ensureElement<HTMLElement>(
      ".header__basket-counter",
      this.container,
    );
    this.basketButtonElement = ensureElement<HTMLButtonElement>(
      ".header__basket",
      this.container,
    );
    this.basketButtonElement.addEventListener("click", () => {
      this.events.emit("basket:open");
    });
  }

  set counter(value: number) {
    this.counterElement.textContent = String(value);
  }
}

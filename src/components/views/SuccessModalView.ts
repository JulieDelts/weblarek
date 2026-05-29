import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

export interface ISuccessModalView {
  total: number;
}

export class SuccessModalView extends Component<ISuccessModalView> {
  protected descriptionElement: HTMLElement;
  protected closeButtonElement: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this.descriptionElement = ensureElement<HTMLElement>(
      ".order-success__description",
      this.container,
    );
    this.closeButtonElement = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      this.container,
    );

    this.closeButtonElement.addEventListener("click", () => {
      events.emit("modal:close");
    });
  }

  set total(value: number) {
    this.descriptionElement.textContent = `Списано ${value} синапсов`;
  }
}

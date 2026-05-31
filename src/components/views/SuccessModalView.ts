import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { ISuccessModalView } from "../../types";

export class SuccessModalView extends Component<ISuccessModalView> {
  protected descriptionElement: HTMLElement;
  protected closeButtonElement: HTMLButtonElement;
  protected closeModal: () => void;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
    closeModal: () => void,
  ) {
    super(container);
    this.closeModal = closeModal;
    this.descriptionElement = ensureElement<HTMLElement>(
      ".order-success__description",
      this.container,
    );
    this.closeButtonElement = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      this.container,
    );

    this.closeButtonElement.addEventListener("click", () => {
      this.closeModal();
    });
  }

  set total(value: number) {
    this.descriptionElement.textContent = `Списано ${value} синапсов`;
  }
}

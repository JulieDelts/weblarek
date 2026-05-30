import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { IModalView } from "../../types";

export class ModalView extends Component<IModalView> {
  protected closeButtonElement: HTMLButtonElement;
  protected contentElement: HTMLElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this.closeButtonElement = ensureElement<HTMLButtonElement>(
      ".modal__close",
      this.container,
    );
    this.contentElement = ensureElement<HTMLElement>(
      ".modal__content",
      this.container,
    );

    this.closeButtonElement.addEventListener("click", () => {
      events.emit("modal:close");
    });

    this.container.addEventListener("click", (event) => {
      if (event.target === this.container) {
        events.emit("modal:close");
      }
    });
  }

  set content(value: HTMLElement) {
    this.contentElement.innerHTML = "";
    this.contentElement.appendChild(value);
  }

  isOpen(): boolean {
    return this.container.classList.contains("modal_active");
  }

  getContent(): HTMLElement {
    return this.contentElement;
  }

  open(): void {
    this.container.classList.add("modal_active");
  }

  close(): void {
    this.container.classList.remove("modal_active");
    this.contentElement.innerHTML = "";
  }
}

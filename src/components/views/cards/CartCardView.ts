import { CardView } from "./CardView";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";

export class CartCardView extends CardView {
  protected indexElement: HTMLElement;
  protected deleteButtonElement: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container,
    );
    this.deleteButtonElement = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      this.container,
    );

    this.deleteButtonElement.addEventListener("click", (event) => {
      event.stopPropagation();
      events.emit("basket:remove", { id: this.id });
    });
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}

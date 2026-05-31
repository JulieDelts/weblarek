import { CardView } from "./CardView";
import { ensureElement } from "../../../utils/utils";

export class CartCardView extends CardView {
  protected indexElement: HTMLElement;
  protected deleteButtonElement: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected onDelete: () => void,
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
      this.onDelete();
    });
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}

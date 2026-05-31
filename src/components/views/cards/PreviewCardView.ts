import { CatalogueCardView } from "./CatalogueCardView";
import { ensureElement } from "../../../utils/utils";

export class PreviewCardView extends CatalogueCardView {
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;
  protected onPreviewAction: () => void;
  protected closeModal: () => void;

  constructor(
    container: HTMLElement,
    onPreviewAction: () => void,
    closeModal: () => void,
  ) {
    super(container, () => {});
    this.onPreviewAction = onPreviewAction;
    this.closeModal = closeModal;
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
      this.onPreviewAction();
      this.closeModal();
    });
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set price(value: number | null) {
    super.price = value;
    if (value === null) {
      this.buttonElement.disabled = true;
      this.buttonElement.textContent = "Недоступно";
      return;
    }

    this.buttonElement.disabled = false;
    this.updateButtonText(
      value,
      this.buttonElement.textContent === "Удалить из корзины",
    );
  }

  set isProductInBasket(value: boolean) {
    if (!this.buttonElement.disabled) {
      this.updateButtonText(null, value);
    }
  }

  protected updateButtonText(
    value: number | null = null,
    inBasket: boolean,
  ): void {
    if (value === null && this.buttonElement.disabled) {
      this.buttonElement.textContent = "Недоступно";
      return;
    }

    this.buttonElement.textContent = inBasket ? "Удалить из корзины" : "Купить";
  }
}

import { CardView } from "./CardView";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { categoryMap, CDN_URL } from "../../../utils/constants";

type CategoryKey = keyof typeof categoryMap;

export class CatalogueCardView extends CardView {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );
    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container,
    );

    if (this.container.classList.contains("gallery__item")) {
      this.container.addEventListener("click", () => {
        events.emit("card:select", { id: this.id });
      });
    }
  }

  set image(value: string) {
    this.setImage(
      this.imageElement,
      `${CDN_URL}/${value}`,
      this.titleElement.textContent || "",
    );
  }

  set category(value: string) {
    this.categoryElement.textContent = value;

    for (const key in categoryMap) {
      this.categoryElement.classList.toggle(
        categoryMap[key as CategoryKey],
        key === value,
      );
    }
  }
}

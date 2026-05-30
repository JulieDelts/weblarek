import { FormView } from "./FormView";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { IOrderFormView } from "../../../types";

export class OrderFormView extends FormView<IOrderFormView> {
  protected cardButtonElement: HTMLButtonElement;
  protected cashButtonElement: HTMLButtonElement;
  protected addressInputElement: HTMLInputElement;
  protected paymentElement: string = "";

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this.cardButtonElement = ensureElement<HTMLButtonElement>(
      'button[name="card"]',
      this.container,
    );
    this.cashButtonElement = ensureElement<HTMLButtonElement>(
      'button[name="cash"]',
      this.container,
    );
    this.addressInputElement = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      this.container,
    );

    this.cardButtonElement.addEventListener("click", () => {
      this.payment = "card";
      this.emitFormChange();
    });

    this.cashButtonElement.addEventListener("click", () => {
      this.payment = "cash";
      this.emitFormChange();
    });

    this.addressInputElement.addEventListener("blur", () => {
      this.emitFormChange();
    });
  }

  set payment(value: string) {
    this.paymentElement = value;

    if (value === "card") {
      this.cardButtonElement.classList.add("button_alt-active");
      this.cashButtonElement.classList.remove("button_alt-active");
    } else {
      this.cashButtonElement.classList.add("button_alt-active");
      this.cardButtonElement.classList.remove("button_alt-active");
    }
  }

  set address(value: string) {
    this.addressInputElement.value = value;
  }

  getFormData(): IOrderFormView {
    return {
      payment: this.paymentElement,
      address: this.addressInputElement.value.trim(),
    };
  }

  protected emitFormChange(): void {
    this.events.emit("order:form:change", this.getFormData());
  }
  protected handleSubmit(): void {
    this.events.emit("order:form:submit", this.getFormData());
  }
}

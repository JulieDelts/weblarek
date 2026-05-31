import { FormView } from "./FormView";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { IOrderFormView } from "../../../types";

export class OrderFormView extends FormView implements IOrderFormView {
  protected cardButtonElement: HTMLButtonElement;
  protected cashButtonElement: HTMLButtonElement;
  protected addressInputElement: HTMLInputElement;

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
      this.emitPaymentFormChange("card");
    });

    this.cashButtonElement.addEventListener("click", () => {
      this.emitPaymentFormChange("cash");
    });

    this.addressInputElement.addEventListener("blur", () => {
      this.emitAddressFormChange(this.addressInputElement.value);
    });
  }

  set payment(value: string) {
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

  protected emitPaymentFormChange(payment: string): void {
    this.events.emit("order:payment:changed", payment);
  }

  protected emitAddressFormChange(address: string): void {
    this.events.emit("order:address:changed", address);
  }

  protected handleSubmit(): void {
    this.events.emit("order:form:submit");
  }
}

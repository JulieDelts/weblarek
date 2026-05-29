import { FormView } from "./FormView";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";

export interface IOrderFormView {
  payment: string;
  address: string;
}

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
    });

    this.cashButtonElement.addEventListener("click", () => {
      this.payment = "cash";
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

    this.validate();
  }

  set address(value: string) {
    this.addressInputElement.value = value;
  }

  protected handleSubmit(): void {
    if (this.validate()) {
      this.events.emit("order:next", this.getFormData());
    }
  }

  getFormData(): IOrderFormView {
    return {
      payment: this.paymentElement,
      address: this.addressInputElement.value.trim(),
    };
  }

  validate(): boolean {
    const address = this.addressInputElement.value.trim();
    const isValid = this.paymentElement !== "" && address !== "";

    if (!this.paymentElement) {
      this.errors = "Выберите способ оплаты";
    } else if (!address) {
      this.errors = "Введите адрес доставки";
    } else {
      this.errors = "";
    }

    this.valid = isValid;
    return isValid;
  }

  reset(): void {
    super.reset();
    this.paymentElement = "";
    this.cardButtonElement.classList.remove("button_alt-active");
    this.cashButtonElement.classList.remove("button_alt-active");
  }
}

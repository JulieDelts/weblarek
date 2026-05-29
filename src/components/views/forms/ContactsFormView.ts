import { FormView } from "./FormView";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";

export interface IContactsFormView {
  email: string;
  phone: string;
}

export class ContactsFormView extends FormView<IContactsFormView> {
  protected emailInputElement: HTMLInputElement;
  protected phoneInputElement: HTMLInputElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this.emailInputElement = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      this.container,
    );
    this.phoneInputElement = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      this.container,
    );
  }

  set email(value: string) {
    this.emailInputElement.value = value;
  }

  set phone(value: string) {
    this.phoneInputElement.value = value;
  }

  protected handleSubmit(): void {
    if (this.validate()) {
      this.events.emit("contacts:submit", this.getFormData());
    }
  }

  getFormData(): IContactsFormView {
    return {
      email: this.emailInputElement.value.trim(),
      phone: this.phoneInputElement.value.trim(),
    };
  }

  validate(): boolean {
    const email = this.emailInputElement.value.trim();
    const phone = this.phoneInputElement.value.trim();
    const isValid = email !== "" && phone !== "";

    if (!email && !phone) {
      this.errors = "Заполните email и телефон";
    } else if (!email) {
      this.errors = "Укажите email";
    } else if (!phone) {
      this.errors = "Укажите телефон";
    } else {
      this.errors = "";
    }

    this.valid = isValid;
    return isValid;
  }
}

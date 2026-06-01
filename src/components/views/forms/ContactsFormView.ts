import { FormView } from "./FormView";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { IContactsFormView } from "../../../types";

export class ContactsFormView extends FormView implements IContactsFormView {
  protected emailInputElement: HTMLInputElement;
  protected phoneInputElement: HTMLInputElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);
    this.setValidState(false);

    this.emailInputElement = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      this.container,
    );
    this.phoneInputElement = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      this.container,
    );

    this.emailInputElement.addEventListener("blur", () => {
      this.emitEmailFormChange(this.emailInputElement.value);
    });

    this.phoneInputElement.addEventListener("blur", () => {
      this.emitPhoneFormChange(this.phoneInputElement.value);
    });
  }

  set email(value: string) {
    this.emailInputElement.value = value;
  }

  set phone(value: string) {
    this.phoneInputElement.value = value;
  }

  protected emitEmailFormChange(email: string): void {
    this.events.emit("contacts:email:changed", email);
  }

  protected emitPhoneFormChange(phone: string): void {
    this.events.emit("contacts:phone:changed", phone);
  }

  protected handleSubmit(): void {
    this.events.emit("contacts:form:submit");
  }
}

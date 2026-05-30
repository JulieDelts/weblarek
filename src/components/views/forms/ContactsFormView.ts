import { FormView } from "./FormView";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { IContactsFormView } from "../../../types";

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

    this.emailInputElement.addEventListener("blur", () => {
      this.emitFormChange();
    });

    this.phoneInputElement.addEventListener("blur", () => {
      this.emitFormChange();
    });
  }

  set email(value: string) {
    this.emailInputElement.value = value;
  }

  set phone(value: string) {
    this.phoneInputElement.value = value;
  }

  getFormData(): IContactsFormView {
    return {
      email: this.emailInputElement.value.trim(),
      phone: this.phoneInputElement.value.trim(),
    };
  }

  protected emitFormChange(): void {
    this.events.emit("contacts:form:change", this.getFormData());
  }

  protected handleSubmit(): void {
    this.events.emit("contacts:form:submit", this.getFormData());
  }
}

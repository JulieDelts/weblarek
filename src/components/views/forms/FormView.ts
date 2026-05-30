import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { IFormView } from "../../../types";

export abstract class FormView<T> extends Component<IFormView> {
  protected errorsElement: HTMLElement;
  protected submitButtonElement: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this.errorsElement = ensureElement<HTMLElement>(
      ".form__errors",
      this.container,
    );
    this.submitButtonElement = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      this.container,
    );

    this.container.addEventListener("submit", (event: Event) => {
      event.preventDefault();
      this.handleSubmit();
    });
  }

  protected abstract getFormData(): T;
  protected abstract handleSubmit(): void;

  set valid(value: boolean) {
    this.submitButtonElement.disabled = !value;
  }

  set errors(value: string) {
    this.errorsElement.textContent = value;
  }

  setValidState(isValid: boolean): void {
    this.valid = isValid;
  }

  setValidationErrors(errors: string[]): void {
    this.errors = errors.join("; ");
  }
}

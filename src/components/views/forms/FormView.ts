import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";

export interface IFormStateView {
  valid: boolean;
  errors: string;
}

export abstract class FormView<T> extends Component<IFormStateView> {
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

    this.container.addEventListener("input", () => {
      this.validate();
    });

    this.container.addEventListener("change", () => {
      this.validate();
    });
  }

  protected abstract handleSubmit(): void;
  public abstract validate(): boolean;
  public abstract getFormData(): T;

  set valid(value: boolean) {
    this.submitButtonElement.disabled = !value;
  }

  set errors(value: string) {
    this.errorsElement.textContent = value;
  }

  public reset(): void {
    const form = this.container as HTMLFormElement;
    form.reset();
    this.errors = "";
    this.valid = false;
  }

  render(data?: Partial<IFormStateView>): HTMLElement {
    if (data) {
      Object.assign(this as object, data);
    }
    return this.container;
  }
}

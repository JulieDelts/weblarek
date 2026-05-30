import { ICustomer, PaymentMethod } from "../../types/index";

export class Customer {
  private customer: ICustomer = {
    payment: "",
    address: "",
    email: "",
    phone: "",
  };

  constructor() {}

  getData(): ICustomer {
    return this.customer;
  }

  setPayment(payment: PaymentMethod): void {
    this.customer.payment = payment;
  }

  setAddress(address: string): void {
    this.customer.address = address;
  }

  setEmail(email: string): void {
    this.customer.email = email;
  }

  setPhone(phone: string): void {
    this.customer.phone = phone;
  }

  clearData(): void {
    this.customer = {
      payment: "",
      address: "",
      email: "",
      phone: "",
    };
  }

  validateOrderData(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    const paymentValidation = this.validatePayment();
    if (!paymentValidation.isValid) errors.push(paymentValidation.error!);

    const addressValidation = this.validateAddress();
    if (!addressValidation.isValid) errors.push(addressValidation.error!);

    const result = { isValid: errors.length === 0, errors };
    return result;
  }

  validateContactsData(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    const emailValidation = this.validateEmail();
    if (!emailValidation.isValid) errors.push(emailValidation.error!);

    const phoneValidation = this.validatePhone();
    if (!phoneValidation.isValid) errors.push(phoneValidation.error!);

    const result = { isValid: errors.length === 0, errors };
    return result;
  }

  private validatePayment(): { isValid: boolean; error?: string } {
    if (!this.customer.payment) {
      return { isValid: false, error: "Не указан способ оплаты" };
    }
    return { isValid: true };
  }

  private validateAddress(): { isValid: boolean; error?: string } {
    if (!this.customer.address) {
      return { isValid: false, error: "Не указан адрес доставки" };
    }
    return { isValid: true };
  }

  private validateEmail(): { isValid: boolean; error?: string } {
    if (!this.customer.email) {
      return { isValid: false, error: "Не указана электронная почта" };
    }
    return { isValid: true };
  }

  private validatePhone(): { isValid: boolean; error?: string } {
    if (!this.customer.phone) {
      return { isValid: false, error: "Не указан телефон" };
    }
    return { isValid: true };
  }
}

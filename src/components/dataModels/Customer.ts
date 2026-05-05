import { ICustomer, PaymentMethod } from "../../types/index";

export class Customer {
  private customer: ICustomer = {
    payment: "",
    address: "",
    email: "",
    phone: "",
  };

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

  validateEmail(): { isValid: boolean; error?: string } {
    if (!this.customer.email) {
      return { isValid: false, error: "Электронная почта не задана." };
    }
    return { isValid: true };
  }

  validatePhone(): { isValid: boolean; error?: string } {
    if (!this.customer.phone) {
      return { isValid: false, error: "Телефон не задан." };
    }
    return { isValid: true };
  }

  validateAddress(): {
    isValid: boolean;
    error?: string;
  } {
    if (!this.customer.address) {
      return { isValid: false, error: "Адрес не задан." };
    }
    return { isValid: true };
  }
}

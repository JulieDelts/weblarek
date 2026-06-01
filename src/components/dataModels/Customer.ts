import { ICustomer, ICustomerModel, PaymentMethod } from "../../types/index";
import { IEvents } from "../base/Events";

export class Customer implements ICustomerModel {
  private customer: ICustomer = {
    payment: "",
    address: "",
    email: "",
    phone: "",
  };

  constructor(private events: IEvents) {}

  getData(): ICustomer {
    return this.customer;
  }

  setPayment(payment: PaymentMethod): void {
    this.customer.payment = payment;
    this.events.emit("customer:payment-changed", payment);
  }

  setAddress(address: string): void {
    this.customer.address = address;
    this.events.emit("customer:address-changed", address);
  }

  setEmail(email: string): void {
    this.customer.email = email;
    this.events.emit("customer:email-changed", email);
  }

  setPhone(phone: string): void {
    this.customer.phone = phone;
    this.events.emit("customer:phone-changed", phone);
  }

  clearData(): void {
    this.customer = {
      payment: "",
      address: "",
      email: "",
      phone: "",
    };
  }

  validatePayment(): { isValid: boolean; error?: string } {
    if (!this.customer.payment) {
      return { isValid: false, error: "Не указан способ оплаты" };
    }
    return { isValid: true };
  }

  validateAddress(): { isValid: boolean; error?: string } {
    if (!this.customer.address || this.customer.address.trim() === "") {
      return { isValid: false, error: "Не указан адрес доставки" };
    }
    return { isValid: true };
  }

  validateEmail(): { isValid: boolean; error?: string } {
    if (!this.customer.email || this.customer.email.trim() === "") {
      return { isValid: false, error: "Не указана электронная почта" };
    }
    return { isValid: true };
  }

  validatePhone(): { isValid: boolean; error?: string } {
    if (!this.customer.phone || this.customer.phone.trim() === "") {
      return { isValid: false, error: "Не указан телефон" };
    }
    return { isValid: true };
  }
}

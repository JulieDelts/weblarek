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
}

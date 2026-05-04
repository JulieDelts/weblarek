import { ICustomer, PaymentMethod } from "../../types/index";

export class Customer {
  private customer: ICustomer = {};

  constructor(customer?: ICustomer) {
    this.customer = customer ? { ...customer } : {};
  }

  getData(): { data: ICustomer } {
    return {
      data: { ...this.customer },
    };
  }

  setPayment(payment: PaymentMethod): {
    success: boolean;
    error?: string;
  } {
    if (!payment) {
      return { success: false, error: "Способ оплаты не выбран" };
    }

    this.customer.payment = payment;
    return { success: true };
  }

  setAddress(address: string): { success: boolean; error?: string } {
    const validation = this.validateAddress(address);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error,
      };
    }

    this.customer.address = address;
    return { success: true };
  }

  setEmail(email: string): { success: boolean; error?: string } {
    const validation = this.validateEmail(email);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }
    this.customer.email = email;
    return { success: true };
  }

  setPhone(phone: string): { success: boolean; error?: string } {
    const validation = this.validatePhone(phone);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }
    this.customer.phone = phone;
    return { success: true };
  }

  clearData(): void {
    this.customer = {};
  }

  private validateEmail(email: string): { isValid: boolean; error?: string } {
    if (!email || email.trim() === "") {
      return { isValid: false, error: "Электронная почта не задана." };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, error: "Неверный формат электронной почты." };
    }
    return { isValid: true };
  }

  private validatePhone(phone: string): { isValid: boolean; error?: string } {
    if (!phone || phone.trim() === "") {
      return { isValid: false, error: "Телефон не задан." };
    }
    const phoneRegex = /^[\+][0-9]{1,4}[0-9]{5,11}$/;
    if (!phoneRegex.test(phone)) {
      return { isValid: false, error: "Неверный формат телефона." };
    }
    return { isValid: true };
  }

  private validateAddress(address: string): {
    isValid: boolean;
    error?: string;
  } {
    if (!address || address.trim() === "") {
      return { isValid: false, error: "Адрес не задан." };
    }
    if (address.trim().length <= 5) {
      return {
        isValid: false,
        error: "Длина адреса должна быть больше 10 символов",
      };
    }
    return { isValid: true };
  }
}

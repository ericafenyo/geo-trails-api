import { isEmail } from "class-validator";

// TODO: Delete this and replace  name with `user`.

export class EmailAddressManager {
  #email: string;

  private constructor(email: string) {
    this.#email = email;
  }

  static getInstance(email): EmailAddressManager {
    return new EmailAddressManager(email);
  }

  hasValidEmail(): boolean {
    return isEmail(this.#email);
  }

  getUsername(): string {
    return this.#email.split("@")[0] || "";
  }
}

import { Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private service: AuthService) {}

  /**
   * Returns tokens for the authenticated user.
   */
  @Post("login")
  async login() {
    // Handle login logic
  }

  async register() {
    // Handle registration logic
  }
}

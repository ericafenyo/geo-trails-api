import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Resource } from "@/types/resource";
import { Tokens } from "./tokens";

@Controller("auth")
export class AuthController {
  constructor(private service: AuthService) {}

  /**
   * Returns tokens for the authenticated user.
   */
  @Post("login")
  async login(@Body() request: { email: string; password: string }): Promise<Resource<Tokens>> {
    const tokens = await this.service.getToken({
      id: "user-id-placeholder", // Replace with actual user ID retrieval logic
      email: request.email,
    });
    return Resource.create({
      type: "tokens",
      attributes: tokens,
    });
  }

  async register() {
    // Handle registration logic
  }
}

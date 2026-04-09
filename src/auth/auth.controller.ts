import { Body, Controller, Post, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Resource } from "@/types/resource";
import { Tokens } from "./tokens";

@Controller({
  path: "auth",
  version: "1",
})
export class AuthController {
  constructor(private service: AuthService) {}

  /**
   * Returns tokens for the authenticated user.
   */
  @Post("login")
  async login(@Body() request: { email: string; password: string }): Promise<Resource<Tokens>> {
    throw new UnauthorizedException("Password login is disabled. Use /v1/auth/otp/start.");
  }

  @Post("otp/start")
  async startOtp(@Body() request: { email: string }): Promise<Resource<{ request_id: string; expires_in: number }>> {
    const challenge = await this.service.startOtpLogin(request.email);

    return Resource.create({
      type: "otp_challenge",
      attributes: challenge,
    });
  }

  @Post("otp/verify")
  async verifyOtp(@Body() request: { email: string; request_id: string; code: string }): Promise<Resource<Tokens>> {
    const tokens = await this.service.verifyOtpLogin(request);

    return Resource.create({
      type: "tokens",
      attributes: tokens,
    });
  }

  async register() {
    // Handle registration logic
  }
}

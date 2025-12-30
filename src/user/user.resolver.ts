import { UseGuards } from "@nestjs/common";

import { UserService } from "./user.service";
import { User } from "./user.entity";

export class UserResolver {
  constructor(private userService: UserService) {}

  async getUser(): Promise<void> {}

  async createUser(): Promise<User> {
    return null;
  }
}

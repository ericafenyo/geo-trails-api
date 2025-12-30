import { Body, Controller, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { UnregisteredUser } from "./user.types";

@Controller("users")
export class UserController {
  constructor(
    private userService: UserService,
  ) {}

  @Post()
  async create(@Body() user: UnregisteredUser) {
    return await this.userService.create(user);
  }
}

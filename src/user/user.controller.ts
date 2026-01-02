import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { UnregisteredUser } from "./user.types";
import { CurrentUser } from "@/auth/auth.decorator";

@Controller({
  path: "users",
  version: "1",
})
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post()
  async createUser(@Body() user: UnregisteredUser) {
    return await this.service.create(user);
  }

  @Get("me")
  getAuthenticatedUser(@CurrentUser("id") id: string) {
    return this.service.findById(id);
  }

  @Get(":id")
  getUserById(@Param("id") id: string) {
    return this.service.findById(id);
  }

  @Patch(":id")
  updateUser(@Param("id") id: string, @Body() updateUserDto: any) {
    return this.service.update(id, updateUserDto);
  }

  @Delete(":id")
  deleteUser(@Param("id") id: string) {
    return this.service.remove(id);
  }
}

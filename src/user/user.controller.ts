import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { Resource } from "@/types/resource";
import { UserService } from "./user.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CurrentUser } from "@/auth/auth.decorator";
import { JwtAuthGuard } from "@/auth/auth.guard";

function toUserProfile(user: any) {
  return {
    uuid: user.uuid,
    first_name: user.firstName || "",
    last_name: user.lastName || "",
    email: user.email || "",
    bio: user.bio || "",
    avatar_url: user.avatarUrl || "",
    weight: user.weight || 0,
    created_at: user.createdAt ? user.createdAt.toISOString() : null,
    updated_at: user.updatedAt ? user.updatedAt.toISOString() : null,
  };
}

@ApiTags("users")
@Controller({
  path: "users",
  version: "1",
})
export class UserController {
  constructor(private readonly service: UserService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: "Get the authenticated user's profile" })
  @ApiOkResponse({ description: "Authenticated user wrapped in a resource payload" })
  @ApiUnauthorizedResponse({ description: "Missing or invalid bearer token" })
  @UseGuards(JwtAuthGuard)
  @Get("me")
  async getAuthenticatedUser(@CurrentUser("sub") sub: string) {
    const user = await this.service.findOrCreateByAccountId(sub);
    return Resource.create({
      id: sub,
      type: "user",
      attributes: toUserProfile(user),
    });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Get aggregated adventure stats for the authenticated user" })
  @ApiOkResponse({ description: "User stats wrapped in a resource payload" })
  @ApiUnauthorizedResponse({ description: "Missing or invalid bearer token" })
  @UseGuards(JwtAuthGuard)
  @Get("me/stats")
  async getStats(@CurrentUser("sub") sub: string) {
    const stats = await this.service.getStats(sub);
    return Resource.create({
      id: sub,
      type: "user_stats",
      attributes: stats,
    });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Get a user by account id" })
  @ApiParam({ name: "id", description: "Account identifier", example: "auth0|abc123" })
  @ApiOkResponse({ description: "User wrapped in a resource payload" })
  @ApiForbiddenResponse({ description: "Cannot access another user's record" })
  @ApiUnauthorizedResponse({ description: "Missing or invalid bearer token" })
  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async getUserById(@Param("id") id: string, @CurrentUser("sub") sub: string) {
    this.assertMatchingSubject(id, sub);

    const user = await this.service.findByAccountId(id);
    return Resource.create({
      id,
      type: "user",
      attributes: toUserProfile(user),
    });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Update the authenticated user's profile" })
  @ApiParam({ name: "id", description: "Account identifier", example: "auth0|abc123" })
  @ApiOkResponse({ description: "Updated user profile wrapped in a resource payload" })
  @ApiBadRequestResponse({ description: "Validation failure" })
  @ApiForbiddenResponse({ description: "Cannot update another user's profile" })
  @ApiUnauthorizedResponse({ description: "Missing or invalid bearer token" })
  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  async updateUser(
    @Param("id") id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser("sub") sub: string,
  ) {
    this.assertMatchingSubject(id, sub);

    const user = await this.service.update(id, dto);
    return Resource.create({
      id,
      type: "user",
      attributes: toUserProfile(user),
    });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete a user record by account id" })
  @ApiParam({ name: "id", description: "Account identifier", example: "auth0|abc123" })
  @ApiOkResponse({ description: "User deletion accepted" })
  @ApiForbiddenResponse({ description: "Cannot access another user's record" })
  @ApiUnauthorizedResponse({ description: "Missing or invalid bearer token" })
  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async deleteUser(@Param("id") id: string, @CurrentUser("sub") sub: string) {
    this.assertMatchingSubject(id, sub);
    return this.service.remove(id);
  }

  private assertMatchingSubject(id: string, sub: string) {
    if (id !== sub) {
      throw new ForbiddenException("Cannot access another user's record");
    }
  }
}

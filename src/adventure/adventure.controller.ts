import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { Resource, PaginatedResource } from "@/types/resource";
import { AdventureService } from "./adventure.service";
import { CreateAdventureDto } from "./dto/create-adventure.dto";
import { UpdateAdventureDto } from "./dto/update-adventure.dto";
import { CurrentUser } from "@/auth/auth.decorator";
import { JwtAuthGuard } from "@/auth/auth.guard";

@ApiTags("adventures")
@Controller({
  path: "adventures",
  version: "1",
})
export class AdventureController {
  constructor(private readonly service: AdventureService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: "Batch-create adventures synced from Android" })
  @ApiUnauthorizedResponse({ description: "Missing or invalid bearer token" })
  @UseGuards(JwtAuthGuard)
  @Post()
  async createAdventures(
    @Body() inputs: CreateAdventureDto[],
    @CurrentUser("sub") sub: string,
  ) {
    const result = await this.service.createAdventures(sub, inputs);
    return Resource.create({
      id: "batch",
      type: "adventure_batch",
      attributes: result,
    });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "List authenticated user's adventures" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiOkResponse({ description: "Paginated adventures" })
  @ApiUnauthorizedResponse({ description: "Missing or invalid bearer token" })
  @UseGuards(JwtAuthGuard)
  @Get()
  async listAdventures(
    @CurrentUser("sub") sub: string,
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ) {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

    const { adventures, total } = await this.service.findByOwner(
      sub,
      pageNum,
      limitNum,
    );

    const data = adventures.map((adventure) => ({
      id: adventure.uuid,
      type: "adventure",
      attributes: {
        uuid: adventure.uuid,
        title: adventure.title,
        description: adventure.description,
        altitude: adventure.altitude,
        calories: adventure.calories,
        distance: adventure.distance,
        duration: adventure.duration,
        speed: adventure.speed,
        transport_mode: adventure.transportMode,
        polyline: adventure.polyline,
        image: adventure.image,
        start_time: adventure.startTime
          ? adventure.startTime.toISOString()
          : null,
        end_time: adventure.endTime ? adventure.endTime.toISOString() : null,
        created_at: adventure.createdAt
          ? adventure.createdAt.toISOString()
          : null,
      },
    }));

    return PaginatedResource.create(data, {
      total,
      page: pageNum,
      limit: limitNum,
    });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Get a single adventure by UUID" })
  @ApiParam({ name: "id", description: "Adventure UUID" })
  @ApiOkResponse({ description: "Adventure detail" })
  @ApiNotFoundResponse({ description: "Adventure not found" })
  @ApiForbiddenResponse({ description: "Adventure belongs to another user" })
  @ApiUnauthorizedResponse({ description: "Missing or invalid bearer token" })
  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async getAdventure(
    @Param("id") id: string,
    @CurrentUser("sub") sub: string,
  ) {
    const adventure = await this.service.findByUuid(id);
    if (!adventure) {
      throw new NotFoundException("Adventure not found");
    }
    if (adventure.ownerId !== sub) {
      throw new ForbiddenException("Adventure belongs to another user");
    }

    return Resource.create({
      id: adventure.uuid,
      type: "adventure",
      attributes: {
        uuid: adventure.uuid,
        title: adventure.title,
        description: adventure.description,
        altitude: adventure.altitude,
        calories: adventure.calories,
        distance: adventure.distance,
        duration: adventure.duration,
        speed: adventure.speed,
        transport_mode: adventure.transportMode,
        polyline: adventure.polyline,
        image: adventure.image,
        start_time: adventure.startTime
          ? adventure.startTime.toISOString()
          : null,
        end_time: adventure.endTime ? adventure.endTime.toISOString() : null,
        created_at: adventure.createdAt
          ? adventure.createdAt.toISOString()
          : null,
        updated_at: adventure.updatedAt
          ? adventure.updatedAt.toISOString()
          : null,
        locations: (adventure.locations || []).map((loc) => ({
          latitude: loc.latitude,
          longitude: loc.longitude,
          altitude: loc.altitude,
          time: loc.time,
          speed: loc.speed,
          accuracy: loc.accuracy,
          bearing: loc.bearing,
        })),
      },
    });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Update mutable fields of an adventure" })
  @ApiParam({ name: "id", description: "Adventure UUID" })
  @ApiOkResponse({ description: "Updated adventure detail" })
  @ApiBadRequestResponse({ description: "Validation failure or empty body" })
  @ApiNotFoundResponse({ description: "Adventure not found" })
  @ApiForbiddenResponse({ description: "Adventure belongs to another user" })
  @ApiUnauthorizedResponse({ description: "Missing or invalid bearer token" })
  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  async updateAdventure(
    @Param("id") id: string,
    @Body() dto: UpdateAdventureDto,
    @CurrentUser("sub") sub: string,
  ) {
    const existing = await this.service.findByUuid(id);
    if (!existing) {
      throw new NotFoundException("Adventure not found");
    }
    if (existing.ownerId !== sub) {
      throw new ForbiddenException("Adventure belongs to another user");
    }

    if (!dto || Object.keys(dto).length === 0) {
      throw new BadRequestException("Request body must not be empty");
    }

    const adventure = await this.service.update(id, dto);

    return Resource.create({
      id: adventure.uuid,
      type: "adventure",
      attributes: {
        uuid: adventure.uuid,
        title: adventure.title,
        description: adventure.description,
        altitude: adventure.altitude,
        calories: adventure.calories,
        distance: adventure.distance,
        duration: adventure.duration,
        speed: adventure.speed,
        transport_mode: adventure.transportMode,
        polyline: adventure.polyline,
        image: adventure.image,
        start_time: adventure.startTime
          ? adventure.startTime.toISOString()
          : null,
        end_time: adventure.endTime ? adventure.endTime.toISOString() : null,
        created_at: adventure.createdAt
          ? adventure.createdAt.toISOString()
          : null,
        updated_at: adventure.updatedAt
          ? adventure.updatedAt.toISOString()
          : null,
        locations: (adventure.locations || []).map((loc) => ({
          latitude: loc.latitude,
          longitude: loc.longitude,
          altitude: loc.altitude,
          time: loc.time,
          speed: loc.speed,
          accuracy: loc.accuracy,
          bearing: loc.bearing,
        })),
      },
    });
  }
}

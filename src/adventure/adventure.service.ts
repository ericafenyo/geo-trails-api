import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Adventure, AdventureDocument } from "./adventure.schema";
import { CreateAdventureDto } from "./dto/create-adventure.dto";
import { UpdateAdventureDto } from "./dto/update-adventure.dto";

@Injectable()
export class AdventureService {
  constructor(
    @InjectModel(Adventure.name)
    private readonly model: Model<AdventureDocument>,
  ) {}

  async createAdventures(
    ownerId: string,
    inputs: CreateAdventureDto[],
  ): Promise<{ created: number; duplicates: number }> {
    let created = 0;
    let duplicates = 0;

    for (const input of inputs) {
      const existing = await this.model.findOne({ uuid: input.uuid }).exec();
      if (existing) {
        duplicates++;
        continue;
      }

      await this.model.create({
        uuid: input.uuid,
        title: input.title,
        description: input.description,
        altitude: input.altitude,
        calories: input.calories,
        distance: input.distance,
        duration: input.duration,
        startTime: new Date(input.start_time),
        endTime: new Date(input.end_time),
        speed: input.speed,
        transportMode: input.transport_mode,
        polyline: input.polyline,
        image: input.image,
        ownerId,
        locations: (input.locations || []).map((loc) => ({
          latitude: loc.latitude,
          longitude: loc.longitude,
          altitude: loc.altitude,
          time: loc.time,
          speed: loc.speed,
          accuracy: loc.accuracy,
          bearing: loc.bearing,
          timezone: loc.timezone,
          writeTime: loc.write_time,
        })),
      });

      created++;
    }

    return { created, duplicates };
  }

  async findByOwner(
    ownerId: string,
    page: number,
    limit: number,
  ): Promise<{ adventures: Adventure[]; total: number }> {
    const skip = (page - 1) * limit;

    const [adventures, total] = await Promise.all([
      this.model
        .find({ ownerId })
        .select("-locations")
        .sort({ startTime: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.model.countDocuments({ ownerId }).exec(),
    ]);

    return { adventures, total };
  }

  async findByUuid(uuid: string): Promise<Adventure | null> {
    return this.model.findOne({ uuid }).exec();
  }

  async update(
    uuid: string,
    dto: UpdateAdventureDto,
  ): Promise<Adventure> {
    const updateData: Record<string, unknown> = {};

    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.image !== undefined) updateData.image = dto.image;
    if (dto.transport_mode !== undefined)
      updateData.transportMode = dto.transport_mode;

    return this.model
      .findOneAndUpdate({ uuid }, updateData, { new: true })
      .exec();
  }
}

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./user.schema";
import { UpdateUserDto } from "./dto/update-user.dto";
import {
  Adventure,
  AdventureDocument,
} from "@/adventure/adventure.schema";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly model: Model<UserDocument>,
    @InjectModel(Adventure.name)
    private readonly adventureModel: Model<AdventureDocument>,
  ) {}

  async findByAccountId(accountId: string): Promise<User | null> {
    return this.model.findOne({ accountId }).exec();
  }

  async findOrCreateByAccountId(accountId: string): Promise<User> {
    const existing = await this.model.findOne({ accountId }).exec();
    if (existing) return existing;

    return this.model.create({ accountId });
  }

  async update(accountId: string, dto: UpdateUserDto): Promise<User | null> {
    const updateData: Record<string, unknown> = {};

    if (dto.first_name !== undefined) updateData.firstName = dto.first_name;
    if (dto.last_name !== undefined) updateData.lastName = dto.last_name;
    if (dto.bio !== undefined) updateData.bio = dto.bio;
    if (dto.avatar_url !== undefined) updateData.avatarUrl = dto.avatar_url;
    if (dto.weight !== undefined) updateData.weight = dto.weight;

    return this.model
      .findOneAndUpdate({ accountId }, updateData, { new: true })
      .exec();
  }

  async remove(accountId: string): Promise<void> {
    await this.model.deleteOne({ accountId }).exec();
  }

  async getStats(accountId: string): Promise<Record<string, unknown>> {
    const adventures = await this.adventureModel
      .find({ ownerId: accountId })
      .select(
        "distance duration calories speed transportMode",
      )
      .exec();

    const totalAdventures = adventures.length;
    let totalDistance = 0;
    let totalDuration = 0;
    let totalCalories = 0;
    let longestDistance = 0;
    let longestDuration = 0;
    let weightedSpeedSum = 0;
    const transportModeCounts: Record<string, number> = {};

    for (const adv of adventures) {
      totalDistance += adv.distance || 0;
      totalDuration += adv.duration || 0;
      totalCalories += adv.calories || 0;

      if ((adv.distance || 0) > longestDistance) {
        longestDistance = adv.distance || 0;
      }
      if ((adv.duration || 0) > longestDuration) {
        longestDuration = adv.duration || 0;
      }

      weightedSpeedSum += (adv.speed || 0) * (adv.duration || 0);

      const mode = adv.transportMode || "STILL";
      transportModeCounts[mode] = (transportModeCounts[mode] || 0) + 1;
    }

    const averageSpeed =
      totalDuration > 0 ? weightedSpeedSum / totalDuration : 0;

    return {
      total_adventures: totalAdventures,
      total_distance: totalDistance,
      total_duration: totalDuration,
      total_calories: totalCalories,
      longest_distance: longestDistance,
      longest_duration: longestDuration,
      average_speed: averageSpeed,
      transport_mode_counts: transportModeCounts,
    };
  }
}

import { Injectable } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { Adventure } from "./adventure.entity";
import { Location } from "./location.entity";
import { AdventureInput, LocationInput } from "./adventure.types";
import { Polyline } from "src/util/polyline";

@Injectable()
export class AdventureService {
  constructor(private userService: UserService) {}

  private repository: any = {};
  private locationRepository: any = {};

  async getAdventures() {
    return this.repository
      .createQueryBuilder("adventure")
      .leftJoinAndSelect("adventure.locations", "locations")
      .getMany();
  }

  async find(): Promise<Adventure[]> {
    return await this.repository.find();
  }

  async findById(id: string): Promise<Adventure> {
    return await this.repository.findOneBy({ uuid: id });
  }

  async createAdventures(userId: string, inputs: AdventureInput[]): Promise<Adventure[]> {
    const adventures = [];
    inputs.forEach(async input => {
      const locations: Location[] = await this.saveLocations(input.locations);
      const adventure = await this.saveAdventure(input, locations);
      adventures.push(adventure);
    });

    return adventures;
  }

  private async saveAdventure(
    adventure: AdventureInput,
    locations: Location[],
  ): Promise<Adventure> {
    const polyline = Polyline.encode(locations);

    const entity = this.repository.create({
      uuid: adventure.uuid,
      title: adventure.title,
      description: adventure.description,
      energy: adventure.energy,
      distance: adventure.distance,
      duration: adventure.duration,
      startTime: adventure.startTime,
      endTime: adventure.endTime,
      speed: adventure.speed,
      polyline: polyline,
      locations: locations,
    });

    return await this.repository.save(entity);
  }

  private async saveLocations(locations: LocationInput[]): Promise<Location[]> {
    const entities = locations.map(location => this.toLocationEntity(location));
    return await this.locationRepository.save(entities);
  }

  private toLocationEntity(location: LocationInput): Location {
    return this.locationRepository.create({
      latitude: location.latitude,
      longitude: location.longitude,
      altitude: location.altitude,
      time: location.time,
      speed: location.speed,
      accuracy: location.accuracy,
      bearing: location.bearing,
    });
  }
}

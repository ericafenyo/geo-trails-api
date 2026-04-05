import { Adventure } from "./adventure.entity";
import { Speed } from "./adventure.types";

export class Location {
  id: number;
  uuid: string;
  latitude: number;
  longitude: number;
  altitude: number;
  time: number;
  speed: Speed;
  accuracy: number;
  bearing: number;
  createdAt: Date;
  updatedAt: Date;
  adventure: Adventure;
}

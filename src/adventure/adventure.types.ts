

export enum DistanceUnit {
  METERS = "METERS",
  KILOMETERS = "KILOMETERS",
  MILES = "MILES",
}


export class Distance {
  value: number;
  type: DistanceUnit;
}

export class DistanceInput {
  value: number;
  type: DistanceUnit;
}

export enum EnergyUnit {
  CALORIES = "CALORIES",
  KILOCALORIES = "KILOCALORIES",
  JOULES = "JOULES",
  KILOJOULES = "KILOJOULES",
}



export class Energy {
  value: number;
  type: EnergyUnit;
}


export class EnergyInput {
  value: number;
  type: EnergyUnit;
}

export enum SpeedUnit {
  METERS_PER_SECOND = "METERS_PER_SECOND",
  KILOMETERS_PER_HOUR = "KILOMETERS_PER_HOUR",
  MILES_PER_HOUR = "MILES_PER_HOUR",
}

export class Speed {
  value: number;
  type: SpeedUnit;
}

export class SpeedInput {
  value: number;
  type: SpeedUnit;
}

export class Location {
  latitude: number;
  longitude: number;
  altitude: number;
  time: number;
  speed: Speed;
  accuracy: number;
  bearing: number;
}


export class Adventure {
  uuid: string;
  title: string;
  description: string;
  energy: Energy;
  distance: Distance;
  duration: number;
  startTime: Date;
  endTime: Date;
  speed: Speed;
  polyline: string;
  locations: Location[];
  createdAt: Date;
  updatedAt: Date;
}


export class LocationInput {
  writeTime: number;
  timezone: string;
  latitude: number;
  longitude: number;
  altitude: number;
  time: number;
  speed: SpeedInput;
  accuracy: number;
  bearing: number;
}

export class AdventureInput {
  uuid: string;
  title: string;
  description: string;
  altitude: number;
  energy: EnergyInput;
  distance: DistanceInput;
  duration: number;
  startTime: Date;
  endTime: Date;
  speed: SpeedInput;
  polyline: string;
  image: String;
  locations: LocationInput[];
}

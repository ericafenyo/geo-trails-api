import { ApiProperty } from "@nestjs/swagger";
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

const TRANSPORT_MODES = [
  "STILL",
  "WALK",
  "BIKE",
  "CAR",
  "BUS",
  "METRO",
  "TRAIN",
] as const;

export class LocationInputDto {
  @ApiProperty()
  @IsNumber()
  latitude: number;

  @ApiProperty()
  @IsNumber()
  longitude: number;

  @ApiProperty()
  @IsNumber()
  altitude: number;

  @ApiProperty({ description: "Unix timestamp in milliseconds" })
  @IsNumber()
  time: number;

  @ApiProperty({ description: "Speed in m/s" })
  @IsNumber()
  speed: number;

  @ApiProperty({ description: "GPS accuracy in meters" })
  @IsNumber()
  accuracy: number;

  @ApiProperty({ description: "Bearing in degrees" })
  @IsNumber()
  bearing: number;

  @ApiProperty({ description: "IANA timezone" })
  @IsString()
  timezone: string;

  @ApiProperty({ description: "Timestamp when reading was persisted locally" })
  @IsNumber()
  write_time: number;
}

export class CreateAdventureDto {
  @ApiProperty()
  @IsString()
  uuid: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ description: "Max altitude in meters" })
  @IsNumber()
  altitude: number;

  @ApiProperty({ description: "Estimated calories burned" })
  @IsNumber()
  calories: number;

  @ApiProperty({ description: "Distance in meters" })
  @IsNumber()
  distance: number;

  @ApiProperty({ description: "Duration in seconds" })
  @IsNumber()
  duration: number;

  @ApiProperty({ description: "ISO 8601 start time" })
  @IsString()
  start_time: string;

  @ApiProperty({ description: "ISO 8601 end time" })
  @IsString()
  end_time: string;

  @ApiProperty({ description: "Average speed in m/s" })
  @IsNumber()
  speed: number;

  @ApiProperty({ enum: TRANSPORT_MODES })
  @IsEnum(TRANSPORT_MODES)
  transport_mode: string;

  @ApiProperty({ description: "Encoded polyline string" })
  @IsString()
  polyline: string;

  @ApiProperty({ description: "Image URI or empty string" })
  @IsString()
  image: string;

  @ApiProperty({ type: [LocationInputDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LocationInputDto)
  locations: LocationInputDto[];
}

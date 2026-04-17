import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";

const TRANSPORT_MODES = [
  "STILL",
  "WALK",
  "BIKE",
  "CAR",
  "BUS",
  "METRO",
  "TRAIN",
] as const;

export class UpdateAdventureDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ required: false, enum: TRANSPORT_MODES })
  @IsOptional()
  @IsEnum(TRANSPORT_MODES)
  transport_mode?: string;
}

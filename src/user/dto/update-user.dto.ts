import { ApiProperty } from "@nestjs/swagger";
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from "class-validator";

export class UpdateUserDto {
  @ApiProperty({ required: false, maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  first_name?: string;

  @ApiProperty({ required: false, maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  last_name?: string;

  @ApiProperty({ required: false, maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  avatar_url?: string;

  @ApiProperty({ required: false, description: "Weight in kilograms" })
  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number;
}

import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Adventure, AdventureSchema } from "./adventure.schema";
import { AdventureService } from "./adventure.service";
import { AdventureController } from "./adventure.controller";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Adventure.name, schema: AdventureSchema },
    ]),
  ],
  providers: [AdventureService],
  controllers: [AdventureController],
  exports: [AdventureService],
})
export class AdventureModule {}

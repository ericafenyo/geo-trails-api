import { Module } from "@nestjs/common";
import { UserModule } from "src/user/user.module";
import { AdventureResolver } from "./adventure.resolver";

import { AdventureService } from "./adventure.service";
import { Adventure } from "./adventure.entity";
import { Location } from "./location.entity";

@Module({
  imports: [UserModule],
  providers: [AdventureService, AdventureResolver],
})
export class AdventureModule {}

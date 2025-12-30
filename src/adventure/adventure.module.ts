import { Module } from "@nestjs/common";
import { UserModule } from "@/user/user.module";
import { AdventureService } from "./adventure.service";

@Module({
  imports: [UserModule],
  providers: [AdventureService],
})
export class AdventureModule {}

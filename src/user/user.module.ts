import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema, User } from "./user.schema";
import { Adventure, AdventureSchema } from "@/adventure/adventure.schema";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Adventure.name, schema: AdventureSchema },
    ]),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}

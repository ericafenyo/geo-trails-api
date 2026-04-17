import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import { UserModule } from "./user/user.module";
import { AdventureModule } from "./adventure/adventure.module";
import { AuthModule } from "./auth/auth.module";
import { PhotoModule } from "./photo/photo.module";

require("dotenv").config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL),
    UserModule,
    AdventureModule,
    AuthModule,
    PhotoModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

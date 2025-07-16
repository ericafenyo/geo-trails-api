import { Module } from "@nestjs/common";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { GraphQLModule } from "@nestjs/graphql";
import { join } from "path";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import { UserModule } from "./user/user.module";
import { CredentialModule } from "./credential/credential.module";
import { AdventureModule } from "./adventure/adventure.module";
import { AuthModule } from "./auth/auth.module";
import { OtpModule } from "./otp/otp.module";
import { UploadModule } from "./upload/upload.module";
import { MailModule } from "./mail/mail.module";
import { PhotoModule } from "./photo/photo.module";

require("dotenv").config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
      introspection: true,
      driver: ApolloDriver,
      playground: true,
    }),
    UserModule,
    AdventureModule,
    AuthModule,
    CredentialModule,
    MailModule,
    OtpModule,
    UploadModule,
    PhotoModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MailModule } from "@/mail/mail.module";
import { CredentialModule } from "@/credential/credential.module";
import { UserSchema, User } from "./user.schema";
import { OtpModule } from "@/otp/otp.module";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CredentialModule,
    MailModule,
    OtpModule,
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}

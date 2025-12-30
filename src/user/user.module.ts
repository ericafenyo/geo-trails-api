import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MailModule } from "../mail/mail.module";
import { CredentialModule } from "../credential/credential.module";
import { UserResolver } from "./user.resolver";
import { UserSchema } from "./user.schema";
import { UserService } from "./user.service";
import { OtpModule } from "@/otp/otp.module";
import { UserController } from "./user.controller";
import { USER_MODEL } from "@/constants/model-names";
import { UserRepository } from "./user.repository";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: USER_MODEL, schema: UserSchema }]), 
    CredentialModule,
    MailModule,
    OtpModule,
  ],
  providers: [UserService, UserRepository],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}

import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MailModule } from "../mail/mail.module";
import { CredentialModule } from "../credential/credential.module";
import { UserResolver } from "./user.resolver";
import { User } from "./user.entity";
import { UserService } from "./user.service";
import { OtpModule } from "src/otp/otp.module";

@Module({
  imports: [CredentialModule, MailModule, OtpModule],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}

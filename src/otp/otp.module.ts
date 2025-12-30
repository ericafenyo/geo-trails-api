import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OtpService } from './otp.service';
import { OPT, OtpSchema } from './otp.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: OPT.name, schema: OtpSchema }])],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}

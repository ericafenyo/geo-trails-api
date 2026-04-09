import { Injectable, UnauthorizedException } from '@nestjs/common';
import { randomInt, randomUUID, createHash, timingSafeEqual } from 'crypto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OPT, UseType } from './otp.schema';

export interface CreateOtpChallenge {
  requestId: string;
  expiresIn: number;
  code: string;
}

export interface VerifyOtpChallenge {
  email: string;
  requestId: string;
  code: string;
}

@Injectable()
export class OtpService {
  constructor(@InjectModel(OPT.name) private model: Model<OPT>) {}

  private readonly accountVerificationExpiresIn = 600;

  async createAccountVerificationChallenge(email: string): Promise<CreateOtpChallenge> {
    const requestId = randomUUID();
    const code = randomInt(0, 1000000).toString().padStart(6, '0');
    const expiry = Date.now() + this.accountVerificationExpiresIn * 1000;

    await this.model.create({
      email: email.trim().toLowerCase(),
      token: this.hashCode(email, requestId, code),
      expiry,
      isVerified: false,
      requestId,
      type: UseType.ACCOUNT_VERIFICATION,
    });

    return {
      requestId,
      expiresIn: this.accountVerificationExpiresIn,
      code,
    };
  }

  async verifyAccountVerificationChallenge(args: VerifyOtpChallenge): Promise<void> {
    const challenge = await this.model
      .findOne({
        email: args.email.trim().toLowerCase(),
        requestId: args.requestId,
        type: UseType.ACCOUNT_VERIFICATION,
        isVerified: false,
      })
      .exec();

    if (!challenge || challenge.expiry <= Date.now()) {
      throw new UnauthorizedException('Invalid or expired one-time code');
    }

    const expected = Buffer.from(challenge.token, 'utf8');
    const actual = Buffer.from(this.hashCode(args.email, args.requestId, args.code), 'utf8');

    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
      throw new UnauthorizedException('Invalid or expired one-time code');
    }

    challenge.isVerified = true;
    await challenge.save();
  }

  async findByEmail(email: string) {
    return await this.model.findOne({ email: email.trim().toLowerCase() }).exec();
  }

  private hashCode(email: string, requestId: string, code: string): string {
    return createHash('sha256')
      .update(`${email.trim().toLowerCase()}:${requestId}:${code}`)
      .digest('hex');
  }
}

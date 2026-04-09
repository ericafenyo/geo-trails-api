import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { AuthService } from '../auth.service';
import { RefreshToken } from '../refresh-token.schema';
import { UserService } from '@/user/user.service';
import { OtpService } from '@/otp/otp.service';
import { MailService } from '@/mail/mail.service';

describe('AuthService', () => {
  let service: AuthService;

  const refreshTokenModel = jest.fn();
  const userService = {
    validate: jest.fn(),
    findByEmail: jest.fn(),
    findOrCreateActivatedByEmail: jest.fn(),
  };
  const otpService = {
    createAccountVerificationChallenge: jest.fn(),
    verifyAccountVerificationChallenge: jest.fn(),
  };
  const mailService = {
    sendAccountVerificationCode: jest.fn(),
  };
  const jwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(RefreshToken.name),
          useValue: refreshTokenModel,
        },
        {
          provide: UserService,
          useValue: userService,
        },
        {
          provide: OtpService,
          useValue: otpService,
        },
        {
          provide: MailService,
          useValue: mailService,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    otpService.createAccountVerificationChallenge.mockReset();
    otpService.verifyAccountVerificationChallenge.mockReset();
    mailService.sendAccountVerificationCode.mockReset();
    userService.findOrCreateActivatedByEmail.mockReset();
    jwtService.sign.mockReset();
  });

  it('otp/start stores challenge and returns request_id/expires_in', async () => {
    otpService.createAccountVerificationChallenge.mockResolvedValue({
      requestId: 'request-1',
      expiresIn: 600,
      code: '123456',
    });
    mailService.sendAccountVerificationCode.mockResolvedValue(undefined);

    const result = await service.startOtpLogin('user@example.com');

    expect(otpService.createAccountVerificationChallenge).toHaveBeenCalledWith('user@example.com');
    expect(mailService.sendAccountVerificationCode).toHaveBeenCalledWith('user@example.com', {
      code: '123456',
    });
    expect(result).toEqual({ request_id: 'request-1', expires_in: 600 });
  });

  it('otp/verify with valid code returns tokens', async () => {
    otpService.verifyAccountVerificationChallenge.mockResolvedValue(undefined);
    userService.findOrCreateActivatedByEmail.mockResolvedValue({
      uuid: 'user-uuid-1',
      email: 'user@example.com',
    });
    jest.spyOn(service, 'getToken').mockResolvedValue({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      expiresIn: 86400,
    });

    const result = await service.verifyOtpLogin({
      email: 'user@example.com',
      request_id: 'request-1',
      code: '123456',
    });

    expect(otpService.verifyAccountVerificationChallenge).toHaveBeenCalledWith({
      email: 'user@example.com',
      requestId: 'request-1',
      code: '123456',
    });
    expect(userService.findOrCreateActivatedByEmail).toHaveBeenCalledWith('user@example.com');
    expect(result).toEqual({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      expiresIn: 86400,
    });
  });

  it('otp/verify rejects invalid or expired code', async () => {
    otpService.verifyAccountVerificationChallenge.mockRejectedValue(
      new UnauthorizedException('Invalid or expired one-time code'),
    );

    await expect(
      service.verifyOtpLogin({
        email: 'user@example.com',
        request_id: 'request-1',
        code: '999999',
      }),
    ).rejects.toThrow(UnauthorizedException);

    expect(userService.findOrCreateActivatedByEmail).not.toHaveBeenCalled();
  });

  it('getToken returns access, refresh, and expiresIn', async () => {
    jest.spyOn(service, 'generateAccessToken').mockResolvedValue('access-token');
    jest.spyOn(service, 'generateRefreshToken').mockResolvedValue('refresh-token');

    const result = await service.getToken({ id: 'user-uuid-1', email: 'user@example.com' });

    expect(result.accessToken).toBe('access-token');
    expect(result.refreshToken).toBe('refresh-token');
    expect(result.expiresIn).toBe(86400);
  });
});

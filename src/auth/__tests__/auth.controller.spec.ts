import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  const authService = {
    startOtpLogin: jest.fn(),
    verifyOtpLogin: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService.startOtpLogin.mockReset();
    authService.verifyOtpLogin.mockReset();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('returns otp challenge resource on otp/start', async () => {
    authService.startOtpLogin.mockResolvedValue({
      request_id: 'req-123',
      expires_in: 600,
    });

    const result = await controller.startOtp({ email: 'user@example.com' });

    expect(authService.startOtpLogin).toHaveBeenCalledWith('user@example.com');
    expect(result.data.type).toBe('otp_challenge');
    expect(result.data.attributes).toEqual({ request_id: 'req-123', expires_in: 600 });
  });

  it('returns tokens resource on otp/verify', async () => {
    authService.verifyOtpLogin.mockResolvedValue({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      expiresIn: 86400,
    });

    const result = await controller.verifyOtp({
      email: 'user@example.com',
      request_id: 'req-123',
      code: '123456',
    });

    expect(authService.verifyOtpLogin).toHaveBeenCalledWith({
      email: 'user@example.com',
      request_id: 'req-123',
      code: '123456',
    });
    expect(result.data.type).toBe('tokens');
    expect(result.data.attributes).toEqual({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      expiresIn: 86400,
    });
  });

  it('rejects password login', async () => {
    await expect(controller.login({ email: 'user@example.com', password: 'password' })).rejects.toThrow(
      UnauthorizedException,
    );
  });
});

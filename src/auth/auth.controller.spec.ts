/// <reference types="jest" />

import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { LoginInteractor } from "./application/interactors/login.interactor";
import { RefreshInteractor } from "./application/interactors/refresh.interactor";
import { RevokeInteractor } from "./application/interactors/revoke.interactor";
import { GetUserInfoInteractor } from "./application/interactors/get-user-info.interactor";
import { Resource } from "@/types/resource";

describe("AuthController", () => {
  let controller: AuthController;
  let loginInteractor: { execute: jest.Mock };
  let refreshInteractor: { execute: jest.Mock };
  let revokeInteractor: { execute: jest.Mock };
  let getUserInfoInteractor: { execute: jest.Mock };

  beforeEach(async () => {
    loginInteractor = { execute: jest.fn() };
    refreshInteractor = { execute: jest.fn() };
    revokeInteractor = { execute: jest.fn() };
    getUserInfoInteractor = { execute: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: LoginInteractor, useValue: loginInteractor },
        { provide: RefreshInteractor, useValue: refreshInteractor },
        { provide: RevokeInteractor, useValue: revokeInteractor },
        { provide: GetUserInfoInteractor, useValue: getUserInfoInteractor },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("login delegates to LoginInteractor and returns Resource<AuthTokens>", async () => {
    const tokens = {
      accessToken: "access-token",
      refreshToken: "refresh-token",
      idToken: "id-token",
    };
    loginInteractor.execute.mockResolvedValue(tokens);

    const result = await controller.login({ email: "test@example.com", password: "password" });

    expect(loginInteractor.execute).toHaveBeenCalledWith("test@example.com", "password");
    expect(result).toEqual(
      Resource.create({
        id: "current",
        type: "tokens",
        attributes: tokens,
      }),
    );
  });

  it("refresh delegates to RefreshInteractor and returns Resource<AuthTokens>", async () => {
    const tokens = {
      accessToken: "new-access-token",
      refreshToken: "new-refresh-token",
      idToken: "new-id-token",
    };
    refreshInteractor.execute.mockResolvedValue(tokens);

    expect(typeof (controller as any).refresh).toBe("function");

    const result = await (controller as any).refresh({ refreshToken: "refresh-token" });

    expect(refreshInteractor.execute).toHaveBeenCalledWith("refresh-token");
    expect(result).toEqual(
      Resource.create({
        id: "current",
        type: "tokens",
        attributes: tokens,
      }),
    );
  });

  it("revoke delegates to RevokeInteractor and returns explicit revoked=true attribute", async () => {
    revokeInteractor.execute.mockResolvedValue(undefined);

    expect(typeof (controller as any).revoke).toBe("function");

    const result = await (controller as any).revoke({ refreshToken: "refresh-token" });

    expect(revokeInteractor.execute).toHaveBeenCalledWith("refresh-token");
    expect(result).toEqual(
      Resource.create({
        id: "current",
        type: "revoke",
        attributes: { revoked: true },
      }),
    );
  });

  it("me delegates to GetUserInfoInteractor using bearer token and returns Resource<UserInfo>", async () => {
    const info = {
      id: "auth0|user-123",
      email: "test@example.com",
      nickname: "testuser",
      firstName: "Test",
      lastName: "User",
    };
    getUserInfoInteractor.execute.mockResolvedValue(info);

    expect(typeof (controller as any).me).toBe("function");

    const result = await (controller as any).me("Bearer access-token");

    expect(getUserInfoInteractor.execute).toHaveBeenCalledWith("access-token");
    expect(result).toEqual(
      Resource.create({
        id: "current",
        type: "user_info",
        attributes: info,
      }),
    );
  });
});

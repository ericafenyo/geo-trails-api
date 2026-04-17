/// <reference types="jest" />

jest.mock("@/auth/auth.decorator", () => ({
  CurrentUser: () => () => undefined,
}), { virtual: true });

jest.mock("@/auth/auth.guard", () => ({
  JwtAuthGuard: class JwtAuthGuard {},
}), { virtual: true });

import { ForbiddenException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "../user.controller";
import { UserService } from "../user.service";
import { Resource } from "../../types/resource";

describe("UserController", () => {
  let controller: UserController;
  let service: {
    findOrCreateByAccountId: jest.Mock;
    findByAccountId: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      findOrCreateByAccountId: jest.fn(),
      findByAccountId: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("getAuthenticatedUser returns a Resource-wrapped payload", async () => {
    const user = { accountId: "subject-1", username: "ada" };
    service.findOrCreateByAccountId.mockResolvedValue(user);

    const result = await controller.getAuthenticatedUser("subject-1");

    expect(service.findOrCreateByAccountId).toHaveBeenCalledWith("subject-1");
    expect(result).toEqual(
      Resource.create({
        id: "subject-1",
        type: "user",
        attributes: user,
      }),
    );
  });

  it("getUserById throws ForbiddenException when the route id does not match the authenticated subject", async () => {
    service.findByAccountId.mockResolvedValue({ accountId: "route-subject", username: "ada" });

    await expect(
      (controller as any).getUserById("route-subject", "different-subject"),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it("updateUser throws ForbiddenException when the route id does not match the authenticated subject", async () => {
    service.update.mockResolvedValue({ accountId: "route-subject", username: "ada" });

    await expect(
      (controller as any).updateUser("route-subject", { username: "grace" }, "different-subject"),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it("deleteUser throws ForbiddenException when the route id does not match the authenticated subject", async () => {
    service.remove.mockResolvedValue(undefined);

    await expect(
      (controller as any).deleteUser("route-subject", "different-subject"),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it("getUserById returns a Resource-wrapped payload for a matching subject", async () => {
    const user = { accountId: "subject-1", username: "ada" };
    service.findByAccountId.mockResolvedValue(user);

    const result = await (controller as any).getUserById("subject-1", "subject-1");

    expect(service.findByAccountId).toHaveBeenCalledWith("subject-1");
    expect(result).toEqual(
      Resource.create({
        id: "subject-1",
        type: "user",
        attributes: user,
      }),
    );
  });
});

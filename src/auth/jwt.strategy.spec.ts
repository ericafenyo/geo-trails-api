/// <reference types="jest" />

jest.mock("jwks-rsa", () => ({
  passportJwtSecret: jest.fn(() => jest.fn()),
}));

import { JwtStrategy } from "./jwt.strategy";

describe("JwtStrategy", () => {
  it("validate returns authenticated user shape with sub only (no email)", () => {
    const strategy = new JwtStrategy();

    const result = strategy.validate({ sub: "auth0|abc123" });

    expect(result).toEqual({ sub: "auth0|abc123" });
    expect(result).not.toHaveProperty("email");
  });
});

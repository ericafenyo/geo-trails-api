import { UserSchema } from "./user.schema";

describe("UserSchema", () => {
  it("defines uuid as required and unique", () => {
    const uuidPath = UserSchema.path("uuid");

    expect(uuidPath).toBeDefined();
    expect((uuidPath as any).options.required).toBe(true);
    expect((uuidPath as any).options.unique).toBe(true);
    expect(typeof (uuidPath as any).options.default).toBe("function");
  });
});

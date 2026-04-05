import { ApiProperty } from "@nestjs/swagger";

export class User {
  id: string;
  email: string;
  username: string;
}

export class UnregisteredUser {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

export enum Status {
  ACTIVE = "active",
  SUSPENDED = "suspended",
  DELETED = "deleted",
}

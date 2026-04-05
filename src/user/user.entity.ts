export class User {
  id: number;
  uuid: string;
  email: string;
  username: string;
  avatar: string;
  activated: boolean;
  activationCode: string;
  activatedAt: Date;
  passwordResetCode: string;
  lastLogin: Date;
  currentLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}

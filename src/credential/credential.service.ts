import { Injectable, NotFoundException } from "@nestjs/common";
import bcrypt = require("bcrypt");
import { User } from "src/user/user.entity";
import { errors } from "src/errors";
import { Credential } from "./credential.entity";

@Injectable()
export class CredentialService {
  constructor() {}

  private userRepository: any = {};

  private credentialRepository: any = {};

  async save(email: string, password: string): Promise<void> {
    const hashedPassword = await this.hash(password);

    // Retrieve the user from the database.
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException(errors.user.accountNotFound);
    }

    // Save the credentials
    const credentials = this.credentialRepository.create();
    credentials.user = user;
    credentials.password = hashedPassword;

    await this.credentialRepository.save(credentials);
  }

  async validate(user: User, candidate: string): Promise<boolean> {
    const credentials = await this.credentialRepository
      .createQueryBuilder("credentials")
      .where("user_id=:userId", { userId: user.id })
      .getOne();

    if (!credentials) {
      return false;
    }

    return await this.isValid(candidate, credentials.password);
  }

  /**
   * Returns true if the {@link candidate} password matches the hashed one.
   *
   * @param candidate the password to be verified
   * @param hashed the existing password hash
   */
  private async isValid(candidate: string, hashed: string): Promise<boolean> {
    return await bcrypt.compare(candidate, hashed);
  }

  private async hash(password: string) {
    const saltRounds = 14;
    return await bcrypt.hash(password, saltRounds);
  }

  private async findUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOneBy({ email });
  }
}

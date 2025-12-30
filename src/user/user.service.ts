import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { User } from "./user.schema";
import { CredentialService } from "../credential/credential.service";
import { MailService } from "../mail/mail.service";
import { UnregisteredUser } from "./user.types";
import { EmailAddressManager } from "@/util/email-address-manager";
import { UserIdentity } from "@/auth/auth.types";
import { Resource } from "@/types/resource";
import { ResourceIdentifier } from "@/types/resource";
import { InjectModel } from "@nestjs/mongoose";
import { USER_MODEL } from "@/constants/model-names";
import { Model } from "mongoose";
import { Repository } from "@/repository";
import { UserRepository } from "./user.repository";

const crypto = require("crypto");

@Injectable()
export class UserService {
  constructor(
    private readonly credentialService: CredentialService,
    private readonly mailService: MailService,
    private readonly repository: UserRepository,
  ) {}

  /**
   * Add a user to the database.
   *
   * @param user an object containing the user's information
   */
  async create(user: UnregisteredUser): Promise<ResourceIdentifier> {
    // const model = new this.model(user);
    const userModel = {
      email: user.email,
      uuid: crypto.randomUUID(),
      avatar: "",
      username: "",
      code: this.generateCode(),
    };

    const document = await this.repository.create(userModel);

    return {
      id: document._id.toString(),
      type: "user",
    };

    // const emailManager = EmailAddressManager.getInstance(user.email);
    // // Checks if th email address is valid
    // if (!emailManager.hasValidEmail()) {
    //   throw new BadRequestException(errors.validation.invalidEmail);
    // }
    // Throw error if the user already exists
    // const userExists = await this.getExistsByEmail(args.email);
    // if (userExists) {
    //   throw new ConflictException(errors.user.alreadyCreated);
    // }
    // const maxRowId = await this.repository.maximum("id");
    // const username = emailManager.getUsername() + (maxRowId + 1);
    // // Create a new user entity
    // const entity = this.repository.create();
    // entity.email = args.email;
    // entity.username = username;
    // const user: any = await this.repository.save(entity);
    // // Save the user credentials
    // await this.credentialService.save(args.email, args.password);
    // user.user = "";
    // return user;
    // Check if the user has an any opt verification
    // const currentOpt = await this.optService.findByEmail(email);
    // if (currentOpt) {
    //   // User has at least one otp verification
    //   //Get access to one in progress
    // }
    // this.mailService.sendAccountVerificationCode(email, {});
    // Validate the email
    // const secret = speakeasy.generateSecret();
    // var token = speakeasy.totp({
    //   secret: secret.base32,
    //   encoding: 'base32',
    // });
    // var tokenValidates = speakeasy.totp.verify({
    //   secret: secret.base32,
    //   encoding: 'base32',
    //   token: token,
    // });
    // Save and return the user information
    // const userinfo = new this.repository.create();
    // const savedUser = await this.userModel.create({ ...user, uuid: uuid() });
    // await this.credentialService.save(savedUser.id, user.password);
    // return savedUser;
    // return userinfo;
  }

  async findById(id: string, validate: boolean = true): Promise<User> {
    // const user = await this.repository.findOne({ uuid: id });

    // if (validate) {
    //   if (!user) {
    //     throw new NotFoundException(errors.user.accountNotFound);
    //   }
    // }

    return null;
  }

  /**
   * Find a user using the provided {@link email}
   *
   * @param email the user's email address
   * @param validate if true, throw error if the user does not exist
   */
  async findByEmail(email: string, validate = true): Promise<User> {
    // const user = await this.repository.findOne();
    // if (validate && !user) {
    //   throw new NotFoundException(errors.user.accountNotFound);
    // }
    return null;
  }

  // /**
  //  * Add a user to the database.
  //  *
  //  * @param args an object containing the user's information
  //  */
  // async createUser(args: CreateUserInput): Promise<User> {
  //   const emailManager = EmailAddressManager.getInstance(args.email);

  //   // Checks if th email address is valid
  //   if (!emailManager.hasValidEmail()) {
  //     throw new BadRequestException(errors.validation.invalidEmail);
  //   }

  //   // Throw error if the user already exists
  //   const userExists = await this.getExistsByEmail(args.email);
  //   if (userExists) {
  //     throw new ConflictException(errors.user.alreadyCreated);
  //   }

  //   const maxRowId = await this.repository.maximum("id");

  //   const username = emailManager.getUsername() + (maxRowId + 1);

  //   // Create a new user entity
  //   const entity = this.repository.create();
  //   entity.email = args.email;
  //   entity.username = username;

  //   const user: any = await this.repository.save(entity);

  //   // Save the user credentials
  //   await this.credentialService.save(args.email, args.password);

  //   user.user = "";

  //   return user;

  //   // Check if the user has an any opt verification
  //   // const currentOpt = await this.optService.findByEmail(email);

  //   // if (currentOpt) {
  //   //   // User has at least one otp verification
  //   //   //Get access to one in progress
  //   // }

  //   // this.mailService.sendAccountVerificationCode(email, {});
  //   // Validate the email

  //   // const secret = speakeasy.generateSecret();

  //   // var token = speakeasy.totp({
  //   //   secret: secret.base32,
  //   //   encoding: 'base32',
  //   // });

  //   // var tokenValidates = speakeasy.totp.verify({
  //   //   secret: secret.base32,
  //   //   encoding: 'base32',
  //   //   token: token,
  //   // });

  //   // Save and return the user information

  //   // const userinfo = new this.repository.create();

  //   // const savedUser = await this.userModel.create({ ...user, uuid: uuid() });
  //   // await this.credentialService.save(savedUser.id, user.password);
  //   // return savedUser;

  //   // return userinfo;
  // }

  /**
   * Find a user using the provided {@link email}
   *
   * @param email the user's email address
   * @param validate if true, throw error if the user does not exist
   */
  private async getExistsByEmail(email: string): Promise<boolean> {
    return false;
    // return await this.repository.exist({ where: { email } });
  }

  /**
   * Returns a user from the database.
   *
   * @param args the users information
   */
  async getUser(args: UserIdentity): Promise<User> {
    return await this.findByEmail(args.email);
  }

  async validate(email: string, password: string): Promise<UserIdentity | null> {
    // const user = await this.findByEmail(email);

    // const isValid = await this.credentialService.validate(user, password);

    // return isValid ? { id: user.uuid, email: email } : null;

    return null;
  }

  private generateCode() {
    const hash = crypto.createHash("sha256").update(crypto.randomUUID()).digest("hex");
    const short = hash.slice(0, 8);
    return short.toUpperCase();
  }
}

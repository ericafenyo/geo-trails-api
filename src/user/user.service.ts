import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import crypto from "crypto";

import { User, UserDocument } from "./user.schema";
import { CredentialService } from "@/credential/credential.service";
import { MailService } from "@/mail/mail.service";
import { UnregisteredUser } from "./user.types";
import { UserIdentity } from "@/auth/auth.types";
import { ResourceIdentifier } from "@/types/resource";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly model: Model<UserDocument>,
    private readonly credentialService: CredentialService,
    private readonly mailService: MailService,
  ) {}

  remove(id: string) {
    throw new Error("Method not implemented.");
  }

  update(id: string, updateUserDto: any) {
    throw new Error("Method not implemented.");
  }


  /**
   * Add a user to the database.
   *
   * @param user an object containing the user's information
   */
  async create(user: UnregisteredUser): Promise<ResourceIdentifier> {
    const model = {
      email: user.email.trim().toLowerCase(),
      uuid: crypto.randomUUID(),
      code: this.generateCode(),
    };

    const document = new this.model(model);

    await document.save();

    await this.mailService.sendAccountVerificationCode(user.email, { code: document.code });


    return { id: document.uuid };
    // return await document.save();

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
    const user = await this.model.findOne({ uuid: id }).exec();

    if (validate && !user) {
      throw new NotFoundException(errors.user.accountNotFound);
    }

    return user;
  }

  /**
   * Find a user using the provided {@link email}
   *
   * @param email the user's email address
   * @param validate if true, throw error if the user does not exist
   */
  async findByEmail(email: string, validate = true): Promise<User> {
    const user = await this.model.findOne({ email: email.trim().toLowerCase() }).exec();
    if (validate && !user) {
      throw new NotFoundException(errors.user.accountNotFound);
    }
    return user;
  }

  async findOrCreateActivatedByEmail(email: string): Promise<User> {
    const normalizedEmail = email.trim().toLowerCase();
    let user = await this.findByEmail(normalizedEmail, false);

    if (!user) {
      const created = await this.model.create({
        email: normalizedEmail,
        uuid: crypto.randomUUID(),
        code: this.generateCode(),
        activated: true,
      });
      return created;
    }

    if (!user.activated) {
      user.activated = true;
      await user.save();
    }

    return user;
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
    const user = await this.findByEmail(email, false);
    if (!user) {
      return null;
    }

    try {
      const isValid = await this.credentialService.validate(user as any, password);
      return isValid ? { id: user.uuid, email: user.email } : null;
    } catch {
      return null;
    }
  }

  private generateCode() {
    const hash = crypto.createHash("sha256").update(crypto.randomUUID()).digest("hex");
    const short = hash.slice(0, 8);
    return short.toUpperCase();
  }
}

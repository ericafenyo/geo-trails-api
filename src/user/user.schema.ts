import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Status } from "./user.types";
import { HydratedDocument } from "mongoose";

/**
 * A database schema representing an entity who interacts with the application.
 */
@Schema({ timestamps: true })
export class User {
  /**
   * A secondary identifier for the user.
   */
  @Prop({required: true, unique: true})
  uuid: string;

  /**
   * A code associated with the user for look-up purposes.
   */
  @Prop({required: true, unique: true})
  code: string;

  /**
   * The email address of the user.
   */
  @Prop({required: true, unique: true})
  email: string;

  /**
   * The username of the user.
   */
  @Prop({ unique: true, sparse: true })
  username?: string;

  @Prop({default: ""})
  firstName: string;

  @Prop({default: ""})
  lastName: string;

  @Prop({enum: Status,required: true, default: Status.ACTIVE})
  status: Status;

  @Prop({required: true, default: false})
  activated: boolean;

  /**
   * The URL pointing to the avatar image of the user.
   */
  @Prop({default: ""})
  avatar: string;
}

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

/**
 * A database schema representing an entity who interacts with the application.
 */
@Schema({ timestamps: true })
export class User {
  /**
   * A secondary identifier for the user.
   */
  @Prop()
  uuid: string;

  /**
   * A code associated with the user for look-up purposes.
   */
  @Prop()
  code: string;

  /**
   * The email address of the user.
   */
  @Prop()
  email: string;

  /**
   * The username of the user.
   */
  @Prop()
  username: string;

  /**
   * The URL pointing to the avatar image of the user.
   */
  @Prop()
  avatar: string;
}

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);

// UserSchema.virtual("uid").get(function (this: User) {
//   return this.uuid;
// });

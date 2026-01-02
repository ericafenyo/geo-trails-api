import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types, HydratedDocument } from "mongoose";
import { User } from "@/user/user.entity";

/**
 *  An object that defines the structure of user credentials.
 */
@Schema({ timestamps: true })
export class Credential {
  /**
   * The password associated with the credential.
   */
  @Prop()
  password: string;

  /**
   * The user associated with the credential.
   */
  @Prop({ type: Types.ObjectId, ref: User.name, unique: true })
  user: User;
}

export type CredentialDocument = HydratedDocument<Credential>;

export const CredentialSchema = SchemaFactory.createForClass(Credential);

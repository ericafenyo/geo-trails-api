import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { randomUUID } from "node:crypto";

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, default: () => randomUUID() })
  uuid: string;

  @Prop({ required: true, unique: true })
  accountId: string;

  @Prop({ default: "" })
  firstName: string;

  @Prop({ default: "" })
  lastName: string;

  @Prop({ default: "" })
  email: string;

  @Prop({ default: "" })
  bio: string;

  @Prop({ default: "" })
  avatarUrl: string;

  @Prop({ default: 0 })
  weight: number;
}

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);

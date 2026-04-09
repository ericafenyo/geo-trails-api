import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class RefreshToken extends Document {
  /**
   * Refresh token value
   */
  @Prop({ unique: true, required: true })
  value: string;

  /**
   * Previous refresh token value
   */
  @Prop({ required: false, default: null })
  previousTokenId: Types.ObjectId;

  /**
   * Date and time when token was revoked
   */
  @Prop({ required: false, default: null })
  revokedAt: Date;

  /**
   * Date and time when token was revoked
   */
  @Prop({ required: true })
  userId: string;

  /**
   * Creation date & time
   */
  @Prop({ default: Date.now })
  createdAt: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);

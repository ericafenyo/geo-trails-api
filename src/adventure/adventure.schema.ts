import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { randomUUID } from "node:crypto";

@Schema({ _id: false })
export class LocationSubdocument {
  @Prop({ required: true })
  latitude: number;

  @Prop({ required: true })
  longitude: number;

  @Prop({ default: 0 })
  altitude: number;

  @Prop({ required: true })
  time: number;

  @Prop({ default: 0 })
  speed: number;

  @Prop({ default: 0 })
  accuracy: number;

  @Prop({ default: 0 })
  bearing: number;

  @Prop({ default: "" })
  timezone: string;

  @Prop({ default: 0 })
  writeTime: number;
}

export const LocationSubdocumentSchema =
  SchemaFactory.createForClass(LocationSubdocument);

@Schema({ timestamps: true })
export class Adventure {
  @Prop({ required: true, unique: true, default: () => randomUUID() })
  uuid: string;

  @Prop({ default: "" })
  title: string;

  @Prop({ default: "" })
  description: string;

  @Prop({ default: 0 })
  altitude: number;

  @Prop({ default: 0 })
  calories: number;

  @Prop({ default: 0 })
  distance: number;

  @Prop({ default: 0 })
  duration: number;

  @Prop()
  startTime: Date;

  @Prop()
  endTime: Date;

  @Prop({ default: 0 })
  speed: number;

  @Prop({
    type: String,
    enum: ["STILL", "WALK", "BIKE", "CAR", "BUS", "METRO", "TRAIN"],
    default: "STILL",
  })
  transportMode: string;

  @Prop({ default: "" })
  polyline: string;

  @Prop({ default: "" })
  image: string;

  @Prop({ required: true })
  ownerId: string;

  @Prop({ type: [LocationSubdocumentSchema], default: [] })
  locations: LocationSubdocument[];

  createdAt: Date;
  updatedAt: Date;
}

export type AdventureDocument = HydratedDocument<Adventure>;

export const AdventureSchema = SchemaFactory.createForClass(Adventure);

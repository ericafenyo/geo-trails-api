import { Injectable } from "@nestjs/common";
import { Repository } from "@/repository";
import { InjectModel } from "@nestjs/mongoose";
import { USER_MODEL } from "@/constants/model-names";
import { Model } from "mongoose";
import { UserDocument } from "./user.schema";

@Injectable()
export class UserRepository extends Repository<UserDocument> {
  constructor(@InjectModel(USER_MODEL) model: Model<UserDocument>) {
    super(model);
  }
}

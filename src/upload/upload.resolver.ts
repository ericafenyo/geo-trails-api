import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { UploadService } from "./upload.service";
import { UploadedFile } from "./upload.types";
import { ReadStream } from "fs";

@Resolver()
export class UploadResolver {
  constructor(private uploadService: UploadService) {}

  @Mutation(() => UploadedFile)
  async uploadFile(
  ): Promise<UploadedFile> {
    return null;
  }
}

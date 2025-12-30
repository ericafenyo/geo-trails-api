
import { UploadService } from "./upload.service";
import { UploadedFile } from "./upload.types";
import { ReadStream } from "fs";


export class UploadResolver {
  constructor(private uploadService: UploadService) {}

  async uploadFile(
  ): Promise<UploadedFile> {
    return null;
  }
}

import { PhotoService } from "./photo.service";
import { Photo } from "./photo";
import { CreatePhotoInput } from "./create-photo.input";
import { UpdatePhotoInput } from "./update-photo.input";

export class PhotoResolver {
  constructor(private readonly photoService: PhotoService) {}

  createPhoto(args: CreatePhotoInput) {
    return this.photoService.create(args);
  }

  findAll() {
    return this.photoService.findAll();
  }

  findOne(id: number) {
    return this.photoService.findOne(id);
  }

  updatePhoto(updatePhotoInput: UpdatePhotoInput) {
    return this.photoService.update(updatePhotoInput.id, updatePhotoInput);
  }

  removePhoto(id: number) {
    return this.photoService.remove(id);
  }
}

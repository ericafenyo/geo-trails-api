import { Injectable } from '@nestjs/common';
import { CreatePhotoInput } from './create-photo.input';
import { UpdatePhotoInput } from './update-photo.input';

@Injectable()
export class PhotoService {
  create(createPhotoInput: CreatePhotoInput) {
    return 'This action adds a new photo';
  }

  findAll() {
    return `This action returns all photo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} photo`;
  }

  update(id: number, updatePhotoInput: UpdatePhotoInput) {
    return `This action updates a #${id} photo`;
  }

  remove(id: number) {
    return `This action removes a #${id} photo`;
  }
}

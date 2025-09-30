import { PartialType } from '@nestjs/swagger';
import { CreateGrabDto } from './create-grab.dto';

export class UpdateGrabDto extends PartialType(CreateGrabDto) {
  id!: string;
  status?: string;
}

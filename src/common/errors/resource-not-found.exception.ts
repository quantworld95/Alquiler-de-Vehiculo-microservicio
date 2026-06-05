import { NotFoundException } from '@nestjs/common';

export class ResourceNotFoundException extends NotFoundException {
  constructor(resource: string, id: string | number) {
    super({
      code: 'RESOURCE_NOT_FOUND',
      message: `${resource} with id ${id} was not found`,
      details: { resource, id },
    });
  }
}

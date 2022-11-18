import { NotFoundException } from '@nestjs/common';

export const isExist = (element: any) => {
  if (!element) {
    throw new NotFoundException();
  }
};

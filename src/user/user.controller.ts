import { Controller, Get, Patch } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';

@Controller('user')
export class UserController {
  @Get()
  getMe(@GetUser() user: User) {
    return user;
  }

  @Patch()
  editUser() {}
}

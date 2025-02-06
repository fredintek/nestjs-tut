import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersParamsDto } from './dtos/get-users-param.dto';
import { PatchUserDto } from './dtos/patch-users.dto';

@Controller('users')
export class UsersController {
  @Get('/:id')
  public getUsers(
    @Param() getUsersParamsDto: GetUsersParamsDto,
    @Query('limit', new DefaultValuePipe(1), ParseIntPipe) query: number,
  ) {
    console.log('params', getUsersParamsDto);
    console.log('query', query);
    return 'All Users here';
  }

  @Post()
  public createUsers(@Body() createUserDto: CreateUserDto) {
    console.log('body', createUserDto);
    return 'Create Users here';
  }

  @Patch()
  public updateUsers(@Body() patchUserDto: PatchUserDto) {
    console.log('body', patchUserDto);
    return 'Update Users here';
  }
}

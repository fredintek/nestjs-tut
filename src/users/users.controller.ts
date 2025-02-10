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
import { UsersService } from './providers/users.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  User404ResponseDto,
  UserOKResponseDto,
} from './dtos/user-response.dto';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  public getUsers(
    @Query('limit', new DefaultValuePipe(1), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.userService.findAllUsers(limit, page);
  }

  @Get('/:id')
  @ApiOperation({
    summary:
      'Fetches a specific user from list of registered users on the application',
    description: 'Get a single user by their ID',
  })
  @ApiResponse({
    status: 200,
    description: 'User fetched successfully',
    type: UserOKResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: User404ResponseDto,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: 'number',
    description: 'The number of entries returned per query',
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: 'number',
    description: 'The position of the page number you want to retrieve',
    example: 2,
  })
  public getOneUser(
    @Param() getUsersParamsDto: GetUsersParamsDto,
    @Query('limit', new DefaultValuePipe(1), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.userService.findOneUser(getUsersParamsDto);
  }

  @Post()
  public createUsers(@Body() createUserDto: CreateUserDto) {
    console.log('body', createUserDto);
    return this.userService.createUser(createUserDto);
  }

  @Patch()
  public updateUsers(@Body() patchUserDto: PatchUserDto) {
    console.log('body', patchUserDto);
    return 'Update Users here';
  }
}

import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  SetMetadata,
  UseGuards,
  UseInterceptors,
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
import { CreateManyUsersDto } from './dtos/create-many-users.dto';
import { AccessTokenGuard } from 'src/auth/guards/access-token/access-token.guard';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';

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
    return this.userService.findOneUser(getUsersParamsDto.id as number);
  }

  @Post()
  @Auth(AuthType.None)
  @UseInterceptors(ClassSerializerInterceptor)
  public createUsers(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Patch()
  public updateUsers(@Body() patchUserDto: PatchUserDto) {
    console.log('body', patchUserDto);
    return 'Update Users here';
  }

  @Post('create-many')
  public createMany(@Body() createManyUsersDto: CreateManyUsersDto) {
    return this.userService.createMany(createManyUsersDto);
  }
}

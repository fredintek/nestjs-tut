import { ApiProperty } from '@nestjs/swagger';

export class UserOKResponseDto {
  @ApiProperty({ example: '12345', description: 'Unique user ID' })
  id: string;

  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  name: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'User email' })
  email: string;
}

export class User404ResponseDto {
  @ApiProperty({ example: 404 })
  status: number;

  @ApiProperty({ example: 'User not found' })
  message: string;
}

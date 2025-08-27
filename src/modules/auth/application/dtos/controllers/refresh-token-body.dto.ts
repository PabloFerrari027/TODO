import { ApiProperty } from '@nestjs/swagger';
import { IsJWT } from 'class-validator';

export class RefreshTokenBodyDto {
  @ApiProperty({
    description: 'Access token',
    required: true,
  })
  @IsJWT()
  access_token: string;

  @ApiProperty({
    description: 'Refresh token',
    required: true,
  })
  @IsJWT()
  refresh_token: string;
}

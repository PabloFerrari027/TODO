import { IsJWT } from 'class-validator';

export class RefreshTokenDto {
  @IsJWT()
  accessToken: string;

  @IsJWT()
  refreshToken: string;
}

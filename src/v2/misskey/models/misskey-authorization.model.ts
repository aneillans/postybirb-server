import { IsString, IsDefined, IsUrl } from 'class-validator';

export class MissKeyAuthorization {
  @IsString()
  @IsDefined()
  @IsUrl()
  website: string;

  @IsString()
  @IsDefined()
  readonly code: string;
}

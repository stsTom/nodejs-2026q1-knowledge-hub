import { IsString, IsNotEmpty } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'oldPassword is required' })
  oldPassword: string;

  @IsString()
  @IsNotEmpty({ message: 'newPassword is required' })
  newPassword: string;
}

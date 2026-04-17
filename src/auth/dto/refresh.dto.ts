import { IsDefined, IsNotEmpty, IsString } from "class-validator";

export class RefreshDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  refreshToken: string
}
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'name is required' })
  @MinLength(1)
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'description is required' })
  @MinLength(1)
  description: string;
}

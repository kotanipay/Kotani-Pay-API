import {
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsPhoneNumber,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@kotanicore/auth/rbac/enums/role.enum';

export class CreateUserDto {
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  @IsNotEmpty()
  name: string;

  //TODO: Incorporate other locales
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  @IsMobilePhone('en-KE')
  phoneNumber: string;

  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    type: Array,
    description: 'This is a required property',
  })
  @IsNotEmpty()
  roles: Role[];
}

import {
  IsInt,
  IsMobilePhone,
  IsPhoneNumber,
  IsPositive,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetBalanceDto {
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  @IsMobilePhone('en-KE')
  phoneNumber: string;
}

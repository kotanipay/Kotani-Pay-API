import { IsDate, IsDateString, IsEnum, IsNotEmpty } from 'class-validator';
import { DocumentTypes } from '@kotanicore/services/interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class SetKycDto {
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  @IsNotEmpty()
  documentNumber: string;

  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  @IsEnum(DocumentTypes)
  documentType: string;

  @ApiProperty({
    type: Date,
    description: 'This is a required property',
  })
  @IsDateString()
  dateOfBirth;
}

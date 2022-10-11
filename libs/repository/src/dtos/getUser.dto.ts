import { ApiProperty } from '@nestjs/swagger';

export class GetUserDto {
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  id: string;
}

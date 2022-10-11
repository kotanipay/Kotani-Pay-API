import { IsInt, IsNotEmpty, IsPositive, isPositive } from 'class-validator';

export class GetMoolaLoan {
  @IsNotEmpty()
  id: string;

  @IsInt()
  @IsPositive()
  amount: number;
}

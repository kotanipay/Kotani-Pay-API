export interface TransactionInterface {
  id: string;
  date: Date;
  amount: number;
  txHash: string;
  description: string;
  status: string;
  type: string;
}

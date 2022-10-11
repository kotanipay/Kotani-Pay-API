import { Schema } from 'mongoose';

export const TransactionSchema = new Schema({
  id: String,
  date: Date,
  amount: Number,
  txHash: String,
  description: String,
  status: String,
  type: String,
});

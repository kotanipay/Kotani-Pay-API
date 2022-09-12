import { Schema } from 'mongoose';

export const AccountSchema = new Schema({
  uid: String,
  publicAddress: { type: [String], index: true },
  seedKey: String,
});

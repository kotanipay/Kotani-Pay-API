import { Schema } from 'mongoose';

export const KycSchema = new Schema({
  dateOfBirth: String,
  gender: String,
  occupation: String,
  status: Boolean,
  documentNumber: { type: [String], index: true },
  documentType: String,
});

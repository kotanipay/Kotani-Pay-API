import { Document } from 'mongoose';

export interface AccountDocumentInterface extends Document {
  uid: string;
  publicAddress: string;
  seedKey: string;
}

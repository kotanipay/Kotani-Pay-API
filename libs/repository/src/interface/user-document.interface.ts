import { Role } from '@kotanicore/auth/rbac/enums/role.enum';
import { Document, ObjectId } from 'mongoose';

export interface UserDocumentInterface extends Document {
  _id: ObjectId;
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
  roles: Role[];
}

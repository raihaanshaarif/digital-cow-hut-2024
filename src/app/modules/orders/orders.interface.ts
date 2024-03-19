import { Types } from 'mongoose';
import { ICow } from '../cow/cow.interface';
import { IUser } from '../user/user.interface';

export type IOrders = {
  cow: Types.ObjectId | ICow;
  buyer: Types.ObjectId | IUser;
};

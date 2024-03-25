/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

type IUserRole = 'seller' | 'buyer';
type IName = {
  firstName: string;
  lastName: string;
};

export type IUser = {
  _id: Types.ObjectId;
  phoneNumber: string;
  role: IUserRole;
  password: string;
  name: IName;
  address: string;
  budget: number;
  income: number;
};
export type IUserFilters = {
  searchTerm?: string;
};

export type UserModel = {
  isUserExist(
    phoneNumber: string,
  ): Promise<Pick<IUser, 'password' | 'role' | '_id'>>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string,
  ): Promise<boolean>;
} & Model<IUser>;

// export type UserModel = Model<IUser, Record<string, unknown>>;

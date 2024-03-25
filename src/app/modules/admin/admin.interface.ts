/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type IRole = 'admin';

export type ILoginAdmin = {
  phoneNumber: string;
  password: string;
};

export type ILoginAdminResponse = {
  accessToken: string;
  refreshToken?: string;
};

export type IAdmin = {
  phoneNumber: string;
  role?: IRole;
  password: string;
  name: {
    firstName: string;
    lastName: string;
  };
  address: string;
};

export type IAdminResponse = {
  phoneNumber: string;
  role?: IRole;

  name: {
    firstName: string;
    lastName: string;
  };
  address: string;
};

export type AdminModel = {
  isAdminExist(
    phoneNumber: string,
  ): Promise<Pick<IAdmin, 'phoneNumber' | 'password' | 'role'>>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string,
  ): Promise<boolean>;
} & Model<IAdmin>;

export type ICowFilters = {
  searchTerm?: string;
  // name?: string;
  // location?: ILocation;
  // age?: number;
  // price?: number;
  // category?: ICategory;
  // weight?: number;
  // label?: ILabel;
  // minPrice?: number;
  // maxPrice?: number;
};

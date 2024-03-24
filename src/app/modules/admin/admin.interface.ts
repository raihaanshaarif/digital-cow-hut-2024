import { Model } from 'mongoose';

export type IRole = 'admin';

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

export type AdminModel = Model<IAdmin, Record<string, unknown>>;

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

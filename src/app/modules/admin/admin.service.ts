/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import httpStatus from 'http-status';

import { IAdmin, ILoginAdmin, ILoginAdminResponse } from './admin.interface';
import { Admin } from './admin.model';
import ApiError from '../../../errors/apiError';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import config from '../../../config';
import { Secret } from 'jsonwebtoken';

const createAdmin = async (adminData: IAdmin) => {
  adminData.role = 'admin';
  const createdAdmin = await Admin.create(adminData);
  const { password, ...result } = createdAdmin.toObject();
  return result;
};

const loginAdmin = async (
  payload: ILoginAdmin,
): Promise<ILoginAdminResponse> => {
  const { phoneNumber: id, password } = payload;

  console.log(payload);

  // Check if the user exists
  const isUserExist = await Admin.isAdminExist(id);
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found');
  }
  //Check if the given and stored password mismatched
  if (
    isUserExist.password &&
    !(await Admin.isPasswordMatched(password, isUserExist?.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  // Create access token and refresh token
  const { phoneNumber, role } = isUserExist;
  const accessToken = jwtHelpers.createToken(
    { phoneNumber, role },
    config.jwt_secret as Secret,
    config.jwt_expires_in as string,
  );

  const refreshToken = jwtHelpers.createToken(
    { phoneNumber, role },
    config.jwt_refresh_token_secret as Secret,
    config.jwt_refresh_token_expires_in as string,
  );
  return {
    accessToken,
    refreshToken,
  };
};

/* const getAllCows = async (
  filters: ICowFilters,
  paginationOption: IPaginationOptions,
): Promise<IGenericResponse<ICow[]>> => {
  const { searchTerm, maxPrice, minPrice, ...filtersData } = filters;

  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      $or: cowSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }
  if (searchTerm) {
    if (!isNaN(parseFloat(searchTerm))) {
      // [field] = parseFloat(searchTerm);
      // console.log(field);
      // console.log(searchTerm);
    }
  }

  // console.log(minPrice, maxPrice);

  if (minPrice !== undefined) {
    andCondition.push({
      price: {
        $gte: minPrice,
      },
    });
  }
  if (maxPrice !== undefined) {
    andCondition.push({
      price: {
        $lte: maxPrice,
      },
    });
  }

  if (minPrice !== undefined && maxPrice !== undefined) {
    andCondition.push({
      price: {
        $gte: minPrice,
        $lte: maxPrice,
      },
    });
  }

  if (Object.keys(filtersData).length) {
    andCondition.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOption);

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};

  const result = await Cow.find(whereCondition)
    .populate('seller')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Cow.countDocuments(whereCondition);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleCow = async (id: string): Promise<ICow | null> => {
  const isExist = await Cow.findOne({ _id: id });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cow not Found');
  }
  const result = await Cow.findById(id);

  return result;
};

const updateCow = async (
  id: string,
  payload: Partial<ICow>,
): Promise<ICow | null> => {
  const isExist = await Cow.findOne({ _id: id });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cow not found');
  }

  const result = await Cow.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return result;
};

const deleteCow = async (id: string): Promise<ICow | null> => {
  const result = await Cow.findByIdAndDelete(id);
  return result;
}; */

export const AdminService = {
  createAdmin,
  loginAdmin,
  // getSingleCow,
  // getAllCows,
  // updateCow,
  // deleteCow,
};

import httpStatus from 'http-status';
import ApiError from '../../../errors/apiError';

import {
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from './auth.interface';
import { User } from '../user/user.model';
import { IUser } from '../user/user.interface';

import { jwtHelpers } from '../../../helpers/jwtHelpers';
import config from '../../../config';
import { Secret } from 'jsonwebtoken';

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { id, password } = payload;
  // console.log(payload);

  // Check if the user exists
  const isUserExist = await User.isUserExist(id);
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  //Check if the given and stored password mismatched
  if (
    isUserExist.password &&
    !(await User.isPasswordMatch(password, isUserExist?.password))
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

const createUser = async (data: IUser): Promise<IUser> => {
  const newData: IUser = { ...data, income: 0 };
  const result = await User.create(newData);
  return result;
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  //verify refresh token
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt_refresh_token_secret as Secret,
    );
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid refresh token');
  }

  const { phoneNumber } = verifiedToken;

  // If User exist in Database
  const isUserExist = await User.isUserExist(phoneNumber);
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Generate a new access token
  const newAccessToken = jwtHelpers.createToken(
    { phoneNumber },
    config.jwt_secret as Secret,
    config.jwt_expires_in as string,
  );
  return { accessToken: newAccessToken };
};

export const AuthService = {
  loginUser,
  createUser,
  refreshToken,
};

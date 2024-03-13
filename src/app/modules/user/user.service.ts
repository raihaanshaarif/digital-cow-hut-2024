import User from './user.model';
import { IUser } from './user.interface';
// import catchAsync from '../../../shared/catchAsync';
// import pick from '../../../shared/pick';

const createUser = async (data: IUser): Promise<IUser> => {
  const result = await User.create(data);
  return result;
};

export const UserService = {
  createUser,
};

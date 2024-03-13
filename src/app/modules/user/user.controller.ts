import { Request, Response } from 'express';
import { UserService } from './user.service';
import httpStatus from 'http-status';
import { IUser } from './user.interface';
import catchAsync from '../../../shared/catchAsync';
// import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';

const createUser = async (req: Request, res: Response) => {
  try {
    const { user } = req.body;
    const result = await UserService.createUser(user);
    res.status(200).json({
      success: true,
      message: 'User created successfully',
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Failed to create User',
    });
  }
};
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  // const filters = pick(req.query, userFilterableFields);
  // const paginationOptions = pick(req.query, paginationFields);

  // const result = await UserService.getAllUsers(filters, paginationOptions);

  sendResponse<IUser[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users retrieved successfully !',
    // meta: result.meta,
    // data: result.data,
  });
});

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  // const id = req.params.id;

  // const result = await UserService.getSingleUser(id);

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User retrieved successfully !',
    // data: result,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  // const id = req.params.id;
  // const updatedData = req.body;

  // const result = await UserService.updateUser(id, updatedData);

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User updated successfully !',
    // data: result,
  });
});
const deleteUser = catchAsync(async (req: Request, res: Response) => {
  // const id = req.params.id;

  // const result = await UserService.deleteUser(id);

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User deleted successfully !',
    // data: result,
  });
});

export const UserController = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};

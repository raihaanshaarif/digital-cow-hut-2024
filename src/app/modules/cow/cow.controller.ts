import { Request, RequestHandler, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import httpStatus from 'http-status';
import { ICow } from './cow.interface';
import sendResponse from '../../../shared/sendResponse';
import { CowService } from './cow.service';
import pick from '../../../shared/pick';
import { cowFilterableFields } from './cow.constant';
import { paginationFields } from '../../../constants/pagination';

const createCow: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const cowData = req.body;
    const result = await CowService.createCow(cowData);

    sendResponse<ICow>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Cow created successfully!',
      data: result,
    });
  },
);

const getAllCow = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, cowFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await CowService.getAllCows(filters, paginationOptions);

  sendResponse<ICow[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Cow Retrieved successfully !',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleCow: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await CowService.getSingleCow(id);

    sendResponse<ICow>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Single Cow Retrived Successfuly',
      data: result,
    });
  },
);

const updateCow: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const payload = req.body;

    const result = await CowService.updateCow(id, payload);

    sendResponse<ICow>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Cow Updated Successfuly',
      data: result,
    });
  },
);

const deleteCow: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await CowService.deleteCow(id);

    sendResponse<ICow>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Cow Deleted Successfuly',
      data: result,
    });
  },
);

export const CowController = {
  createCow,
  getSingleCow,
  getAllCow,
  updateCow,
  deleteCow,
};

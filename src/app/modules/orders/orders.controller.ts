import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IOrders } from './orders.interface';
import httpStatus from 'http-status';
import { OrdersService } from './orders.service';
// import { OrdersService } from './orders.service';

const createOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await OrdersService.createOrder(req.body);
  sendResponse<IOrders>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order created successfully!',
    data: result,
  });
});

export const OrdersController = {
  createOrders,
};

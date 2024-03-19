import express from 'express';
import { OrdersController } from './orders.controller';

const ordersRouter = express.Router();

ordersRouter.post('/', OrdersController.createOrders);

export const OrdersRouter = ordersRouter;

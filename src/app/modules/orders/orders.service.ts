import httpStatus from 'http-status';
import { Cow } from '../cow/cow.model';

import ApiError from '../../../errors/apiError';
import mongoose from 'mongoose';
import { Orders } from './orders.model';
import { IOrders } from './orders.interface';
import { User } from '../user/user.model';

const createOrder = async (data: IOrders): Promise<IOrders | null> => {
  const cowDetail = await Cow.findById(data.cow);
  const buyerDetail = await User.findById(data.buyer);
  if (!cowDetail) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cow not found');
  }
  if (!buyerDetail) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Buyer not found');
  }

  if (cowDetail.price > buyerDetail.budget) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Insufficient budget');
  }
  if (cowDetail.label == 'sold out') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cow is not for sell');
  }
  if (buyerDetail.role == 'seller') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Buyer is not a buyer');
  }
  let newOrderAllData = null;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    // Update the cow's label to 'sold out'
    await Cow.updateOne({ _id: cowDetail.id }, { $set: { label: 'sold out' } });
    // Deduct the cost of the cow from the buyer's budget
    await User.updateOne(
      { _id: buyerDetail.id },
      { $set: { budget: buyerDetail.budget - cowDetail.price } },
    );
    //Add the cost of the cow to the seller income
    const sellerData = await User.findOne({ _id: cowDetail.seller });
    if (sellerData) {
      const sellerUpdate = {
        income: sellerData?.income + cowDetail.price,
      };
      await User.updateOne({ _id: sellerData.id }, sellerUpdate);
    }

    const newOrder = await Orders.create([data], { session });

    if (!(await newOrder).length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create order');
    }
    newOrderAllData = newOrder[0];

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
  }
  return newOrderAllData;
};

const getOrders = async (order: IOrders) => {
  const result = await Orders.find(order);
  return result;
};

export const OrdersService = {
  createOrder,
  getOrders,
};

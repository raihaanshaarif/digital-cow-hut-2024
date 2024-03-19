import { Schema, Types, model } from 'mongoose';
import { IOrders } from './orders.interface';

const OrderSchema = new Schema<IOrders>(
  {
    cow: { type: Types.ObjectId, ref: 'Cow', required: true },
    buyer: { type: Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export const Orders = model<IOrders>('Orders', OrderSchema);

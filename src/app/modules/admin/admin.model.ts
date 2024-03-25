/* eslint-disable @typescript-eslint/no-this-alias */
import bcrypt from 'bcrypt';
import { AdminModel, IAdmin } from './admin.interface';
import { Schema, model } from 'mongoose';
import config from '../../../config';

export const AdminSchema = new Schema<IAdmin, AdminModel>(
  {
    role: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    name: {
      type: {
        firstName: {
          type: String,
          required: true,
        },
        lastName: {
          type: String,
          required: true,
        },
      },
      required: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

AdminSchema.statics.isAdminExist = async function (
  phoneNumber: string,
): Promise<Pick<IAdmin, 'phoneNumber' | 'password' | 'role'> | null> {
  return await Admin.findOne(
    { phoneNumber },
    { phoneNumber: 1, password: 1, role: 1 },
  );
};

AdminSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

// hashing Admin password
AdminSchema.pre('save', async function (next) {
  //Hash password
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds),
  );

  next();
});

export const Admin = model<IAdmin, AdminModel>('Admin', AdminSchema);

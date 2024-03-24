import { Schema, model } from 'mongoose';

// import { breed, category, label, location } from './cow.constant';
import { IAdmin } from './admin.interface';
import bcrypt from 'bcrypt';
import config from '../../../config';

const adminSchema = new Schema<IAdmin>(
  {
    phoneNumber: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ['admin'],
      defaultValue: 'admin',
    },
    password: { type: String, required: true, select: 0 },
    name: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
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

adminSchema.statics.isUserExist = async function (
  id: string,
): Promise<Pick<IAdmin, 'phoneNumber' | 'password' | 'role'> | null> {
  return await Admin.findOne(
    { id },
    { id: 1, password: 1, needsPasswordChange: 1 },
  );
};

adminSchema.statics.isPasswordMatch = async function (
  givenPassword: string,
  savedPassword: string,
): Promise<boolean> {
  const isMatched = await bcrypt.compare(givenPassword, savedPassword);
  return isMatched;
};

adminSchema.pre('save', async function (next) {
  //Hash password
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

export const Admin = model<IAdmin>('Admin', adminSchema);

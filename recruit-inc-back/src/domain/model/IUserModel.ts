import mongoose from 'mongoose';
/**
 * Typegoose is including schema and model in one class
 */
export interface IUserModel {
  _id?: mongoose.Types.ObjectId;
  username: string;
  firstName: string;
  lastName: string;
  hashedPassword: string;
  email: string;
}

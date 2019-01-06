/**
 * Typegoose is including schema and model in one class
 */
import { prop, Typegoose } from 'typegoose';
import { IUserModel } from '../../domain/model/IUserModel';
import { ApplicantSchema } from './applicantSchema';
import { mongoose } from 'mongoose';
import { Model, Schema } from 'mongoose';

export class UserSchema extends Typegoose implements IUserModel {
  @prop()
  _id?: mongoose.Types.ObjectId;

  //TODO: Find how to make work the unique schema !!!!
  @prop({ required: true, unique: true, minlength: 3, maxlength: 150 })
  username: string;

  @prop({ required: true, minlength: 2, maxlength: 150 })
  firstName: string;

  @prop({ required: true, minlength: 2, maxlength: 150 })
  lastName: string;
  // Hashed Password, don't store unhashed
  @prop({ required: true })
  hashedPassword: string;

  @prop({ required: true, unique: true, minlength: 5, maxlength: 300 })
  email: string;
}

export const UserModel: Model<IUserModel> =  ApplicantSchema.getModel(UserSchema, 'users');

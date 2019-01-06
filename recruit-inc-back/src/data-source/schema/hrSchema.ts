/**
 * Typegoose is including schema and model in one class
 */
import { prop, Ref, Typegoose } from 'typegoose';
import { UserSchema } from './userSchema';
import { IHRModel } from '../../domain/model/IHRModel';
import { ApplicantSchema } from './applicantSchema';
import { mongoose } from 'mongoose';
import { Model, Schema } from 'mongoose';

export class HRSchema extends Typegoose implements IHRModel {
  @prop()
  _id?: mongoose.Types.ObjectId;

  @prop({ ref: UserSchema, required: true })
  userRef: Ref<UserSchema>;
}
export const HRModel: Model<IHRModel> =  ApplicantSchema.getModel(HRSchema, 'hrs');

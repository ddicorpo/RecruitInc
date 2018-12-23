/**
 * Typegoose is including schema and model in one class
 */
import { prop, Ref, Typegoose } from 'typegoose';
import { UserSchema } from './userSchema';
import { IHRModel } from '../../domain/model/IHRModel';
import { mongoose } from 'mongoose';

export class HRSchema extends Typegoose implements IHRModel {
  @prop()
  _id?: mongoose.Types.ObjectId;

  @prop({ ref: UserSchema, required: true, unique: true })
  userRef: Ref<UserSchema>;
}
// Can pass schema option in statement below
export const HRModel = new UserSchema().getModelForClass(UserSchema, {
  schemaOptions: { collection: 'users' },
});

/**
 * Typegoose is including schema and model in one class
 */
import { prop, Ref, Typegoose } from 'typegoose';
import { UserSchema } from './userSchema';
import { HRModel } from '../../domain/model/hrModel';

export class HRSchema extends Typegoose implements HRModel {
  @prop({ index: true, required: true, unique: true })
  hrId: number;

  @prop({ ref: UserSchema, required: true, unique: true })
  userRef: Ref<UserSchema>;
}

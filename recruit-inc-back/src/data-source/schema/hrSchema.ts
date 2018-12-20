/**
 * Typegoose is including schema and model in one class
 */
import { prop, Ref, Typegoose } from 'typegoose';
import { UserSchema } from './userSchema';
import { IHRModel } from '../../domain/model/IHRModel';

export class HRSchema extends Typegoose implements IHRModel {
  @prop({ index: true, required: true, unique: true })
  hrId: number;

  @prop({ ref: UserSchema, required: true, unique: true })
  userRef: Ref<UserSchema>;
}
// Can pass schema option in statement below
export const HRModel = new UserSchema().getModelForClass(UserSchema, {
  schemaOptions: { collection: 'users' },
});

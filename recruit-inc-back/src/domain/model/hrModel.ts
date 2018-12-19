/**
 * Typegoose is including schema and model in one class
 */
import { prop, Ref, Typegoose } from 'typegoose';
import { User } from './userModel';

export class HR extends Typegoose {
  @prop({ index: true, required: true, unique: true })
  hrId: number;

  @prop({ ref: User, required: true, unique: true })
  userRef: Ref<User>;
}

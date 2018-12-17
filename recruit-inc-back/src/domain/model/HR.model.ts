import { prop, Ref, Typegoose } from 'typegoose';
import { User } from './User.model';

export class HR extends Typegoose {
  @prop({ index: true, required: true, unique: true })
  hrId: number;

  @prop({ ref: User, required: true, unique: true })
  userRef: Ref<User>;
}

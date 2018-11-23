import { prop, Typegoose } from 'typegoose';

export class User extends Typegoose {
  @prop()
  username?: string;
}

/**
 * Typegoose is including schema and model in one class
 */
import { prop, Typegoose } from 'typegoose';

export class User extends Typegoose {
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

// Can pass schema option in statement below
export const UserModel = new User().getModelForClass(User, {
  schemaOptions: { collection: 'users' },
});

import { UserSchema } from '../../data-source/schema/userSchema';

/**
 * Typegoose is including schema and model in one class
 */
export interface IHRModel {
  hrId: number;
  userRef: UserSchema;
}

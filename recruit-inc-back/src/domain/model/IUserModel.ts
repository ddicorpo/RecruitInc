/**
 * Typegoose is including schema and model in one class
 */
export interface IUserModel {
  username: string;
  firstName: string;
  lastName: string;
  hashedPassword: string;
  email: string;
}

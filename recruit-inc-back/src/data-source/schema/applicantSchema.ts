/**
 * Typegoose is including schema and model in one class
 */
import { prop, Typegoose } from 'typegoose';
import { IApplicantModel } from '../../domain/model/IApplicantModel';
import { UserType } from '../../domain/model/IApplicantModel';
import { IGitModel } from '../../domain/model/IGitModel';
import { mongoose } from 'mongoose';

export class ApplicantSchema extends Typegoose implements IApplicantModel {
  @prop()
  _id?: mongoose.Types.ObjectId;

  @prop({ required: true, unique: true, minlength: 2, maxlength: 150 })
  platformUsername: string;

  @prop({ unique: true, minlength: 2, maxlength: 150 })
  platformEmail?: string;

  @prop()
  iGit: IGitModel;

  @prop({ required: true, enum: UserType })
  userType: UserType;

}
// Can pass schema option in statement below
export const ApplicantModel = new ApplicantSchema().getModelForClass(ApplicantSchema, {
  schemaOptions: { collection: 'applicants' },
});


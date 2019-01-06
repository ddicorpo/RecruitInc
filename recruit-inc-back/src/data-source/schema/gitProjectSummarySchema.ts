import { IGitProjectSummary } from '../../matching-algo/data-model/output-model/IGitProjectSummary';
import { IGitProjectOutput } from '../../matching-algo/data-model/output-model/IGitProjectOutput';
import { ILanguageOutput } from '../../matching-algo/data-model/output-model/ILanguageOutput';
import { ApplicantSchema } from './applicantSchema';
import { prop, Typegoose } from 'typegoose';
import { mongoose } from 'mongoose';
import { Model, Schema } from 'mongoose';

export class GitProjectSummarySchema extends Typegoose
  implements IGitProjectSummary {
  @prop()
  _id?: mongoose.Types.ObjectId;

  @prop()
  totalOutput: ILanguageOutput[];

  @prop()
  projectsOutput: IGitProjectOutput[];
}

export const GitProjectSummaryModel: Model<IGitProjectSummary> =  ApplicantSchema.getModel(GitProjectSummarySchema, 'gitProjectSummary');

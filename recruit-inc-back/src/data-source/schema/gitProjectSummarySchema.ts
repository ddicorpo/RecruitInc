import { IGitProjectSummary } from '../../matching-algo/data-model/output-model/IGitProjectSummary';
import { IGitProjectOutput } from '../../matching-algo/data-model/output-model/IGitProjectOutput';
import { ILanguageOutput } from '../../matching-algo/data-model/output-model/ILanguageOutput';
import { prop, Typegoose } from 'typegoose';
import { mongoose } from 'mongoose';

export class GitProjectSummarySchema extends Typegoose
  implements IGitProjectSummary {
  @prop()
  _id?: mongoose.Types.ObjectId;

  @prop()
  totalOutput: ILanguageOutput[];

  @prop()
  projectsOutput: IGitProjectOutput[];
}

export const GitProjectSummaryModel = new GitProjectSummarySchema().getModelForClass(
  GitProjectSummarySchema,
  {
    schemaOptions: { collection: 'gitProjectSummary' },
  }
);

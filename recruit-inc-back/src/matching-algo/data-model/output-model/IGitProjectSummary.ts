import mongoose from 'mongoose';
import { ILanguageOutput } from './ILanguageOutput';
import { IGitProjectOutput } from './IGitProjectOutput';

export interface IGitProjectSummary {
  _id?: mongoose.Types.ObjectId;
  totalOutput: ILanguageOutput[];
  projectsOutput: IGitProjectOutput[];
}

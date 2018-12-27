import mongoose from 'mongoose';
import { IDataEntry } from '../../matching-algo/data-model/input-model/IDataEntry'
import { DataEntrySchema } from '../../data-source/schema/dataEntrySchema'
import { IGitProjectSummary } from '../../matching-algo/data-model/output-model/IGitProjectSummary'
/**
 * Typegoose is including schema and model in one class
 */
export interface IGitDataModel {
  _id?: mongoose.Types.ObjectId;
  //iDataEntry: IDataEntry;
  dataEntry: IDataEntry;
  iGitProjectSummary: IGitProjectSummary;
  lastKnownInfoDate: string; 
  platform: Platform;
}

export enum Platform {
    Github = 'Github',
    Gitlab = 'Gitlab',
    Bitbucket = 'Bitbucket',
}

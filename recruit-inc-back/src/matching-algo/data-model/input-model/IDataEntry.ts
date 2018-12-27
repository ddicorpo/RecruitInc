import mongoose from 'mongoose';
/**
 * Expected input of the matching algo.
 */
import { IGitProjectInput } from './IGitProjectInput';
export interface IDataEntry {
  _id?: mongoose.Types.ObjectId;
  projectInputs: IGitProjectInput[];
}

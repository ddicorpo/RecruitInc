import mongoose from 'mongoose';
/**
 * Typegoose is including schema and model in one class
 */
export interface ICronModel {
  _id?: mongoose.Types.ObjectId;
  location: string;
  number_scanned: number;
  total_number: number;
  cron_pattern: string;
  status: string;
}

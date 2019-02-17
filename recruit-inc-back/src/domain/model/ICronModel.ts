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
  status: Status;
  lastCreatedAt?: string;
  lastCursor?: string;
}

export enum Status {
  locationscan = 'locationscan',
  scanning = 'scanning',
  complete = 'complete',
  paused = 'paused',
  canceled = 'canceled',
}

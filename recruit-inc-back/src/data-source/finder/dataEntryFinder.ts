import { IDataEntry } from '../../matching-algo/data-model/input-model/IDataEntry';
import { DataEntryModel } from '../schema/dataEntrySchema';
import { BaseFinder } from './BaseFinder';
import { Types } from 'mongoose';

export class DataEntryFinder {
    private baseFinder: BaseFinder = new BaseFinder(DataEntryModel);

  public findById(_id: string): Promise<IDataEntry> {
      return this.baseFinder.findById(_id);
  }

  public findAll(): Promise<IDataEntry> {
      return this.baseFinder.findAll();
  }
}

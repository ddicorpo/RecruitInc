import { BaseFinder } from './baseFinder';
import { IDataEntry } from '../../matching-algo/data-model/input-model/IDataEntry';
import { DataEntryModel } from '../schema/dataEntrySchema';
import { Types } from 'mongoose';

export class DataEntryFinder {
  private baseFinder: BaseFinder;

  constructor() {
    this.baseFinder = new BaseFinder(DataEntryModel);
  }

  public findById(_id: string): Promise<IDataEntry> {
    return new Promise((resolve: any, reject: any) => {
      DataEntryModel.findOne(Types.ObjectId(_id), (error: any, obj: any) => {
        if (error) reject(error.name + ': ' + error.message);
        obj ? resolve(obj) : resolve();
      });
    });
  }

  public findAll(): Promise<IDataEntry> {
    return new Promise((resolve: any, reject: any) => {
      DataEntryModel.find({}, (error: any, obj: any) => {
        if (error) reject(error.name + ': ' + error.message);
        obj ? resolve(obj) : resolve();
      });
    });
  }
}

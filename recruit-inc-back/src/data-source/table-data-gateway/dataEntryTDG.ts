import { BaseTDG } from './baseTDG';
import { IDataEntry } from '../../matching-algo/data-model/input-model/IDataEntry';
import { DataEntryModel } from '../schema/dataEntrySchema';
import { Types } from 'mongoose';

export class DataEntryTDG {
  private baseTDG: BaseTDG;

  constructor() {
    this.baseTDG = new BaseTDG(DataEntryModel);
  }

  public create(dataEntryAttr: IDataEntry, id?: string): Promise<IDataEntry> {
    dataEntryAttr._id = null;
    if (id != null) {
      dataEntryAttr._id = Types.ObjectId(id);
    } else {
      dataEntryAttr._id = Types.ObjectId();
    }

    const newDataEntryModel = new DataEntryModel(dataEntryAttr);

    try {
      return this.baseTDG.create(newDataEntryModel, dataEntryAttr);
    } catch (Exception) {
      throw new Error('Error while creating DataEntry');
    }
  }

  public update(_id: string, updatedValue: IDataEntry): Promise<boolean> {
    try {
      const dataEntryModelToUpdate = new DataEntryModel(updatedValue);
      return this.baseTDG.update(Types.ObjectId(_id), dataEntryModelToUpdate);
    } catch (Exception) {
      throw new Error('Error while creating DataEntry');
    }
  }

  public delete(_id: string): Promise<boolean> {
    try {
      return this.baseTDG.delete(Types.ObjectId(_id));
    } catch (Exception) {
      throw new Error('Error while creating DataEntry');
    }
  }
}

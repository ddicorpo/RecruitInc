import { BaseTDG } from './baseTDG';
import { HRModel } from '../schema/hrSchema';
import { IHRModel } from '../../domain/model/IHRModel';
import { Types } from 'mongoose';

/**
 * Inspired by: https://github.com/gsi-manuel/ts-nodejs-express-webpack/blob/master/src/services/province.service.ts
 * This class will be used to update/delete/create User object
 * The class is using BaseTDG to do transaction allowing uniform transaction handling
 * and logging
 *
 * *************************************************************
 * NOTE: This class doesn't include logic it's only transaction
 * *************************************************************
 */

export class HRTDG {
  private baseTDG: BaseTDG;

  constructor() {
    this.baseTDG = new BaseTDG(HRModel);
  }

  public create(hrAttr: IHRModel, id?: string): Promise<IHRModel> {
    if (id != null) {
      hrAttr._id = Types.ObjectId(id);
    } else {
      hrAttr._id = Types.ObjectId();
    }
    const newHrModel = new HRModel(hrAttr);

    try {
      return this.baseTDG.create(newHrModel, hrAttr);
    } catch (Exception) {
      throw new Error('Problem while creating HR');
    }
  }

  public update(_id: string, updatedVal: IHRModel) {
    try {
      const hrModelToUpdate = new HRModel(updatedVal);
      return this.baseTDG.update(Types.ObjectId(_id), hrModelToUpdate);
    } catch (Exception) {
      throw new Error('Problem while updating HR');
    }
  }

  public delete(_id: string): Promise<boolean> {
    try {
      return this.baseTDG.delete(Types.ObjectId(_id));
    } catch (Exception) {
      throw new Error('Error while deleting user');
    }
  }
}

import { BaseTDG } from './baseTDG';
import { ICronModel } from '../../domain/model/ICronModel';
import { CronModel } from '../schema/cronSchema';
import { Types, Model } from 'mongoose';

export class CronTDG {
  private baseTDG: BaseTDG;

  constructor() {
    this.baseTDG = new BaseTDG(CronModel);
  }

  public create(cronAttr: ICronModel): Promise<ICronModel> {
    cronAttr._id = Types.ObjectId();
    const newCronModel: Model<ICronModel> = new CronModel(cronAttr);

    try {
      return this.baseTDG.create(newCronModel, cronAttr);
    } catch (Exception) {
      throw new Error('Error while creating cron object');
    }
  }

  public update(_id: string, updatedValue: ICronModel): Promise<boolean> {
    try {
      const CronModelToUpdate: Model<ICronModel> = new CronModel(updatedValue);
      return this.baseTDG.update(Types.ObjectId(_id), CronModelToUpdate);
    } catch (Exception) {
      throw new Error('Error while updating cron object');
    }
  }

  public delete(_id: string): Promise<boolean> {
    try {
      return this.baseTDG.delete(Types.ObjectId(_id));
    } catch (Exception) {
      throw new Error('Error while deleting cron object');
    }
  }
}

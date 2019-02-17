import { CronModel } from '../schema/cronSchema';
import { ICronModel, Status } from '../../domain/model/ICronModel';
import { Types } from 'mongoose';
import { BaseFinder } from './BaseFinder';

export class CronFinder {
  private baseFinder: BaseFinder = new BaseFinder(CronModel);
  public findById(_id: string): Promise<ICronModel> {
    return this.baseFinder.findById(_id);
  }

  public findByLocation(location: string): Promise<ICronModel> {
    return this.baseFinder.findOneBy({ location });
  }

  public findByCronPattern(cron_pattern: string): Promise<ICronModel> {
    return this.baseFinder.findBy({ cron_pattern });
  }

  public findByStatus(status: Status): Promise<ICronModel[]> {
    return this.baseFinder.findBy({ status });
  }

  public findByLocationAndStatus(location: string, status: Status): Promise<ICronModel>{
    return new Promise((resolve: any, reject: any) => {
      CronModel.findOne(
        { location: location, status: status },
        (error: any, obj: any) => {
          if (error) reject(error.name + ': ' + error.message);
          obj ? resolve(obj) : resolve();
        }
      );
    });

  }

  public findAll(): Promise<ICronModel> {
    return this.baseFinder.findAll();
  }
}

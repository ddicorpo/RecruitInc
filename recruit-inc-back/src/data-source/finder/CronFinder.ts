import { CronModel } from '../schema/cronSchema';
import { ICronModel } from '../../domain/model/ICronModel';
import { Types } from 'mongoose';
import { BaseFinder } from './BaseFinder';

export class CronFinder {
  private baseFinder: BaseFinder = new BaseFinder(CronModel);
  public findById(_id: string): Promise<ICronModel> {
    return this.baseFinder.findById(_id);
  }

  public findByLocation(location: string): Promise<ICronModel> {
    return this.baseFinder.findBy({ location });
  }

  public findByCronPattern(cron_pattern: string): Promise<ICronModel> {
    return this.baseFinder.findBy({ cron_pattern });
  }

  public findByStatus(status: string): Promise<ICronModel> {
    return this.baseFinder.findBy({ status });
  }

  public findAll(): Promise<ICronModel> {
    return this.baseFinder.findAll();
  }
}

import { GitDataModel } from '../schema/gitDataSchema';
import { IGitDataModel } from '../../domain/model/IGitDataModel';
import { Platform } from '../../domain/model/IGitDataModel';
import { BaseFinder } from './BaseFinder';
import { Types } from 'mongoose';

export class GitDataFinder {
    private baseFinder: BaseFinder = new BaseFinder(GitDataModel);

  public findById(_id: string): Promise<IGitDataModel> {
      return this.baseFinder.findById(_id);
  }

  public findByLastKnownInfoDate(
    lastKnownInfoDate: string
  ): Promise<IGitDataModel> {
      return this.baseFinder.findBy({lastKnownInfoDate});
  }

  public findByPlatform(platform: Platform): Promise<IGitDataModel> {
      return this.baseFinder.findBy({platform});
  }

  public findAll(): Promise<IGitDataModel> {
      return this.baseFinder.findAll();
  }
}

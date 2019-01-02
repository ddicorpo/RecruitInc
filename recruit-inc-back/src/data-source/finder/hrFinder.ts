import { HRModel } from '../schema/hrSchema';
import { IHRModel } from '../../domain/model/IHRModel';
import { BaseFinder } from './BaseFinder';
import { Types } from 'mongoose';

/**
 * Inspired by: https://github.com/gsi-manuel/ts-nodejs-express-webpack/blob/master/src/services/province.service.ts
 * This class will be used to find/find all and other find User object
 * The class is using BaseFinder to do transaction allowing uniform transaction handling
 * and logging
 * *************************************************************
 * NOTE: This class doesn't include logic it's only transaction
 * *************************************************************
 */
export class HRFinder {
    private baseFinder: BaseFinder = new BaseFinder(HRModel);
  /**
   * Finding HR by Id
   * @param _id
   */
  public findById(_id: string): Promise<IHRModel> {
      return this.baseFinder.findById(_id);
  }

  /**
   * Getting all HR user
   */
  public findAll(): Promise<IHRModel> {
      return this.baseFinder.findAll();
  }

  //TODO: Add needed method in a close future, e.g. FindByUsername
}

import { HRModel } from '../schema/hrSchema';
import { IHRModel } from '../../domain/model/IHRModel';
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
  /**
   * Finding HR by Id
   * @param _id
   */
  public findById(_id: string): Promise<IHRModel> {
    return new Promise((resolve: any, reject: any) => {
      HRModel.findOne(Types.ObjectId(_id), (error: any, obj: any) => {
        if (error) reject(error.name + ': ' + error.message);
        obj ? resolve(obj) : resolve();
      });
    });
  }

  /**
   * Getting all HR user
   */
  public findAll(): Promise<IHRModel> {
    return new Promise((resolve: any, reject: any) => {
      HRModel.find({}, (error: any, obj: any) => {
        if (error) reject(error.name + ': ' + error.message);
        obj ? resolve(obj) : resolve();
      });
    });
  }

  //TODO: Add needed method in a close future, e.g. FindByUsername
}

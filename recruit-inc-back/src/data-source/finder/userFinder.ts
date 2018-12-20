import { BaseFinder } from './baseFinder';
import { formalUsermodel } from '../schema/userSchema';
/**
 * Inspired by: https://github.com/gsi-manuel/ts-nodejs-express-webpack/blob/master/src/services/province.service.ts
 * This class will be used to find/find all and other find User object
 * The class is using BaseFinder to do transaction allowing uniform transaction handling
 * and logging
 */

export class UserFinder {
  private baseFinder: BaseFinder;

  constructor() {
    this.baseFinder = new BaseFinder(formalUsermodel);
  }

  /**
   * Find the user with the _id (string)
   * In mongo all object have a _id
   * @param _id
   */
  public findById(_id: string) {
    return this.baseFinder.findById(_id);
  }
}

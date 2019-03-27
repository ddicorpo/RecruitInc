import { BaseFinder } from './BaseFinder';
import { Types } from 'mongoose';
import { questionsModel, questionsSchema } from '../schema/questionsSchema';
import { IQuestionsModel } from '../../domain/model/IQuestionModel';

/**
 * Inspired by: https://github.com/gsi-manuel/ts-nodejs-express-webpack/blob/master/src/services/province.service.ts
 * This class will be used to find/find all and other find User object
 * The class is using BaseFinder to do transaction allowing uniform transaction handling
 * and logging
 * *************************************************************
 * NOTE: This class doesn't include logic it's only transaction
 * *************************************************************
 */
export class QuestionsFinder {
  private baseFinder: BaseFinder = new BaseFinder(questionsModel);

  /**
   * Getting all tree queues
   */
  public findAll(): Promise<IQuestionsModel[]> {
    return this.baseFinder.findAll();
  }

  /**
   * get all the questions as part of a group
   * @param group
   */
  public findAllByGroup(group: string): Promise<IQuestionsModel> {
    return this.baseFinder.findBy({ type: group });
  }
}

import { BaseTDG } from './baseTDG';
import { Types, Model } from 'mongoose';
import { questionsSchema, questionsModel } from '../schema/questionsSchema';
import { IQuestionsModel } from '../../domain/model/IQuestionModel';

export class questionsTDG {
  private baseTDG: BaseTDG;

  constructor() {
    this.baseTDG = new BaseTDG(questionsSchema);
  }

  public create(
    questionsAttr: IQuestionsModel,
    id?: string
  ): Promise<IQuestionsModel[]> {
    questionsAttr._id = null;
    if (id != null) {
      questionsAttr._id = Types.ObjectId(id);
    } else {
      questionsAttr._id = Types.ObjectId();
    }

    const newQuestionsModel: Model<IQuestionsModel> = new questionsModel(
      questionsAttr
    );

    try {
      return this.baseTDG.create(newQuestionsModel, questionsAttr);
    } catch (Exception) {
      throw new Error('Error while creating questions model');
    }
  }

  public update(_id: string, updatedValue: IQuestionsModel): Promise<boolean> {
    try {
      const questionsModelToUpdate: Model<IQuestionsModel> = new questionsModel(
        updatedValue
      );
      return this.baseTDG.update(Types.ObjectId(_id), questionsModelToUpdate);
    } catch (Exception) {
      throw new Error('Error while updating questions Model');
    }
  }

  public delete(_id: string): Promise<boolean> {
    try {
      return this.baseTDG.delete(Types.ObjectId(_id));
    } catch (Exception) {
      throw new Error('Error while deleting questions Model');
    }
  }
}

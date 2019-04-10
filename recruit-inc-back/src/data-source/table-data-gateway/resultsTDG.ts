import { BaseTDG } from './baseTDG';
import { Types, Model } from 'mongoose';
import { resultsModel } from '../schema/resultsSchema';
import { IResultsModel } from '../../domain/model/IResultsModel';

export class resultsTDG {
  private baseTDG: BaseTDG;

  constructor() {
    this.baseTDG = new BaseTDG(resultsModel);
  }

  public create(
    resultsAttr: IResultsModel,
    id?: string
  ): Promise<IResultsModel[]> {
    resultsAttr._id = null;
    if (id != null) {
      resultsAttr._id = Types.ObjectId(id);
    } else {
      resultsAttr._id = Types.ObjectId();
    }

    const newResultsModel: Model<IResultsModel> = new resultsModel(resultsAttr);

    try {
      return this.baseTDG.create(newResultsModel, resultsAttr);
    } catch (Exception) {
      throw new Error('Error while creating results model');
    }
  }

  public update(_id: string, updatedValue: IResultsModel): Promise<boolean> {
    try {
      const resultsModelToUpdate: Model<IResultsModel> = new resultsModel(
        updatedValue
      );
      return this.baseTDG.update(Types.ObjectId(_id), resultsModelToUpdate);
    } catch (Exception) {
      throw new Error('Error while updating results model');
    }
  }

  public delete(_id: string): Promise<boolean> {
    try {
      return this.baseTDG.delete(Types.ObjectId(_id));
    } catch (Exception) {
      throw new Error('Error while deleting results model');
    }
  }
}

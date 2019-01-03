import { BaseTDG } from './baseTDG';
import { IApplicantModel } from '../../domain/model/IApplicantModel';
import { ApplicantModel } from '../schema/applicantSchema';
import { Types } from 'mongoose';

export class ApplicantTDG {
  private baseTDG: BaseTDG;

  constructor() {
    this.baseTDG = new BaseTDG(ApplicantModel);
  }

  public create(applicantAttr: IApplicantModel): Promise<IApplicantModel> {
    applicantAttr._id = Types.ObjectId();
    const newApplicantModel = new ApplicantModel(applicantAttr);

    try {
      return this.baseTDG.create(newApplicantModel, applicantAttr);
    } catch (Exception) {
      throw new Error('Error while creating Applicant');
    }
  }

  public update(_id: string, updatedValue: IApplicantModel): Promise<boolean> {
    try {
      const ApplicantModelToUpdate = new ApplicantModel(updatedValue);
      return this.baseTDG.update(Types.ObjectId(_id), ApplicantModelToUpdate);
    } catch (Exception) {
      throw new Error('Error while updating Applicant');
    }
  }

  public delete(_id: string): Promise<boolean> {
    try {
      return this.baseTDG.delete(Types.ObjectId(_id));
    } catch (Exception) {
      throw new Error('Error while delete Applicant');
    }
  }
}

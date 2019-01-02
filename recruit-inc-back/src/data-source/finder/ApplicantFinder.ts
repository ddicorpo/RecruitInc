import { ApplicantModel } from '../schema/applicantSchema';
import { IApplicantModel } from '../../domain/model/IApplicantModel';
import { UserType } from '../../domain/model/IApplicantModel';
import { BaseFinder } from './BaseFinder';
import { Types } from 'mongoose';

export class ApplicantFinder {
    private baseFinder: BaseFinder = new BaseFinder(ApplicantModel);
  public findById(_id: string): Promise<IApplicantModel> {
      return this.baseFinder.findById(_id);
  }

  public findByPlatformUsername(
    platformUsername: string
  ): Promise<IApplicantModel> {
      return this.baseFinder.findOneBy(this.baseFinder.buildQuery("platformUsername", platformUsername));
  }

  public findByPlatformEmail(platformEmail: string): Promise<IApplicantModel> {
      return this.baseFinder.findOneBy(this.baseFinder.buildQuery("platformEmail", platformEmail));
  }

  public findByUserType(userType: UserType): Promise<IApplicantModel> {
      return this.baseFinder.findBy(this.baseFinder.buildQuery("userType", userType));
  }

  public findAll(): Promise<IApplicantModel> {
      return this.baseFinder.findAll();
  }
}

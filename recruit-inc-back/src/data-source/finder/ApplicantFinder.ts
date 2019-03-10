import { ApplicantModel } from '../schema/applicantSchema';
import { IApplicantModel } from '../../domain/model/IApplicantModel';
import { UserType } from '../../domain/model/IApplicantModel';
import { BaseFinder } from './BaseFinder';
import { Types } from 'mongoose';
import { CandidatePage } from '../../domain/model/CandidatePageModel';

export class ApplicantFinder {
    private baseFinder: BaseFinder = new BaseFinder(ApplicantModel);
  public findById(_id: string): Promise<IApplicantModel> {
      return this.baseFinder.findById(_id);
  }

  public findByPlatformUsername(
    platformUsername: string
  ): Promise<IApplicantModel> {
      return this.baseFinder.findOneBy({platformUsername});
  }

  public findByPlatformEmail(platformEmail: string): Promise<IApplicantModel> {
      return this.baseFinder.findOneBy({platformEmail});
  }

  public findByUserType(userType: UserType): Promise<IApplicantModel> {
      return this.baseFinder.findBy({userType});
  }

  public findByPageQuery(query : string, page : number) : Promise<IApplicantModel>{
      //TODO: Build query to filter by e.g. technologie not equal 0...
      //We should try to do that using mongo query
      return this.baseFinder.findByWithPage(query, page, CandidatePage.size);
  }

  public findAll(): Promise<IApplicantModel> {
      return this.baseFinder.findAll();
  }
}

import { ApplicantModel } from '../schema/applicantSchema';
import { IApplicantModel } from '../../domain/model/IApplicantModel';
import { UserType } from '../../domain/model/IApplicantModel';
import { BaseFinder } from './BaseFinder';
import { Types } from 'mongoose';

export class ApplicantFinder {
    private baseFinder: BaseFinder = new BaseFinder();
  public findById(_id: string): Promise<IApplicantModel> {
      return this.baseFinder.findById(ApplicantModel, _id);
  }

  public findByPlatformUsername(
    platformUsername: string
  ): Promise<IApplicantModel> {
   // return new Promise((resolve: any, reject: any) => {
   //   ApplicantModel.findOne(
   //     { platformUsername: platformUsername },
   //     (error: any, obj: any) => {
   //       if (error) reject(error.name + ': ' + error.message);
   //       obj ? resolve(obj) : resolve();
   //     }
   //   );
    //});
      var query = {};
      query["platformUsername"] = platformUsername;
      return this.baseFinder.findOneBy(ApplicantModel, query);
  }

  public findByPlatformEmail(platformEmail: string): Promise<IApplicantModel> {
   // return new Promise((resolve: any, reject: any) => {
   //   ApplicantModel.findOne(
   //     { platformEmail: platformEmail },
   //     (error: any, obj: any) => {
   //       if (error) reject(error.name + ': ' + error.message);
   //       obj ? resolve(obj) : resolve();
   //     }
   //   );
   // });
      var query = {};
      query["platformEmail"] = platformEmail;
      return this.baseFinder.findOneBy(ApplicantModel, query);
  }

  public findByUserType(userType: UserType): Promise<IApplicantModel> {
   // return new Promise((resolve: any, reject: any) => {
   //   ApplicantModel.find({ userType: userType }, (error: any, obj: any) => {
   //     if (error) reject(error.name + ': ' + error.message);
   //     obj ? resolve(obj) : resolve();
   //   });
   // });
      var query = {};
      query["userType"] = userType;
      return this.baseFinder.findBy(ApplicantModel, query);
  }

  public findAll(): Promise<IApplicantModel> {
   // return new Promise((resolve: any, reject: any) => {
   //   ApplicantModel.find({}, (error: any, obj: any) => {
   //     if (error) reject(error.name + ': ' + error.message);
   //     obj ? resolve(obj) : resolve();
   //   });
   // });
      return this.baseFinder.findAll(ApplicantModel);
  }
}

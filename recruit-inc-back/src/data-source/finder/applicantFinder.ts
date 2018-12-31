import { ApplicantModel } from '../schema/applicantSchema';
import { IApplicantModel } from '../../domain/model/IApplicantModel';
import { UserType } from '../../domain/model/IApplicantModel';
import { Types } from 'mongoose';

export class ApplicantFinder {
  public findById(_id: string): Promise<IApplicantModel> {
    return new Promise((resolve: any, reject: any) => {
      ApplicantModel.findOne(Types.ObjectId(_id), (error: any, obj: any) => {
        if (error) reject(error.name + ': ' + error.message);
        obj ? resolve(obj) : resolve();
      });
    });
  }

  public findByPlatformUsername(
    platformUsername: string
  ): Promise<IApplicantModel> {
    return new Promise((resolve: any, reject: any) => {
      ApplicantModel.findOne(
        { platformUsername: platformUsername },
        (error: any, obj: any) => {
          if (error) reject(error.name + ': ' + error.message);
          obj ? resolve(obj) : resolve();
        }
      );
    });
  }

  public findByPlatformEmail(platformEmail: string): Promise<IApplicantModel> {
    return new Promise((resolve: any, reject: any) => {
      ApplicantModel.findOne(
        { platformEmail: platformEmail },
        (error: any, obj: any) => {
          if (error) reject(error.name + ': ' + error.message);
          obj ? resolve(obj) : resolve();
        }
      );
    });
  }

  public findByUserType(userType: UserType): Promise<IApplicantModel> {
    return new Promise((resolve: any, reject: any) => {
      ApplicantModel.find({ userType: userType }, (error: any, obj: any) => {
        if (error) reject(error.name + ': ' + error.message);
        obj ? resolve(obj) : resolve();
      });
    });
  }

  public findAll(): Promise<IApplicantModel> {
    return new Promise((resolve: any, reject: any) => {
      ApplicantModel.find({}, (error: any, obj: any) => {
        if (error) reject(error.name + ': ' + error.message);
        obj ? resolve(obj) : resolve();
      });
    });
  }
}

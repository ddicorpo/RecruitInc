import 'mocha';
import { MongoConnectionFactory } from '../../../src/data-source/db-registry/mongo/MongoConnectionFactory';
import { ApplicantTDG } from '../../../src/data-source/table-data-gateway/applicantTDG';
import { IApplicantModel } from '../../../src/domain/model/IApplicantModel';
import { UserType } from '../../../src/domain/model/IApplicantModel';
import * as mongoose from 'mongoose';
import { Platform, IGitDataModel } from '../../../src/domain/model/IGitDataModel';
import { ITokenModel } from '../../../src/domain/model/ITokenModel';
import { IGitProjectSummary } from '../../../src/matching-algo/data-model/output-model/IGitProjectSummary';
import { ILanguageOutput } from '../../../src/matching-algo/data-model/output-model/ILanguageOutput';
import { IGitProjectOutput } from '../../../src/matching-algo/data-model/output-model/IGitProjectOutput';

require('dotenv').config(); //Get environment variables

/**
 * This is a mock used to mock the applicant table.
 * This test shall only be used in QA, Integration testing
 */
xdescribe('Mock Fill Applicant Table', () => {
    const applicantTDG: ApplicantTDG = new ApplicantTDG();
    const numberOfMock : number = 10;
    before(() => {
        // Establish connection
        let myFactory: MongoConnectionFactory = new MongoConnectionFactory();
        myFactory.defaultInitialization();
        // Start connection
        myFactory.getConnection();
    });

    after(() => {
        mongoose.connection.close();
        console.log(mongoose.connection.readyState);
    });

    it('Test mongo create a group of applicant', async () => {
        const factory : ApplicanMockFactory = new ApplicanMockFactory();
        const applicantsToAdd : IApplicantModel[] = factory.getFakeApplicant(numberOfMock);
        if(process.env.DB_NAME === 'RecruitInc'){
            console.log("PRODUCTION !!!! Quitting");
            return;
        }

        for(let obj of applicantsToAdd){
            console.log(obj);
        }


    });
});


export class ApplicanMockFactory{

    public getFakeApplicant(mockToSend : number) : IApplicantModel[] {
        const applicantsList : IApplicantModel[] = [];
        for(let index = 0; index < mockToSend; index++){
            const applicant : IApplicantModel = this.getNewRandomApplicant();
            applicantsList.push();
        }
        return applicantsList;
    }


    private getNewRandomApplicant() : IApplicantModel {
        return undefined;
    }

    private generateRandomIToken(): ITokenModel {
        return undefined
    }

    private generateRandomIGitData() : IGitDataModel {
        return undefined
    }

    private generateRandomIGitProjectSummray() : IGitProjectSummary {
        return undefined;
    }

    private generateRandomLanguageOutput() : ILanguageOutput {
        return undefined
    }

    private generateRandomGitProjectOutput(): IGitProjectOutput {
        return undefined
    }




}

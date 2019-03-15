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
import { IFrameworkOutput } from '../../../src/matching-algo/data-model/output-model/IFrameworkOutput';
import { Technologies } from '../../../src/matching-algo/data-model/output-model/Technologies';
var casual = require('casual');
require('dotenv').config(); //Get environment variables

/**
 * This is a mock used to mock the applicant table.
 * This test shall only be used in QA, Integration testing
 */
xdescribe('Mock Fill Applicant Table', () => {
    const tdg: ApplicantTDG = new ApplicantTDG();
    const numberOfMock : number = 1;

    before(() => {
        // Establish connection
        let myFactory: MongoConnectionFactory = new MongoConnectionFactory();
        myFactory.defaultInitialization();
        // Start connection
        myFactory.getConnection();
    });

    after(() => {
        mongoose.connection.close();
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
            console.log(obj.iGit.IGitData[0].gitProjectSummary);
            try{
               await tdg.create(obj);
            }catch(Exception){
                console.log("Problem while executing test");
                console.log(Exception)
            }
        }
    });
});


export class ApplicanMockFactory{
    


    public getFakeApplicant(mockToSend : number) : IApplicantModel[] {
        const applicantsList : IApplicantModel[] = [];
        for(let index = 0; index < mockToSend; index++){
            const applicant : IApplicantModel = this.getNewRandomApplicant();
            applicantsList.push(applicant);
        }
        return applicantsList;
    }


    private getNewRandomApplicant() : IApplicantModel {
        let email : string = casual.email;
        let username : string = email.substr(0, email.indexOf('@'));
        let applicant : IApplicantModel = {
            platformUsername: username,
            platformEmail: email,
            iGit : {
                IGitData: [this.generateRandomIGitData()],
                IToken: this.generateRandomIToken()
            },
            userType: UserType.Applicant
        }
        return applicant;
    }

    private generateRandomIToken(): ITokenModel {
        let token : ITokenModel = {
            platform: Platform.Github,
            AccessToken: casual.uuid,
            RefreshToken: casual.uuid,
            ExpiryDate: casual.date('YYYY-MM-DD').toString()
        }

        return token;
    }

    private generateRandomIGitData() : IGitDataModel {
        let gitData : IGitDataModel = {
            dataEntry : null,
            gitProjectSummary : this.generateRandomIGitProjectSummary(),
            lastKnownInfoDate: casual.date('YYYY-MM-DD').toString(),
            platform: Platform.Github
        }
        return gitData;
    }

    private generateRandomIGitProjectSummary() : IGitProjectSummary {
        let projSummary : IGitProjectSummary = {
            totalOutput: this.generateRandomLanguageOutput(),
            projectsOutput: this.generateRandomGitProjectOutput()
        }
        return projSummary;
    }

    private generateRandomLanguageOutput() : ILanguageOutput[] {


        let languages : string[] = []

        languages.push(Technologies.Csharp);
        languages.push(Technologies.Java);
        languages.push(Technologies.Python);
        languages.push(Technologies.Javascript);

        let languagesOutput: ILanguageOutput[] = []

        for(let lang in languages){
            
            let linesOfCode : number = 0;
            let numberOfCommits : number = 0;
            const techUsedByUser : boolean = (Math.round(casual.random * 10) >= 7);
            if(techUsedByUser){
                linesOfCode = Math.round(casual.random * 3000);
                numberOfCommits = Math.round(casual.random * 500)
            }
            let langOutput : ILanguageOutput = {
                languageOrFramework: languages[lang],
                linesOfCode: linesOfCode ,
                numberOfCommits: numberOfCommits,
                frameworks:this.generateRandomFrameworkOutput()
            }
            
            languagesOutput.push(langOutput);
        }

        return languagesOutput;
        
    }

    private generateRandomGitProjectOutput(): IGitProjectOutput[] {
        return []
    }

    private generateRandomFrameworkOutput(): IFrameworkOutput[] {
        return []
    }




}

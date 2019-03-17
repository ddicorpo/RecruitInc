import { AbstractCommand } from "./AbstractCommand";
import { ApplicantTDG } from "../../data-source/table-data-gateway/applicantTDG";
import {RequestContext } from './RequestContext';
import {IApplicantModel} from '../model/IApplicantModel';
import { IsCandidateInStorageCommand } from './IsCandidateInStorageCommand';
import { ApplicantFinder } from "../../data-source/finder/ApplicantFinder";

export class InsertCandidateCommand extends AbstractCommand {

    private applicantTDG: ApplicantTDG = new ApplicantTDG();
    private applicantFinder : ApplicantFinder = new ApplicantFinder();
    private inStorageCommand : IsCandidateInStorageCommand = 
    new IsCandidateInStorageCommand();

    constructor(applicationContext?: RequestContext) {
        super();
    }

    public async insertCandidate(applicant: IApplicantModel): Promise<Boolean> {
        const isInsertCompleted : Boolean = 
        await this.inStorageCommand.isCandidateIn(applicant.platformUsername);
        let commandStatus : boolean = false;
        try{
            if(isInsertCompleted){
                //Grab the id of the object
                const foundApplicant : IApplicantModel =
                 await this.applicantFinder.findByPlatformUsername(applicant.platformUsername);
                //Update Candidate with the new value
                applicant._id = foundApplicant._id;
                commandStatus = await this.applicantTDG.update(foundApplicant._id, applicant);
                
            }else{
                //Insert the new candidate
                const newApplicant : IApplicantModel = 
                await this.applicantTDG.create(applicant);
                commandStatus = (newApplicant.platformUsername === applicant.platformUsername)
            }

            if(commandStatus){
                this.logActionCompleted(this.insertCandidate.name);
            }else{
                this.logActionFailure(this.insertCandidate.name,
                     "Error", "Error while adding a candidate")
            }

            return new Promise(function(resolve){
                resolve(commandStatus);
            })
        
        }catch(CommandException){
            this.logActionFailure(this.insertCandidate.name,
                CommandException.name, CommandException.message);
        }
    }

}
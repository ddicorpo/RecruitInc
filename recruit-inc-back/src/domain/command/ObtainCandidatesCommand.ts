import { AbstractCommand } from './AbstractCommand';
import { RequestContext } from './RequestContext';
import { ApplicantFinder } from '../../data-source/finder/ApplicantFinder'
import { IApplicantModel } from '../model/IApplicantModel';

// Usually you want to go through a factory/Data Mapper model
// This is a temporary command

export class ObtainCandidatesCommand extends AbstractCommand {

    private finder : ApplicantFinder = new ApplicantFinder();
    constructor(applicationContext?: RequestContext) {
        super();
    }
    public async execute(page: number, filter : string, location: string): Promise<any> {
        try{
            let allCandidates : IApplicantModel = await this.finder.findAll()
            return JSON.stringify(allCandidates);
        }catch(CommandException){
            throw CommandException
        }
    }


}
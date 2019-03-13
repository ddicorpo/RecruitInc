import { AbstractCommand } from './AbstractCommand';
import { RequestContext } from './RequestContext';
import { ApplicantFinder } from '../../data-source/finder/ApplicantFinder';
import { IApplicantModel } from '../model/IApplicantModel';

// Usually you want to go through a factory/Data Mapper model
// This is a temporary command

export class ObtainCandidatesCommand extends AbstractCommand {
  private finder: ApplicantFinder = new ApplicantFinder();
  constructor(applicationContext?: RequestContext) {
    super();
  }
  public async getCandidates(page: number, filter: string): Promise<any> {
    try {
      //Build query from filter...
      //TODO: Handle technologies... e.g. Java, Python
      const query = undefined;

      //Prevent crash of the application by inserting page=-1 or page=0
      if (page < 1) {
        page = 1;
      }
      //TODO Build the query based on the filter...
      let allCandidates: IApplicantModel = await this.finder.findByPageQuery(
        query,
        page
      );
      return JSON.stringify(allCandidates);
    } catch (CommandException) {
      throw CommandException;
    }
  }

  public async getAllCandidates(): Promise<any> {
    try {
      let allCandidates: IApplicantModel = await this.finder.findAll();
      return JSON.stringify(allCandidates);
    } catch (CommandException) {
      throw CommandException;
    }
  }

  public async getCandidatesTechnologies(
    page: number,
    filter: string
  ): Promise<any> {
    try {
      // query to filter technology for a specific candidate

      const query = undefined;

      if (page < 1) {
        page = 1;
      }

      let CandidatesTechnologies: IApplicantModel = await this.finder.findByPageQuery(
        query,
        page
      );
      return JSON.stringify(CandidatesTechnologies);
    } catch (CommandException) {
      throw CommandException;
    }
  }
}

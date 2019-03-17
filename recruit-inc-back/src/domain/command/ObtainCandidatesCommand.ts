import { AbstractCommand } from './AbstractCommand';
import { RequestContext } from './RequestContext';
import { ApplicantFinder } from '../../data-source/finder/ApplicantFinder';
import { IApplicantModel } from '../model/IApplicantModel';

// Usually you want to go through a factory/Data Mapper model
// This is a temporary command

export class ObtainCandidatesCommand extends AbstractCommand {
  private baseQuery: String = 'db.applicants.find(';

  private queryExclude: String =
    '{"iGit.IGitData.dataEntry.projectInputs.applicantCommits": 0, "iGit.IGitData.dataEntry.projectInputs.projectStructure": 0, "iGit.IGitData.dataEntry.projectInputs.downloadedSourceFile": 0, "iGit.IToken": 0}';

  private finder: ApplicantFinder = new ApplicantFinder();
  constructor(applicationContext?: RequestContext) {
    super();
  }
  public async getCandidates(page: number, filters: string[]): Promise<any> {
    try {
      const query: string = this.getQuery(filters);

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

  private getQuery(filters: string[]): string {
    let findQuery: string =
      filters.length > 0
        ? '{"iGit.IGitData.gitProjectSummary.totalOutput": {\'$all\': ['
        : '{}';
    const filtersMatch: string[] = [];
    for (const filter of filters) {
      filtersMatch.push(this.generateFilterMatch(filter));
    }
    if (filters.length > 0) {
      findQuery += filtersMatch.join(', ') + ']}}';
    }

    return this.baseQuery + findQuery + ', ' + this.queryExclude + ')';
  }

  private generateFilterMatch(language: string): string {
    return (
      '{$elemMatch: {languageOrFramework: "' +
      language +
      '", "$and": [ {linesOfCode: {$gt: 0}}, {numberOfCommits: {$gt : 0} }] }}'
    );
  }
}

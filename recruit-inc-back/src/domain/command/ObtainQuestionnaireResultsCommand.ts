import { AbstractCommand } from './AbstractCommand';
import { RequestContext } from './RequestContext';
import { ResultsFinder } from '../../data-source/finder/ResultsFinder';
import { IResultsModel } from '../model/IResultsModel';

export class ObtainQuestionnaireResultsCommand extends AbstractCommand {
  private finder: ResultsFinder = new ResultsFinder();

  constructor(applicationContext?: RequestContext) {
    super();
  }

  public async getQuestionnaireResults(
    page: number,
    filters: string[]
  ): Promise<any> {
    try {
      const query =
        filters.length > 0
          ? filters
              .map(filter => {
                return {};
              })
              .reduce((aggregate, item) => Object.assign(aggregate, item), {})
          : {};

      //Prevent crash of the application by inserting page=-1 or page=0
      if (page < 1) {
        page = 1;
      }

      let allResults: IResultsModel[] = await this.finder.findAll();

      return JSON.stringify(allResults);
    } catch (CommandException) {
      throw CommandException;
    }
  }
}

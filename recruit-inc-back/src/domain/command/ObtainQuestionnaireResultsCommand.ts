import { AbstractCommand } from './AbstractCommand';
import { RequestContext } from './RequestContext';
import { ResultsFinder } from '../../data-source/finder/ResultsFinder';
import { IResultsModel } from '../model/IResultsModel';

export class ObtainQuestionnaireResultsCommand extends AbstractCommand {
  private finder: ResultsFinder = new ResultsFinder();

  constructor(applicationContext?: RequestContext) {
    super();
  }

  public async getQuestionnaireResults(): Promise<any> {
    try {
      let allResults: IResultsModel[] = await this.finder.findAll();

      return JSON.stringify(allResults);
    } catch (CommandException) {
      throw CommandException;
    }
  }
}
